'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true  // unique on slug column alone
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
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

    // Add composite unique constraint on categoryId + name
    await queryInterface.addConstraint('subCategories', {
      fields: ['categoryId', 'name'],
      type: 'unique',
      name: 'unique_category_name'  // custom name for the constraint
    });
  },
  async down(queryInterface, Sequelize) {
    // Remove the composite unique constraint first before dropping table
    await queryInterface.removeConstraint('subCategories', 'unique_category_name');
    await queryInterface.dropTable('subCategories');
  }
};

