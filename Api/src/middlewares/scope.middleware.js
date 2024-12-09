const jwt = require('jsonwebtoken');

function scopesMiddleware(scopes) {
    if (typeof scopes === 'string') {
        scopes = [scopes];
    }
    return function scopesMiddlewareWrapper(req, res, next) {
        if (!req.scopes) return res.sendStatus(401); // Unauthorized
        if (!scopes.every(scope => req.scopes.includes(scope))) return res.sendStatus(403); // Forbidden
        else next();
    };
}

module.exports = scopesMiddleware;