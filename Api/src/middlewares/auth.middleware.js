const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = { id: payload.id };
        req.scopes = payload.scopes;

        next();
    });
};

module.exports = authMiddleware;