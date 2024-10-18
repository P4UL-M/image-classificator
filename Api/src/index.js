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


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json())
    .use(authRouter)
    .use(classifyRouter)
    .use(userRouter)
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// cors from all origins
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});