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
    httpServerApp.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });
}

startServer();

// Export the app for testing
module.exports = app;
module.exports.httpServerApp = httpServerApp;