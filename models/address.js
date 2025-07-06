'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  
      // In address model
models.address.hasMany(models.customer);
models.address.belongsTo(models.city);
models.address.belongsTo(models.state);

    }
  }
  Address.init({
    cityId: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER,
    postalCode: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'address',
  });
  return Address;
};
