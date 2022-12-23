'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.User);
    }
  }
  Attendance.init({
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    clock_in: DataTypes.DATE,
    clock_out: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};