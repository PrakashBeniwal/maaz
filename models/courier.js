'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class courier extends Model {
    static associate(models) {
      // One courier has many pricing entries
      models.courier.hasMany(models.courierPricing, {
        foreignKey: 'courierId'
      });
    }
  }

  courier.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'courier',
  });

  return courier;
};

