import { Sequelize } from "sequelize";

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/postgres';

export const sequelize = new Sequelize(dbUrl);

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export function createTables() {
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

    sequelize.sync({ force: true })
}