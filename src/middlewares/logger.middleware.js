const { logger } = require('../utils/logger');

// Middleware that logs the request method and URL
const loggerMiddleware = (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            logger.warn(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        }
        if (res.statusCode < 400) {
            logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        }
    });
    next();
};

module.exports = loggerMiddleware;