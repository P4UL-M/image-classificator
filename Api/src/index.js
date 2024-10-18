import express from 'express';
import cors from 'cors';
import { connectToDatabase, createTables, populateDatabase } from './services/db.service.js';
import authRouter from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import { specs, swaggerUi } from './swagger.js';
import userRouter from './routes/user.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { logger } from './utils/logger.js';

connectToDatabase().then(createTables).then(populateDatabase).then(() => {
    logger.info('Database initialized');
}).catch((error) => { logger.error('Error initializing database:', error.message || error); });

const allowedOrigins = [
    'http://localhost',  // For Frontend server
    'http://localhost:3000'  // For API server
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
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
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});