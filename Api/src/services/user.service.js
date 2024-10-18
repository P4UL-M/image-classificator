import { sequelize } from "./db.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
const SALT_ROUNDS = 10;

export async function createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return sequelize.models.user.create({ username, email, password: hashedPassword, balance: 0 });
}

export async function authenticateUser(email, password) {
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