const { sequelize } = require('./db.service.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../../models').order;

// Add order to database
async function addOrder({ userId, amount, status }, options) {
    if (!userId || !amount || !status) {
        throw new Error('Missing required fields.');
    }
    return Order.create({ userId, orderTotal: amount, orderStatus: status, orderDate: new Date() }, options);
}

// List all orders
async function listOrders() {
    return Order.findAll();
}

// List orders by user
async function listOrdersByUser(userId) {
    return Order.findAll({ where: { userId }, order: [['orderDate', 'DESC']], attributes: { exclude: ['userId'] } });
}

module.exports = { addOrder, listOrders, listOrdersByUser };