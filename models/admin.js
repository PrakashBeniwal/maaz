'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      
    }
  }
  Admin.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: DataTypes.BOOLEAN,
    block: DataTypes.BOOLEAN,
    otpExpires: DataTypes.DATE,
    otp:DataTypes.INTEGER,
    attempt: DataTypes.INTEGER,
    logOutAt: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
   }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'admin',
  });
  return Admin;
};
