const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: 'Name must be between 20 and 60 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'normal_user', 'store_owner'),
      allowNull: false,
      defaultValue: 'normal_user',
    },
  },
  {
    tableName: 'users',
    underscored: true,
    indexes: [{ fields: ['name'] }, { fields: ['role'] }],
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

User.prototype.toSafeObject = function toSafeObject() {
  const { id, name, email, address, role, createdAt, updatedAt } = this;
  return { id, name, email, address, role, createdAt, updatedAt };
};

module.exports = User;
