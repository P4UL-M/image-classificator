/**
 * @swagger
 * tags:
 *   name: Classify
 *   description: API pour classifier des fichiers
 */

/**
 * @swagger
 * /classify:
 *   post:
 *     summary: Classify an image file
 *     description: This route accepts an image file in JPEG format, validates the file, and streams it to a gRPC server for classification. The user must be authenticated.
 *     tags:
 *      - Classify
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         image/jpeg:
 *           schema:
 *             type: string
 *             format: binary
 *           description: The image file to be classified
 *     responses:
 *       200:
 *         description: Image classified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classification:
 *                   type: string
 *                   description: The classification result
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized, bearer token missing or invalid
 *       500:
 *         description: Internal server error
 */
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateFileTypeAndSize } from '../middlewares/file.middleware.js';
import { classifyFileWithStream, createGrpcClient } from '../services/grpc.service.js';

const classifyRouter = express.Router();
const grpcClient = createGrpcClient(9090);

classifyRouter.post('/classify', authMiddleware, validateFileTypeAndSize, (req, res) => {
    try {
        // Directly pass the request stream (req) to the classifyFileWithStream function
        classifyFileWithStream(grpcClient, req, res);
    } catch (err) {
        console.error('Error processing request:', err.message || err);
        res.status(500).send('Error processing request.');
    }
});

export default classifyRouter;