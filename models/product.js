'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.product.hasMany(models.productPhotos)
      models.product.belongsTo(models.brand)
      models.product.belongsTo(models.category)
      models.product.belongsTo(models.childCategory);
      models.product.belongsTo(models.subCategory);
      
      
    }
  }
  product.init({
    categoryId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    subCategoryId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    childCategoryId: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    slug:{
      type:DataTypes.STRING,
      allowNull:false
    },
    brandId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    shortDesc: DataTypes.TEXT,
    desc: DataTypes.TEXT,
    buyerPrice: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL,
    discount: DataTypes.DECIMAL,
    discountPrice: DataTypes.DECIMAL,
    netPrice: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    isAvailable: DataTypes.BOOLEAN,
    total: DataTypes.DECIMAL,
    imgUrl:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};
