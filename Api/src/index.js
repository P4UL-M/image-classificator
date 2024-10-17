import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = __dirname + '/../proto/mlService.proto';

function main() {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const mlService = grpc.loadPackageDefinition(packageDefinition).imageclassificator;

    const client = new mlService.ImageClassificator('localhost:9090', grpc.credentials.createInsecure());

    classifyFile(client, 'public/images/test.jpg');
}
/**
 * Classifies a file by sending its content to the gRPC server.
 *
 * @param {import('@grpc/grpc-js').GrpcObject} client - The gRPC client instance.
 * @param {string} file - The path to the file to be classified.
 */
function classifyFile(client, file) {
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

main();