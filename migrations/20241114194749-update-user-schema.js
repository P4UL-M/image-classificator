'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the user schema to add the balance field
    await queryInterface.addColumn('users', 'balance', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the balance field from the user schema
    await queryInterface.removeColumn('users', 'balance');
  }
};
