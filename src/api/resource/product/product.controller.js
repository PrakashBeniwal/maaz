const { Op } = require("sequelize");
const db = require("../../../../models");
const { geturl, putobject ,deleteImg} = require("../../../cloudinary");
const slugify = require('slugify');

const route = {
    list: async (req, res) => {

        try {
            let product = await db.product.findAll({
                include:[
                {model:db.brand,attributes:['name']},
                {model:db.category,attributes:['name']},
                {model:db.subCategory,attributes:['name']},
                {model:db.childCategory,attributes:['name']},
                
                ],
            });

            let data = [];

            for (let i = 0; i < product.length; i++) {
                data.push({
                    id: product[i].id,
                    category: product[i].category?.name,
                    subCategory: product[i].subCategory?.name,
                    childCategory: product[i].childCategory?.name,
                    name: product[i].name,
                    slug: product[i].slug,
                    brand:product[i].brand?.name,
                    shortDesc: product[i].shortDesc,
                    desc: product[i].desc,
                    buyerPrice: product[i].buyerPrice,
                    price: product[i].price,
                    discount: product[i].discount,
                    discountPrice: product[i].discountPrice,
                    netPrice: product[i].netPrice,
                    quantity: product[i].quantity,
                    photo: product[i].imgUrl,
                    stock: product[i].stock,
                    status: product[i].status,
                    total: product[i].total,
                    createdAt: product[i].createdAt,
                })
            }
            res.status(200).json({ list: data })

        } catch (error) {
            console.log(error)
            res.status(400).json({ mess: error })
        }


    },
    getAllPhotos: async (req, res) => {

        try {
            let product = await db.product.findAll({
                include: [{model:db.productPhotos},{model:db.brand}],
                attributes: ["id", "name"]
            });

            res.status(200).json({ list: product })

        } catch (error) {
            console.log(error)
            res.status(400).json({ mess: error })
        }


    },
    
    create: async (req, res) => {
  const {
    key, categoryId, subCategoryId, childCategoryId, status, name,
    shortDesc, slug, brandId, desc, buyerPrice, price, discount,
    discountPrice, netPrice, quantity, stock, total
  } = req.body;

  // Validation
  if (
    !categoryId || !subCategoryId  || status == null || !name ||
    !shortDesc || !slug || !desc || price == null || 
    discount == null || discountPrice == null || netPrice == null ||
    quantity == null || stock == null || total == null 
  ) {
    console.log("Missing required fields:", req.body);
    return res.status(400).json({ mess: "Please provide all required fields" });
  }

  try {
    const newSlug = slugify(slug, { lower: true, strict: true });
  
    // Check if product with same slug exists
    const existing = await db.product.findOne({
      where: { slug:newSlug }
    });

    if (existing) {
      // If image was uploaded, delete it
      if (key) {
        try {
          await deleteImg(key);
        } catch (imgErr) {
          console.error("Error deleting uploaded image:", imgErr);
        }
      }

      return res.status(200).json({ mess: "Product already exists with this slug", success: false });
    }

    // Create product
    const product = await db.product.create({
      imgUrl: key,
      categoryId,
      subCategoryId,
      childCategoryId,
      status,
      name,
      shortDesc,
      slug:newSlug,
      brandId,
      desc,
      buyerPrice,
      price,
      discount,
      discountPrice,
      netPrice,
      quantity,
      stock,
      total,
      isAvailable:stock>0?true:false
    });

    return res.status(200).json({ mess: "Successfully created product", success: true });

  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ mess: err.message || "Server error" });
  }
},


delete: async (req, res) => {
  const { id } = req.query;

  try {
    const product = await db.product.findByPk(id, {
      include: [{ model: db.productPhotos }] // Adjust alias if needed
    });

    if (!product) {
      return res.status(400).json({ mess: "Product does not exist" });
    }

     // Check if product is associated with any orderItem
     const orderItemCount = await db.orderItem.count({
      where: { productId: id }
    });

    if (orderItemCount > 0) {
      return res.status(400).json({ mess: "Cannot delete product because it is associated with one or more orders." });
    }
    

    // Delete all associated productPhotos images
    if (product.productPhotos && product.productPhotos.length > 0) {
      await Promise.all(
        product.productPhotos.map(async (photo) => {
          try {
            await deleteImg(photo.imgUrl); // Delete image from cloud/storage
          } catch (err) {
            console.error("Error deleting photo image:", err);
          }
        })
      );

      // Delete productPhotos entries
      await db.productPhotos.destroy({
        where: { productId: id }
      });
    }

    // Delete main product image
    if (product.imgUrl) {
      try {
        await deleteImg(product.imgUrl);
      } catch (err) {
        console.error("Error deleting main product image:", err);
      }
    }

    // Delete the product itself
    await product.destroy();

    return res.status(200).json({ data: "Successfully deleted product and its photos" });

  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ mess: "Error deleting product", error: err });
  }
},


       deletePhotoById: (req, res) => {
        const { id } = req.query;
        db.productPhotos.findByPk(id).then(find => {
            if (!find) {
                res.status(400).json({ mess: "productPhotos is not exist" });
                return;
            }
            find.destroy({ where: { id } })
                .then(cat => {
                    if (cat) {
                          deleteImg(cat.imgUrl).then((d)=>{
                    if(d){
                        return;
                    }}).catch(err=>{
                    console.log(err);
                    });
                         res.status(200).json({ data: "successfully deleted product" });
                   return
                    }
                    res.status(400).json({ mess: "error in deleting product" });
                }).catch(err => {
                    res.status(400).json({ mess: err });
                    return;
                })
        }).catch(err => {
            res.status(400).json({ mess: err });
            return;
        })
    },

   update: async (req, res) => {
  const {
    key, id, status, name, shortDesc, slug, brandId, desc, buyerPrice,
    price, discount, discountPrice, netPrice, quantity, stock, total,childCategoryId
  } = req.body;

  // Validate required fields
  if (
    !id || status == null || !name || !shortDesc || !slug || !desc ||
    price == null || discount == null ||
    discountPrice == null || netPrice == null || quantity == null ||
    stock == null || total == null
  ) {
   
    return res.status(400).json({ mess: "Please provide all required fields" });
  }

  try {
    const newSlug = slugify(slug, { lower: true, strict: true });
  
    // Check if another product already has the same slug
    const existingSlugProduct = await db.product.findOne({ where: { slug:newSlug } });

    if (existingSlugProduct && existingSlugProduct.id != id) {
      // Delete uploaded image if it exists (to prevent orphaned image)
      if (key) {
        try {
          await deleteImg(key);
         
        } catch (err) {
          console.error("Error deleting uploaded image:", err);
        }
      }

      return res.status(400).json({ mess: "Product already exists with this slug" });
    }

    // Find the product to update
    const product = await db.product.findOne({ where: { id } });

    if (!product) {
      // Delete uploaded image since product does not exist
      if (key) {
        try {
          await deleteImg(key);
          console.log("Orphaned uploaded image deleted because product not found");
        } catch (err) {
          console.error("Error deleting uploaded image:", err);
        }
      }

      return res.status(400).json({ mess: "Product does not exist" });
    }

    // Delete old image only if a new one is uploaded
    if (key && key !== product.imgUrl) {
      try {
        await deleteImg(product.imgUrl);
        console.log("Old image deleted successfully");
      } catch (err) {
        console.error("Error deleting old image:", err);
      }
    }

    // Proceed with update
    await product.update({
      status,
      name,
      imgUrl: key || product.imgUrl,
      shortDesc,
      slug:newSlug,
      brandId,
      desc,
      buyerPrice,
      price,
      discount,
      discountPrice,
      netPrice,
      quantity,
      stock,
      total,
      childCategoryId,
      isAvailable:stock>0?true:false
    });

    return res.status(200).json({ data: "Successfully updated product" });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ mess: err.message || "Error updating product" });
  }
},


    getProductById: (req, res) => {
        const { id } = req.query;
        db.product.findOne({
	include:[{model:db.childCategory,attributes:['name']},{model:db.brand,attributes:['name']}]
,where:{id}})
            .then(p => {
                if (p) {
                    res.status(200).json({ data: p });
                    return;
                }
                res.status(400).json({ mess: "empty product" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                return;
            })
    },

//   getProductsByChildCategorySlug: async (req, res) => {
//   const { slug, page = 1, limit = 20 } = req.query;

//   const offset = (parseInt(page) - 1) * parseInt(limit);

//   try {
//     const childCategory = await db.childCategory.findOne({
//       where: { slug },
//       attributes: ["id", "name"],
//       include: [
//         { model: db.category, attributes: ['name'] },
//         { model: db.subCategory, attributes: ['name'] }
//       ]
//     });

//     if (!childCategory) {
//       return res.status(404).json({ message: "Child category not found" });
//     }

//     const { count, rows } = await db.product.findAndCountAll({
//       where: { childCategoryId: childCategory.id },
//       attributes: ["name", "price", "imgUrl", "slug"],
//       limit: parseInt(limit),
//       offset,
//       order: [["createdAt", "DESC"]],
//     });

//     // 🔍 Get the highest price for filtering
//     const highestPrice = await db.product.max("price", {
//       where: { childCategoryId: childCategory.id },
//     });
    
//     const brands = await db.brand.findAll({
//   include: [
//     {
//       model: db.product,
//       where: { childCategoryId: childCategory.id },
//       attributes: [], // exclude product fields
//     },
//   ],
//   attributes: ['slug', 'name'], // adjust if you have other fields
//   group: ['brand.id'],
// });

//     return res.status(200).json({
//       products: rows,
//       total: count,
//       totalPages: Math.ceil(count / limit),
//       page: parseInt(page),
//       category: childCategory?.category?.name,
//       subCategory: childCategory?.subCategory?.name,
//       childCategory: childCategory.name,
//       maxPrice: highestPrice || 0 ,// Fallback to 0 if no products
//       brands
//     });
//   } catch (error) {
//     console.error("Error fetching products by child category slug:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// },


// consume too much time to create this api

getProductsByChildCategorySlug: async (req, res) => {
  const {
    slug,
    page = 1,
    limit = 20,
    brand,
    minPrice,
    maxPrice,
    onSale,
    orderBy = "latest",
  } = req.query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const childCategory = await db.childCategory.findOne({
      where: { slug },
      attributes: ["id", "name"],
      include: [
        { model: db.category, attributes: ["name"] },
        { model: db.subCategory, attributes: ["name"],include:{model:db.childCategory,attributes:['name','slug']} },
      ],
    });

    if (!childCategory) {
      return res.status(404).json({ mess: "Child category not found" });
    }



    // 🔄 Convert brand slug(s) to brandId(s)
    const brandSlugs = brand?.split(",").map((s) => s.trim()) || [];
    const brandPromise = brandSlugs.length
      ? db.brand.findAll({ where: { slug: brandSlugs }, attributes: ["id"] })
      : Promise.resolve([]);

    const brandRecords = await brandPromise;
    const brandIds = brandRecords.map((b) => b.id);

    // 🔍 Product filter
    const productWhere = { childCategoryId: childCategory.id, stock: {
    [Op.gt]: 0},status:1,isAvailable:true };

    if (brandIds.length) {
      productWhere.brandId = brandIds;
    }

    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    if (min !== null || max !== null) {
      productWhere.netPrice = {};
      if (min !== null) productWhere.netPrice[Op.gte] = min;
      if (max !== null) productWhere.netPrice[Op.lte] = max;
    }

    if (onSale === "true") {
      productWhere.discount = { [Op.gt]: 0 };
    }

    // 🔃 Multi-field sorting
    const orderMap = {
      priceAsc: ["price", "ASC"],
      priceDesc: ["price", "DESC"],
      createdAtAsc: ["createdAt", "ASC"],
      createdAtDesc: ["createdAt", "DESC"],
      latest: ["createdAt", "DESC"],
    };

    const orderFields = orderBy.split(",").map((field) => field.trim());
    const order = orderFields
      .map((key) => orderMap[key])
      .filter(Boolean);

    if (!order.length) {
      order.push(["createdAt", "DESC"]);
    }

    // 🚀 Run queries in parallel
    const [productData, highestPrice, brands] = await Promise.all([
      db.product.findAndCountAll({
        where: productWhere,
        attributes: ["name", "total", "netPrice", "discount", "imgUrl", "slug",'id','stock'],
        limit: parsedLimit,
        offset,
        order,
      }),

      // Only fetch max price on first page
      parsedPage === 1
        ? db.product.max("price", { where: { childCategoryId: childCategory.id } })
        : Promise.resolve(null),

      // Only fetch brands on first page
      parsedPage === 1
        ? db.brand.findAll({
            include: [{
              model: db.product,
              where: { childCategoryId: childCategory.id },
              attributes: [],
            }],
            attributes: ["slug", "name"],
            group: ["brand.id"],
          })
        : Promise.resolve([]),
    ]);

    const { count, rows } = productData;

    return res.status(200).json({
      products: rows,
      total: count,
      totalPages: Math.ceil(count / parsedLimit),
      page: parsedPage,
      category: childCategory?.category?.name,
      subCategory: childCategory?.subCategory?.name,
      childCategory: childCategory.name,
      maxPrice: highestPrice || 0,
      brands,
      childList:childCategory?.subCategory?.childCategories
    });
  } catch (error) {
    console.error("Error fetching products by child category slug:", error);
    return res.status(500).json({ mess: "Internal server error" });
  }
},

getProductsBySubCategorySlug: async (req, res) => {
  const {
    slug,
    page = 1,
    limit = 20,
    brand,
    minPrice,
    maxPrice,
    onSale,
    orderBy = "latest",
  } = req.query;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const subCategory = await db.subCategory.findOne({
      where: { slug },
      attributes: ["id", "name"],
      include: [{ model: db.category, attributes: ["name"] },{ model: db.childCategory, attributes: ["name","slug"]}],
    });

    if (!subCategory) {
      return res.status(404).json({ mess: "SubCategory not found" });
    }

    // 🔄 Convert brand slug(s) to brandId(s)
    const brandSlugs = brand?.split(",").map((s) => s.trim()) || [];
    const brandPromise = brandSlugs.length
      ? db.brand.findAll({ where: { slug: brandSlugs }, attributes: ["id"] })
      : Promise.resolve([]);

    const brandRecords = await brandPromise;
    const brandIds = brandRecords.map((b) => b.id);

    // 🔍 Product filter
    const productWhere = { subCategoryId: subCategory.id , stock: {
    [Op.gt]: 0 },status:1,isAvailable:true};

    if (brandIds.length) {
      productWhere.brandId = brandIds;
    }

    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    if (min !== null || max !== null) {
      productWhere.netPrice = {};
      if (min !== null) productWhere.netPrice[Op.gte] = min;
      if (max !== null) productWhere.netPrice[Op.lte] = max;
    }

    if (onSale === "true") {
      productWhere.discount = { [Op.gt]: 0 };
    }

    // 🔃 Multi-field sorting
    const orderMap = {
      priceAsc: ["price", "ASC"],
      priceDesc: ["price", "DESC"],
      createdAtAsc: ["createdAt", "ASC"],
      createdAtDesc: ["createdAt", "DESC"],
      latest: ["createdAt", "DESC"],
    };

    const orderFields = orderBy.split(",").map((field) => field.trim());
    const order = orderFields
      .map((key) => orderMap[key])
      .filter(Boolean);

    if (!order.length) {
      order.push(["createdAt", "DESC"]);
    }

    // 🚀 Run queries in parallel
    const [productData, highestPrice, brands] = await Promise.all([
      db.product.findAndCountAll({
        where: productWhere,
        attributes: ["name", "total", "netPrice", "discount", "imgUrl", "slug",'id','stock'],
        limit: parsedLimit,
        offset,
        order,
      }),

      parsedPage === 1
        ? db.product.max("price", { where: { subCategoryId: subCategory.id } })
        : Promise.resolve(null),

      parsedPage === 1
        ? db.brand.findAll({
            include: [{
              model: db.product,
              where: { subCategoryId: subCategory.id },
              attributes: [],
            }],
            attributes: ["slug", "name"],
            group: ["brand.id"],
          })
        : Promise.resolve([]),
    ]);

    const { count, rows } = productData;

    return res.status(200).json({
      products: rows,
      total: count,
      totalPages: Math.ceil(count / parsedLimit),
      page: parsedPage,
      category: subCategory?.category?.name,
      subCategory: subCategory.name,
      maxPrice: highestPrice || 0,
      brands,
      childList:subCategory?.childCategories
    });
  } catch (error) {
    console.error("Error fetching products by sub category slug:", error);
    return res.status(500).json({ mess: "Internal server error" });
  }
},


getRecentProducts : async (req, res) => {
  try {
     const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await db.product.findAll({
      where: {
        updatedAt: {
          [Op.gte]: sevenDaysAgo
        },
        status:1,isAvailable:true
  //        stock: {
  //   [Op.gt]: 0
  // }
      },
      attributes:['name','slug','imgUrl','netPrice','total','stock','discount','id'],
      order: [['updatedAt', 'DESC']] ,
      ...(limit && { limit }) // only include limit if defined
    });

    res.json(products);
  } catch (err) {
    console.error('Error fetching recent products:', err);
    res.status(500).json({ mess: 'Internal server error' });
  }
},

getDiscountedProducts : async (req, res) => {
  try {
     const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  
    const discountedProducts = await db.product.findAll({
      where: {
        discount: {
          [Op.gt]: 0
        },
         stock: {
    [Op.gt]: 0
  },status:1,isAvailable:true
      },
      attributes:['name','slug','imgUrl','netPrice','total','discount','stock','id'],
      order: [['updatedAt', 'DESC']],
      ...(limit && { limit }) // only include limit if defined
      
    });

    res.json(discountedProducts);
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    res.status(500).json({ mess: 'Internal server error' });
  }
},

    uploadImg: async (req, res) => {
        // const {type}=req.body;
        const data = await putobject();
        res.status(200).json({ data });
    },

      deleteImg: async (req, res) => {
        const {url}=req.body;
        if (url) {
        try {
          await deleteImg(url);
       return res.status(200).json({ mess:"successfully delete image" });
          
        } catch (err) {
          console.error("Error deleting uploaded image:", err);
          return res.status(400).json({mess:"error in deleting image"})
        }
      }
    },

    getImg: async (req, res) => {
        const { key } = req.query;
        geturl(key).then(url => {
            if (url) {
                res.status(200).json(url);
                return;
            }
        }).catch(err => {
            console.log(err)
            res.status(400).json({ mess: err })
        })
    },
    
    getProductBySlug: async (req, res) => {
  const { slug } = req.query;

    if(!slug){
        res.status(400).json({mess:"slug is provided"});
        return;
        }
    
  try {
    const product = await db.product.findOne({
      where: { slug ,status:1,isAvailable:true},
      include: [
        {
          model: db.productPhotos,
          attributes: ['id', 'imgUrl']
        },{model:db.brand,attributes:['name']}
      ]
    });

    if (!product) {
      return res.status(404).json({ mess: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return res.status(500).json({ mess: 'Internal server error' });
  }
  },

    addMoreImg: (req, res) => {

        const { productId,urls } = req.body;

        if (!productId) {
            console.log(productId)
            res.status(400).json("please provide productId");
            return;
        }

        if (!urls) {
            console.log(req.files)
            res.status(400).json("please provide photo urls");
            return;
        }


        const addImg=[];
        
        for (let i = 0; i < urls.length; i++) {
            
            addImg.push({
                productId,
                imgUrl:urls[i]
            })
        }

        db.productPhotos.bulkCreate(addImg)
        .then(success=>{
            if (success) {
                res.status(200).json({mess:"images uploaded successfully"})
            }
        })
    },

   search: async (req, res) => {
  const { q = '', limit = 10, page = 1 } = req.query;


  if (q.length <= 3) {
    // Return empty results early if query too short
    return res.json({
      data: []
    });
  }


  try {
    const where = {
      [Op.or]: [
        { name: { [Op.like]: `%${q}%` } }, 
        { slug: { [Op.like]: `%${q}%` } },
      ],
      status:1,
      isAvailable: true
    };

    const offset = (page - 1) * limit;

    const products= await db.product.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]    });

    res.json({
      data: products
    });
  } catch (error) {
    res.status(500).json({ mess: 'Server error', details: error.message });
  }
}


}


module.exports = route;
