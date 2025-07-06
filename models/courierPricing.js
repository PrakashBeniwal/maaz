'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class courierpricing extends Model {
    static associate(models) {
      // Each pricing belongs to one courier and one city
      models.courierPricing.belongsTo(models.courier, {
        foreignKey: 'courierId'
      });

      models.courierPricing.belongsTo(models.city, {
        foreignKey: 'cityId'
      });
    }
  }

  courierpricing.init({
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'courierPricing',
  });

  return courierpricing;
};

