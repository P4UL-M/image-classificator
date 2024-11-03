/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour gérer les utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'ID de l'utilisateur
 *                   username:
 *                     type: string
 *                     description: Le nom d'utilisateur
 *                   email:
 *                     type: string
 *                     description: L'adresse email de l'utilisateur
 *       500:
 *         description: Erreur lors de la récupération de la liste des utilisateurs
 */

/**
 * @swagger
 * /whoami:
 *   get:
 *     summary: Récupère les informations de l'utilisateur authentifié
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'ID de l'utilisateur
 *                 username:
 *                   type: string
 *                   description: Le nom d'utilisateur
 *                 email:
 *                   type: string
 *                   description: L'adresse email de l'utilisateur
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur lors de la récupération des informations de l'utilisateur
 */
const express = require('express');
const { getUser, listUsers } = require('../services/user.service.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const userRouter = express.Router();

userRouter.get('/users', async (_, res) => {
    const users = await listUsers();
    res.json(users);
});

userRouter.get('/whoami', authMiddleware, async (req, res) => {
    const user = await getUser(req.user.id);
    req.user = user;
    res.json(user);
});

module.exports = userRouter;