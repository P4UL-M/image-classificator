'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association with users
            models.order.belongsTo(models.user, {
                foreignKey: 'userId',
            });
        }
    }
    order.init({
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        orderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderTotal: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'order',
    });
    return order;
};