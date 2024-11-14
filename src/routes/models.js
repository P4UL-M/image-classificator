const express = require('express');
const { listModels, grpcClient } = require('../services/grpc.service.js');
const { logger } = require('../utils/logger.js');

const modelRouter = express.Router();

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Récupère la liste des modèles 🚀.
 *     description: Appelle le service gRPC pour récupérer la liste des modèles disponibles.
 *     responses:
 *       200:
 *         description: Liste des modèles récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Le nom du modèle
 *                   description:
 *                     type: string
 *                     description: La description du modèle
 *                   version:
 *                     type: string
 *                     description: La version du modèle
 *                   accuracy:
 *                     type: number
 *                     description: La précision du modèle
 *       500:
 *         description: Erreur lors du traitement de la requête.
 */
modelRouter.get('/models', (req, res) => {
    try {
        listModels(grpcClient, req, res);
    } catch (error) {
        logger.error(error);
        res.status(500).send('Error processing request.');
    }
});

module.exports = modelRouter;