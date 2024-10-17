import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';
import { Stream } from 'stream';
import { fileURLToPath } from 'url';
import express from 'express';

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = __dirname + '/../proto/mlService.proto';


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const mlService = grpc.loadPackageDefinition(packageDefinition).imageclassificator;

const grpcClient = new mlService.ImageClassificator('localhost:9090', grpc.credentials.createInsecure());

/**
 * Classifies a file by sending its content to the gRPC server.
 *
 * @param {import('@grpc/grpc-js').GrpcObject} client - The gRPC client instance.
 * @param {string} file - The path to the file to be classified.
 */
function classifyFileWithPath(client, file) {
    const call = client.ClassifyFile((error, response) => {
        if (error) {
            console.error(error);
        } else {
            console.log(response);
        }
    });

    const fileContent = fs.createReadStream(file);
    fileContent.on('data', (chunk) => {
        console.log('Sending chunk');
        call.write({ file_content: chunk });
    });

    fileContent.on('end', () => {
        call.end();
    });
}

/**
 * Classifies a file by sending its content to the gRPC server.
 *
 * @param {import('@grpc/grpc-js').GrpcObject} client - The gRPC client instance.
 * @param {import('express').Request} req - The path to the file to be classified.
 * @param {import('express').Response} res - The Express response object.
 */
function classifyFileWithStream(client, req, res) {
    const call = client.ClassifyFile((error, response) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error processing request.');
        } else {
            console.log("Response received from server");
            res.status(200).send(response);
        }
    });

    req.on('data', (chunk) => {
        try {
            call.write({ file_content: chunk });
        } catch (err) {
            console.error('Error sending chunk:', err.message || err);
            req.destroy();
            call.end();
        }
    });

    req.on('end', () => {
        call.end();
    });

    req.on('error', (err) => {
        console.error('Stream error:', err.message || err);
        call.end();
    });
}


const PORT = process.env.PORT || 3000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit
const app = express();

// Middleware to validate file type and size
function validateFileTypeAndSize(req, res, next) {
    const allowedMimeTypes = ['image/png', 'image/jpeg'];

    // Check if the request is an accepted mime type
    if (!allowedMimeTypes.includes(req.headers['content-type'])) {
        return res.status(415).send('Unsupported file type.');
    }

    // We expect 'file' to be a part of the form-data
    let totalSize = 0;

    req.on('data', (chunk) => {
        totalSize += chunk.length;

        // Reject if file size exceeds the limit
        if (totalSize > MAX_FILE_SIZE) {
            req.destroy(new Error('File size exceeds limit.'));
        }
    });

    req.on('end', () => {
        // Ensure total size is under the limit
        if (totalSize > MAX_FILE_SIZE) {
            return res.status(413).send('File size exceeds limit.');
        }
    });

    next();
}

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