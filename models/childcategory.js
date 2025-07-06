'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class childCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.childCategory.belongsTo(models.category)
      models.childCategory.belongsTo(models.subCategory)
      models.childCategory.hasMany(models.product);
    }
  }
  childCategory.init({
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subCategoryId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'childCategory',
  });
  return childCategory;
};
