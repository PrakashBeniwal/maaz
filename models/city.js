'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class city extends Model {
    static associate(models) {
      models.city.belongsTo(models.state);
      models.city.hasMany(models.courierPricing);
    }
  }

  city.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'city',
    indexes: [
      {
        unique: true,
        fields: ['name', 'stateId'] // Composite unique constraint
      }
    ]
  });

  return city;
};

