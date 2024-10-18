import express from 'express';
import cors from 'cors';
import { connectToDatabase, createTables, populateDatabase } from './services/db.service.js';
import authRouter from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import { specs, swaggerUi } from './swagger.js';
import userRouter from './routes/user.js';

connectToDatabase().then(createTables).then(populateDatabase).then(() => {
    console.log('Database initialized');
}).catch((error) => { console.error('Error initializing database:', error.message || error); });

const allowedOrigins = [
    'http://localhost',  // For Frontend server
    'http://localhost:3000'  // For API server
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            console.log('Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('Origin not allowed:', origin);
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
    .use(authRouter)
    .use(classifyRouter)
    .use(userRouter)
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});