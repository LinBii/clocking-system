'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'isLocked', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'wrongPasswordTimes', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.sequelize.query(
      `UPDATE Users SET isLocked = (wrongPasswordTimes > 5)`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'isLocked');
    await queryInterface.removeColumn('Users', 'wrongPasswordTimes');
  },
};
