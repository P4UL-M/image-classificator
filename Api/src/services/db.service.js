import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";

const DB_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const sequelize = new Sequelize(DB_URL, { logging: false });

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export async function createTables() {
    sequelize.define('user', {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

    sequelize.define('order', {
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nbTokens: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        totalPrice: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

    sequelize.define('query', {
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        query: {
            type: Sequelize.STRING,
            allowNull: false
        },
    })

    await sequelize.sync({ force: true })
}

export async function populateDatabase() {
    await sequelize.models.user.bulkCreate([
        { username: 'user1', email: 'user1@deway.fr', password: await bcrypt.hash('password1', SALT_ROUNDS), balance: 100 },
        { username: 'user2', email: 'user2@deway.fr', password: await bcrypt.hash('password2', SALT_ROUNDS), balance: 200 }
    ])
}