const { logger } = require("../utils/logger");
const db = require("../../models");

const sequelize = db.sequelize

exports.sequelize = sequelize;

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
}

exports.connectToDatabase = connectToDatabase;