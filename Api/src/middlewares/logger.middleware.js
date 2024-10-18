import { logger } from "../utils/logger.js";

// Middleware that logs the request method and URL
export const loggerMiddleware = (req, res, next) => {
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