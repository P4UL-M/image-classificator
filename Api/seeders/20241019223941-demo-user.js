'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: 'user1',
      email: 'user1@email.com',
      password: 'password1',
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'user2',
      email: 'user2@email.com',
      password: 'password2',
      balance: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
