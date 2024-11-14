const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: process.env.DEV_DB_USERNAME || 'postgres',
        password: process.env.DEV_DB_PASSWORD || 'postgres',
        database: process.env.DEV_DB_NAME || 'image_classificator',
        host: process.env.DEV_DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    },
    test: {
        username: process.env.TEST_DB_USERNAME || 'postgres',
        password: process.env.TEST_DB_PASSWORD || 'postgres',
        database: process.env.TEST_DB_NAME || 'image_classificator',
        host: process.env.TEST_DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: process.env.PROD_DB_USERNAME || 'postgres',
        password: process.env.PROD_DB_PASSWORD || 'postgres',
        database: process.env.PROD_DB_NAME || 'image_classificator',
        host: process.env.PROD_DB_HOST || 'postgres_db',
        dialect: 'postgres',
        logging: false
    }
};
