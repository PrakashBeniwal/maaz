'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
     customerId: {
  type: Sequelize.INTEGER,
  references: { model: 'customers', key: 'id' },
  allowNull: false,
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
},
addressId: {
  type: Sequelize.INTEGER,
  references: { model: 'addresses', key: 'id' },
  allowNull: false,
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
},
courierId: {
  type: Sequelize.INTEGER,
  references: { model: 'couriers', key: 'id' },
  allowNull: true,
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},
courierPricingId: {
  type: Sequelize.INTEGER,
  references: { model: 'courierPricings', key: 'id' },
  allowNull: true,
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
},
      courierCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
        number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      paymentMethod: {
        type: Sequelize.ENUM('stripe', 'hbl', 'cod'),
        allowNull: false
      },
      grandTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
       subTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      deliveryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};

