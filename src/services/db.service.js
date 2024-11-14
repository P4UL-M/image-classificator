const { logger } = require("../utils/logger");
const db = require("../../models");

const sequelize = db.sequelize

exports.sequelize = sequelize;

/**
 * Connect to the database
 */
async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Connection to database has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
}

async function transaction(callback) {
    const t = await sequelize.transaction();
    try {
        await callback(t);
        await t.commit();
    } catch (error) {
        await t.rollback();
        logger.error('Error in transaction: ' + error.message || error);
        throw error;
    }
}

exports.connectToDatabase = connectToDatabase;
exports.transaction = transaction;