'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: 'user1',
      email: 'user1@email.com',
      password: bcrypt.hashSync('password1', process.env.SALT_ROUNDS || 10),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      username: 'user2',
      email: 'user2@email.com',
      password: bcrypt.hashSync('password2', process.env.SALT_ROUNDS || 10),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
