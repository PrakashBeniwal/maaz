'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banners', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      position: {
        type: Sequelize.ENUM('main-banner', 'side-banner', 'hot-banner','gear-up-banner'),
        allowNull: false,
      },
      imgDesktop: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imgTablet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imgMobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      altText: {
        type: Sequelize.STRING,
        allowNull: true, // optional but recommended
      },
      sortOrder: {
  type: Sequelize.INTEGER,
  defaultValue: 0,
},

isActive: {
  type: Sequelize.BOOLEAN,
  defaultValue: true,
},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Banners');
  },
};

