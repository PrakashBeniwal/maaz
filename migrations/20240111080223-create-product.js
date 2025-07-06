'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'categories',
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"RESTRICT"
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'subCategories',
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"RESTRICT"
      },
      childCategoryId: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'childCategories',
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull:true,
        unique:true
      },
      brandId: {
        type: Sequelize.INTEGER,
         references:{
          model:'brands',
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
      },
      shortDesc: {
        type: Sequelize.TEXT
      },
      desc: {
        type: Sequelize.TEXT
      },
      buyerPrice: {
        type: Sequelize.DECIMAL(20,2),
        allowNull:false
      },
      price: {
        type: Sequelize.DECIMAL(20,2),
        allowNull:false
      },
      discount: {
        type: Sequelize.DECIMAL(5,2),
        defaultValue:0
      },
      discountPrice: {
        type: Sequelize.DECIMAL(20,2),
        defaultValue:0
      },
      netPrice: {
        type: Sequelize.DECIMAL(20,2)
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue:1
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue:1
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull:false
      },
      total: {
        type: Sequelize.DECIMAL(20,2)
      },
      imgUrl: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('products');
  }
};
