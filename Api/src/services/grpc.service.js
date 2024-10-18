import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, '../../protos/mlService.proto');
const PORT = process.env.GRPC_PORT || 9090;
const HOST = process.env.GRPC_HOST || 'localhost';

/**
 * Creates a gRPC client for the ImageClassificator service.
 * 
 * @param {string} [host=HOST] - The host to connect to.
 * @param {number} [port=PORT] - The port number to connect to.
 * @param {string} [protoPath=PROTO_PATH] - The path to the .proto file.
 * 
 * @returns {import('@grpc/grpc-js').GrpcObject} The gRPC client instance.
 */
export function createGrpcClient(host = HOST, port = PORT, protoPath = PROTO_PATH) {
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const mlService = grpc.loadPackageDefinition(packageDefinition).imageclassificator;

    return new mlService.ImageClassificator(`${host}:${port}`, grpc.credentials.createInsecure());
}

/**
 * Classifies a file by sending its content to the gRPC server.
 *
 * @param {import('@grpc/grpc-js').GrpcObject} client - The gRPC client instance.
 * @param {string} file - The path to the file to be classified.
 */
export function classifyFileWithPath(client, file) {
    const call = client.ClassifyFile((error, response) => {
        if (error) {
            console.error(error);
        } else {
            console.log(response);
        }
    });

    const fileContent = fs.createReadStream(file);
    fileContent.on('data', (chunk) => {
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
export function classifyFileWithStream(client, req, res) {
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
            console.log('Sending chunk');
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
