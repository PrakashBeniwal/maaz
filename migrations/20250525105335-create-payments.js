'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
     orderId: {
  type: Sequelize.INTEGER,
  allowNull: false,
  references: {
    model: 'orders',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE' // if order is deleted, its payment should be deleted too
},
      method: {
        type: Sequelize.ENUM('stripe', 'hbl', 'cod'),
        allowNull: false
      },
      amount: Sequelize.DECIMAL(10, 2),
      status: Sequelize.STRING, // 'paid', 'failed', etc.
      gatewayOrderId: Sequelize.STRING, // Stripe/HBL order ID
      gatewayPaymentId: Sequelize.STRING, // Stripe/HBL payment ID
      currency: Sequelize.STRING,
      receiptUrl: Sequelize.STRING, // optional for Stripe/HBL
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  }
};

