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
import express from 'express';
import { getUser, listUsers } from '../services/user.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/users', async (_, res) => {
    try {
        const users = await listUsers();
        res.json(users);
    } catch (err) {
        console.error('Error listing users:', err.message || err);
        res.status(500).send('Error listing users.');
    }
});

userRouter.get('/whoami', authMiddleware, async (req, res) => {
    const user = await getUser(req.user.id);
    req.user = user;
    res.json(user);
});

export default userRouter;