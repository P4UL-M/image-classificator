import express from 'express';
import { validateFileTypeAndSize } from './middlewares/file.middleware.js';
import { classifyFileWithStream, createGrpcClient } from './services/grpc.service.js';

const PORT = process.env.PORT || 3000;
const app = express();
const grpcClient = createGrpcClient(9090);

app.get('/classify', validateFileTypeAndSize, (req, res) => {
    try {
        // Directly pass the request stream (req) to the classifyFileWithStream function
        classifyFileWithStream(grpcClient, req, res);
    } catch (err) {
        console.error('Error processing request:', err.message || err);
        res.status(500).send('Error processing request.');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});