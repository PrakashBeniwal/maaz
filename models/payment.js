// Payment Model
'use strict';
const { Model: PaymentModel } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends PaymentModel {
    static associate(models) {
      Payment.belongsTo(models.order, { foreignKey: 'orderId' });
    }
  }

  Payment.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('stripe', 'hbl', 'cod'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gatewayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gatewayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'payment',
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};

