'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderItems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
     orderId: {
  type: Sequelize.INTEGER,
  references: {
    model: 'orders',
    key: 'id'
  },
  allowNull: false,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE' // If an order is deleted, its items should also be deleted
},
productId: {
  type: Sequelize.INTEGER,
  references: {
    model: 'products',
    key: 'id'
  },
  allowNull: false,
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT' // Prevent deleting a product that is in an order
},

      name: Sequelize.STRING,
      price: Sequelize.DECIMAL(10, 2),
      qty: Sequelize.INTEGER,
      total: Sequelize.DECIMAL(10, 2),
      photo: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orderItems');
  }
};

