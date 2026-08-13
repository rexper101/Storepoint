const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define(
  'Store',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'stores',
    underscored: true,
    indexes: [{ fields: ['name'] }, { fields: ['address'] }],
  }
);

module.exports = Store;
