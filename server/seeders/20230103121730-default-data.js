'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
const SEED_ADMIN = {
  name: 'admin',
  email: 'admin@example.com',
  password: 'titaner',
};
const SEED_USER = {
  name: 'user',
  email: 'user@example.com',
  password: 'titaner',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: SEED_ADMIN.name,
        email: SEED_ADMIN.email,
        password: bcrypt.hashSync(
          SEED_ADMIN.password,
          bcrypt.genSaltSync(10),
          null
        ),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('Users', [
      {
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: bcrypt.hashSync(
          SEED_ADMIN.password,
          bcrypt.genSaltSync(10),
          null
        ),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
