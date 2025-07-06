'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Banner.init({
    position: {
      type: DataTypes.ENUM('main-banner', 'side-banner', 'hot-banner', 'gear-up-banner'),
      allowNull: false,
    },
    imgDesktop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgTablet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imgMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    altText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  }, {
    sequelize,
    modelName: 'Banner',
    tableName: 'banners',
    timestamps: true,
  });

  return Banner;
};

