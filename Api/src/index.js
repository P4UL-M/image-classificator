import express from 'express';
import { validateFileTypeAndSize } from './middlewares/file.middleware.js';
import { classifyFileWithStream, createGrpcClient } from './services/grpc.service.js';
import { sequelize, connectToDatabase, createTables } from './services/db.service.js';
import { authenticateUser, createUser } from './services/user.service.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const grpcClient = createGrpcClient(9090);
connectToDatabase().then(() => createTables());

app.get('/classify', authMiddleware, validateFileTypeAndSize, (req, res) => {
    try {
        // Directly pass the request stream (req) to the classifyFileWithStream function
        classifyFileWithStream(grpcClient, req, res);
    } catch (err) {
        console.error('Error processing request:', err.message || err);
        res.status(500).send('Error processing request.');
    }
});

app.post('/register', async (req, res) => {
    // check if the request body contains the required fields
    if (!req.body?.username || !req.body?.email || !req.body?.password) {
        return res.status(400).send('Missing required fields.');
    }

    const { username, email, password } = req.body;

    try {
        await createUser(username, email, password);
        res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error('Error registering user:', error.message || error);
        res.status(500).send('Error registering user.');
    }
});

app.get('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authenticateUser(email, password);
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error authenticating user:', error.message || error);
        res.status(401).send('Invalid credentials.');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});