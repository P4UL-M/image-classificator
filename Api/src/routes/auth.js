/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API pour l'authentification des utilisateurs
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Le nom d'utilisateur
 *               email:
 *                 type: string
 *                 description: L'adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Champs requis manquants
 *       500:
 *         description: Erreur lors de l'enregistrement de l'utilisateur
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Jeton d'authentification JWT
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur lors de l'authentification de l'utilisateur
 */
const express = require('express');
const { authenticateUser, createUser } = require('../services/user.service.js');
const { logger } = require('../utils/logger.js');
const { sequelize } = require('../../models/index.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    // check if the request body contains the required fields
    if (!req.body?.username || !req.body?.email || !req.body?.password) {
        return res.status(400).send('Missing required fields.');
    }

    const { username, email, password } = req.body;

    try {
        await createUser({ username, email, password });
        const token = await authenticateUser(email, password);

        // Return the token in the response
        res.status(201).send({ token });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send('User already exists.');
        } else if (error.name === 'SequelizeValidationError') {
            return res.status(400).send('Invalid user data.');
        } else {
            logger.error('Error registering user:' + error);
            res.status(500).send('Error registering user.');
        }
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authenticateUser(email, password);
        res.status(200).send({ token });
    } catch (error) {
        logger.error('Error authenticating user:' + error.message || error);
        res.status(401).send('Invalid credentials.');
    }
});

authRouter.get('/token', authMiddleware, async (req, res) => {
    // Check the scope the user want to access
    const { scopes } = req.query;
    let user = req.user;
    user = await sequelize.models.user.findByPk(user.id);

    if (!scopes) {
        return res.status(400).send('Missing required fields.');
    }

    // Check if the user has the required scope
    for (const scope of scopes.split(',')) {
        // Check balance related scopes
        if (scope.startsWith('classify:')) {
            // Check the balance of the user
            if (user.balance < 1) {
                return res.status(403).send('Insufficient balance.');
            }
        }
    }

    // Return the token with the scopes
    const token = await jwt.sign({ id: user.id, scopes }, JWT_SECRET, { expiresIn: '1m' });
    res.status(200).send({ token });
});

module.exports = authRouter;