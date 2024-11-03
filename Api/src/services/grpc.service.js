const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger.js');

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
function createGrpcClient(host = HOST, port = PORT, protoPath = PROTO_PATH) {
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
function classifyFileWithPath(client, file) {
    const call = client.ClassifyFile((error, response) => {
        if (error) {
            logger.error(error);
        } else {
            logger.info(response);
        }
    });

    const fileContent = fs.createReadStream(file);

    fileContent.on('open', () => {
        call.write({ model_name: 'mobilenet_v2' });
    });

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
function classifyFileWithStream(client, req, res) {
    const call = client.ClassifyFile((error, response) => {
        if (res.headersSent) return;
        if (error) {
            logger.error(error);
            res.status(500).send('Error processing request:' + error.message || error);
        } else {
            logger.info("Response received from ML server");
            res.status(200).send(response);
        }
    });

    if (req.query.model)
        call.write({ model_name: req.query.model });

    req.on('data', (chunk) => {
        try {
            call.write({ file_content: chunk });
        } catch (err) {
            logger.error('Error sending chunk:', err.message || err);
            call.end();
        }
    });

    req.on('end', () => {
        call.end();
    });

    req.on('error', (err) => {
        logger.error('Stream error:', err.message || err);
        call.end();
    });
}

/**
 * Lists the available models from the gRPC server.
 * @param {import('@grpc/grpc-js').GrpcObject} client - The gRPC client instance.
 * @param {import('express').Request} _ - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
function listModels(client, _, res) {
    return client.ListModels({}, (error, response) => {
        if (error) {
            logger.error(error);
            res.status(500).send('Error processing request.');
        } else {
            logger.info("Response received from ML server");
            res.status(200).send(response);
        }
    });

}

const grpcClient = createGrpcClient();

// Wait for the gRPC client to be ready before accepting requests
grpcClient.waitForReady(Date.now() + 5000, (error) => {
    if (error) {
        logger.error('Error connecting to gRPC server: ' + error.message || error);
        logger.warn('Some features may not work as expected until the gRPC server is available.');
    } else {
        logger.info('Connected to gRPC server');
    }
});

exports.classifyFileWithPath = classifyFileWithPath;
exports.classifyFileWithStream = classifyFileWithStream;
exports.listModels = listModels;
exports.grpcClient = grpcClient;