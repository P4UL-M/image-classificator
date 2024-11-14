const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { updateUserBalance } = require('../services/user.service');
const { addOrder, listOrdersByUser } = require('../services/order.service');
const { transaction } = require('../services/db.service');
const { logger } = require('../utils/logger');

const storeRouter = express.Router();

// Endpoint to add tokens to the user's account
storeRouter.post('/buy-tokens', authMiddleware, async (req, res) => {
    const { user } = req;
    const { amount } = req.body;

    // Check if the amount is a positive number
    if (!amount || amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    // Add the amount to the user's account
    transaction(async (t) => {
        await updateUserBalance(user.id, amount, { transaction: t });
        await addOrder({ userId: user.id, amount, status: 'completed' }, { transaction: t });
    }).then(() => {
        res.status(200).send('Tokens added successfully');
    }).catch((error) => {
        logger.error('Error adding tokens: ' + error.message || error);
        res.status(500).send('Error adding tokens');
    });
});

// Endpoint to list the user's orders
storeRouter.get('/orders', authMiddleware, async (req, res) => {
    const { user } = req;
    const orders = await listOrdersByUser(user.id);
    res.json(orders);
});

module.exports = storeRouter;