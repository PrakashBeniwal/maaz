'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull:false,
        unique:true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      addressId:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'addresses',
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      block: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      otpExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      attempt: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      logOutAt: {
        type: Sequelize.DATE
      },
      lastLogin: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
