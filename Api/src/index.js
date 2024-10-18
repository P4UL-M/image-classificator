import express from 'express';
import { connectToDatabase, createTables, populateDatabase } from './services/db.service.js';
import authRouter from './routes/auth.js';
import classifyRouter from './routes/classify.js';
import { specs, swaggerUi } from './swagger.js';
import userRouter from './routes/user.js';

connectToDatabase().then(() => createTables()).then(populateDatabase).then(() => {
    console.log('Database initialized');
}).catch((error) => { console.error('Error initializing database:', error.message || error); });

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(authRouter);
app.use(classifyRouter);
app.use(userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});