const express = require('express');
const { listModels, grpcClient } = require('../services/grpc.service.js');
const { logger } = require('../utils/logger.js');

const modelRouter = express.Router();

modelRouter.get('/models', (req, res) => {
    listModels(grpcClient, req, res);
});

module.exports = modelRouter;