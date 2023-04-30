const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Token = require('../auth/token');
const Medication = require('../medication/medication');
const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    inactive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    activationToken: {
      type: Sequelize.STRING,
    },
    passwordResetToken: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: 'user',
  }
);

User.hasMany(Token, { onDelete: 'cascade', foreignKey: 'userId' });

User.hasMany(Medication, { onDelete: 'cascade', foreignKey: 'userId' });
Medication.belongsTo(User);
module.exports = User;
