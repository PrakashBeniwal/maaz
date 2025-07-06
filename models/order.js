'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.customer, { foreignKey: 'customerId' });
      Order.belongsTo(models.address, { foreignKey: 'addressId' });
      Order.belongsTo(models.courier, { foreignKey: 'courierId' });
      Order.belongsTo(models.courierPricing, { foreignKey: 'courierPricingId' });
      Order.hasMany(models.orderItem, { foreignKey: 'orderId' });
      Order.hasOne(models.payment, { foreignKey: 'orderId' });
    }
  }

  Order.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courierPricingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courierCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM('stripe', 'hbl', 'cod'),
      allowNull: false,
    },
    grandTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
     subTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'order',
    tableName: 'orders',
    timestamps: true,
  });

  return Order;
};

