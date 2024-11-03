const express = require('express');
const { listModels, grpcClient } = require('../services/grpc.service.js');
const { logger } = require('../utils/logger.js');

const modelRouter = express.Router();

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Récupère la liste des modèles.
 *     description: Appelle le service gRPC pour récupérer la liste des modèles disponibles.
 *     responses:
 *       200:
 *         description: Liste des modèles récupérée avec succès.
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