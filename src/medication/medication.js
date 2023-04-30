const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Reminder = require('../reminder/reminder');

class Medication extends Model {}

Medication.init(
  {
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'medication',
  }
);
Medication.hasOne(Reminder, { onDelete: 'cascade', foreignKey: { unique: true } });
module.exports = Medication;
