const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Reminder extends Model {}

Reminder.init(
  {
    times: {
      type: DataTypes.ARRAY(DataTypes.TIME),
    },
    days: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'reminder',
  }
);

module.exports = Reminder;
