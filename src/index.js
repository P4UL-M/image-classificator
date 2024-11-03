const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./services/db.service');
const authRouter = require('./routes/auth');
const classifyRouter = require('./routes/classify');
const { specs, swaggerUi } = require('./swagger');
const userRouter = require('./routes/user');
const modelRouter = require('./routes/models');
const loggerMiddleware = require('./middlewares/logger.middleware');
const { logger } = require('./utils/logger');
const http = require('http');
const { grpcClient } = require('./services/grpc.service');

const allowedOrigins = [
    'http://localhost:5173',  // For REACT server
    ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(origin + ' is not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors(corsOptions))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(loggerMiddleware)
    .use(authRouter)
    .use(classifyRouter)
    .use(userRouter)
    .use(modelRouter)
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Export the HTTP server for testing
const httpServerApp = http.createServer(app);

async function startServer() {
    await connectToDatabase();
    // Check if the gRPC server is available
    grpcClient.waitForReady(Date.now() + 5000, (error) => {
        if (error) {
            logger.error('Error connecting to gRPC server: ' + error.message || error);
            logger.warn('Some features may not work as expected until the gRPC server is available.');
        } else {
            logger.info('Connected to gRPC server');
        }
    });
    // Start the HTTP server
    httpServerApp.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
        logger.info(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
}

startServer();

// Export the app for testing
module.exports = app;
module.exports.httpServerApp = httpServerApp;