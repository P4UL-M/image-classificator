const { sequelize } = require('./db.service.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models').user;

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

/**
 * Crée un nouvel utilisateur.
 * @param {string} username - Le nom d'utilisateur.
 * @param {string} email - L'adresse email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<object>} L'utilisateur créé.
 */
async function createUser({ username, email, password }, options) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return sequelize.models.user.create({ username, email, password: hashedPassword }, options);
}

/**
 * Récupère un utilisateur par son identifiant.
 * @param {number} id - L'identifiant de l'utilisateur.
 * @returns {Promise<Object>} - Une promesse qui résout l'objet utilisateur trouvé, sans le mot de passe.
 */
async function getUser(id) {
    return sequelize.models.user.findByPk(id, { attributes: { exclude: ['password'] } });
}

/**
 * Authentifie un utilisateur.
 * @param {string} email - L'adresse email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<string>} Le jeton JWT si l'authentification réussit.
 * @throws {Error} Si l'authentification échoue.
 */
async function authenticateUser(email, password) {
    const user = await sequelize.models.user.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password.");
    }

    return jwt.sign({ id: user.id }, JWT_SECRET);
}

/**
 * Récupère un utilisateur à partir d'un jeton JWT.
 * @param {string} token - Le jeton JWT.
 * @returns {Promise<object>} L'utilisateur correspondant au jeton.
 * @throws {Error} Si le jeton est invalide.
 */
async function getUserFromToken(token) {
    const { id } = jwt.verify(token, JWT_SECRET);
    return sequelize.models.user.findByPk(id);
}

/**
 * Liste tous les utilisateurs.
 * @returns {Promise<Array<object>>} La liste de tous les utilisateurs.
 */
async function listUsers() {
    return sequelize.models.user.findAll({ attributes: { exclude: ['password'] } });
}

async function updateUserBalance(id, amount, options) {
    const user = await sequelize.models.user.findByPk(id);
    if (!user) {
        throw new Error("User not found.");
    }

    user.balance += amount;
    return user.save(options);
}

module.exports = { createUser, getUser, authenticateUser, getUserFromToken, listUsers, updateUserBalance };