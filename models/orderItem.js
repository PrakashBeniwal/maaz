'use strict';
const { Model: OrderItemModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends OrderItemModel {
    static associate(models) {
      OrderItem.belongsTo(models.order, { foreignKey: 'orderId' });
      OrderItem.belongsTo(models.product);
      
    }
  }

  OrderItem.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'orderItem',
    tableName: 'orderItems',
    timestamps: true,
  });

  return OrderItem;
};



