'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Attendances', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Attendances', 'UserId');
  },
};
