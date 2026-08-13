const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: 'ratings',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'store_id'],
      },
    ],
  }
);

module.exports = Rating;
