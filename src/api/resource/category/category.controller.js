const { Op } = require("sequelize");
const db = require("../../../../models");
const slugify = require('slugify');

const controller = {

    // getcategoryList

    mainList: (req, res) => {
        db.category.findAll({ order: [['updatedAt', 'DESC']]})
            .then(cat => {
                if (cat) {
                    res.status(200).json({ data: cat });
                    return;
                }
                res.status(200).json({ mess: "empty category" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                return;
            })
    },

    subList: (req, res) => {
        db.subCategory.findAll({
            include: { model: db.category, attributes: ["name", "id"] }, order: [['updatedAt', 'DESC']]
        })
            .then(cat => {
                if (cat) {
                    res.status(200).json({ data: cat });
                    return;
                }
                res.status(200).json({ mess: "empty subCategory" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                return;
            })
    },

    // create category

    createMain: (req, res) => {
        const { name, slug } = req.body;
        if (!name || !slug) {
            res.status(400).json({ mess: "please provide name and slug" });
            return;
        }

    const newSlug = slugify(slug, { lower: true, strict: true });
    
        db.category.findOne({
            where: {
                [Op.or]: [{ name }, { slug:newSlug }]
            }
        }).then(find => {
            if (find) {
                res.status(400).json({ mess: "category already exist by this name or slug" });
                return;
            }
            db.category.create({
                name, slug:newSlug
            })
                .then(cat => {
                    if (cat) {
                        res.status(200).json({ data: "successfully created category" });
                        return;
                    }
                    res.status(200).json({ mess: "error in creating category" });
                }).catch(err => {
                    res.status(400).json({ mess: err });
                    return;
                })
        })


    },

   createSub: async (req, res) => {
    const { name, slug, categoryId } = req.body;

    if (!name || !slug || !categoryId) {
        return res.status(400).json({ mess: "Please provide name, categoryId, and slug" });
    }


    try {
        // Check unique slug
    const newSlug = slugify(slug, { lower: true, strict: true });

        
        const existingSlug = await db.subCategory.findOne({ where: { slug:newSlug } });
        if (existingSlug) {
            return res.status(400).json({ mess: "SubCategory already exists with this slug" });
        }

        // Check unique combination of name + categoryId
        const existingCombo = await db.subCategory.findOne({
            where: {
                name,
                categoryId
            }
        });
        if (existingCombo) {
            return res.status(400).json({ mess: "SubCategory already exists with this name and category" });
        }

        const newSub = await db.subCategory.create({ name, slug:newSlug, categoryId });

        return res.status(200).json({ data: "Successfully created subCategory" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ mess: err });
    }
},

    //update category


    updateMain: (req, res) => {
        const { name, slug, id } = req.body;
        if (!name && !slug) {
            res.status(400).json({ mess: "please provide name and slug" });
            return;
        }
    const newSlug = slugify(slug, { lower: true, strict: true });

        db.category.findOne({
            where: {
                [Op.or]: [{ name }, { slug:newSlug }]
            }
        }).then(find => {
            if (find && find.id != id) {
                res.status(400).json({ mess: `category already exist with this name or slug` });
                return;
            }
            db.category.findOne({
                where: {
                    id
                }
            }).then(find => {
                if (!find) {
                    res.status(400).json({ mess: "category is not exist" });
                    return;
                }
                find.update({
                    name: name ? name : find.name, slug: slug ? newSlug : find.slug
                })
                    .then(cat => {
                        if (cat) {
                            res.status(200).json({ data: "successfully updated category" });
                            return;
                        }
                        res.status(400).json({ mess: "error in updating category" });
                    }).catch(err => {
                        res.status(400).json({ mess: err });
                        return;
                    })
            }).catch(err => {
                res.status(400).json({ mess: err });
                return;
            })
        }).catch(err => {
            res.status(400).json({ mess: err });
            return;
        })




    },
    
    updateSub: async (req, res) => {
    const { name, slug, id } = req.body;

    if (!name && !slug) {
        return res.status(400).json({ mess: "Please provide name and slug" });
    }

    try {
        const cat = await db.subCategory.findByPk(id);
        if (!cat) {
            return res.status(400).json({ mess: "SubCategory does not exist" });
        }
        
    const newSlug = slugify(slug, { lower: true, strict: true });
    
        // Check if slug is already taken by another record
        if (slug) {
            const existingSlug = await db.subCategory.findOne({
                where: {
                    slug:newSlug,
                    id: { [Op.ne]: id }
                }
            });
            if (existingSlug) {
                return res.status(400).json({ mess: "SubCategory already exists with this slug" });
            }
        }

        // Check if name + categoryId combination is already taken by another record
        if (name) {
            const existingCombo = await db.subCategory.findOne({
                where: {
                    name,
                    categoryId: cat.categoryId, // use existing categoryId
                    id: { [Op.ne]: id }
                }
            });
            if (existingCombo) {
                return res.status(400).json({ mess: "SubCategory already exists with this name and category" });
            }
        }

        await cat.update({
            name: name || cat.name,
            slug: slug?newSlug:cat.slug
        });

        return res.status(200).json({ data: "Successfully updated subCategory" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ mess: err.message || err });
    }
},



    /// delete category

deleteMain: async (req, res) => {
    const { id } = req.body;

    try {
        // Find the category first
        const category = await db.category.findByPk(id);
        if (!category) {
            return res.status(400).json({ mess: "category does not exist" });
        }

        // Check if any subCategory exists with this categoryId
        const subCategoryCount = await db.subCategory.count({ where: { categoryId: id } });
        if (subCategoryCount > 0) {
            return res.status(400).json({ mess: "Cannot delete category: subCategories exist for this category" });
        }

        // Safe to delete the category now
        await category.destroy();
        return res.status(200).json({ data: "successfully deleted category" });

    } catch (err) {
        return res.status(400).json({ mess: err.message || err });
    }
},

deleteSub: async (req, res) => {
    const { id } = req.body;

    try {
        const subCat = await db.subCategory.findByPk(id);
        if (!subCat) {
            return res.status(400).json({ mess: "subCategory does not exist" });
        }

        // Check if any childCategory exists with this subCategoryId
        const childExists = await db.childCategory.findOne({
            where: { subCategoryId: id }
        });

        if (childExists) {
            return res.status(400).json({ mess: "Cannot delete subCategory with existing childCategories" });
        }

        await subCat.destroy();
        return res.status(200).json({ data: "Successfully deleted subCategory" });

    } catch (err) {
        return res.status(400).json({ mess: err.message || err });
    }
},


    // child category

  createChild: async (req, res) => {
  const { name, slug, categoryId, subCategoryId } = req.body;

  if (!name || !slug || !categoryId || !subCategoryId) {
    return res.status(400).json({ mess: "Please provide name, categoryId, subCategoryId, and slug" });
  }

  try {
    const newSlug = slugify(slug, { lower: true, strict: true });
  
    // Check for unique slug
    const existingSlug = await db.childCategory.findOne({ where: { slug:newSlug } });
    if (existingSlug) {
      return res.status(400).json({ mess: "childCategory already exists with this slug" });
    }

    // Check for duplicate combination
    const existingCombo = await db.childCategory.findOne({
      where: { name, categoryId, subCategoryId }
    });

    if (existingCombo) {
      return res.status(400).json({ mess: "childCategory with same name/category/subCategory already exists" });
    }

    // Create if validations pass
    const cat = await db.childCategory.create({ name, slug:newSlug, categoryId, subCategoryId });

    return res.status(200).json({ data: "successfully created childCategory" });

  } catch (err) {
    return res.status(400).json({ mess: err.message || "Error creating childCategory" });
  }
},


    childList: (req, res) => {
        db.childCategory.findAll({
            include: [{ model: db.category, attributes: ["name", "id"] },
            { model: db.subCategory, attributes: ["name", "id"] }], order: [['updatedAt', 'DESC']]
        })
            .then(cat => {
                if (cat) {
                    res.status(200).json({ data: cat });
                    return;
                }
                res.status(200).json({ mess: "empty subCategory" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                return;
            })
    },
     listAllCategory: (req, res) => {

        const query={
            include:[
            {model:db.category,attributes:['name']},{model:db.childCategory,attributes:['name']}
            ], order: [['updatedAt', 'DESC']]
        }
    
       db.subCategory.findAll(
       query
       ).then(cat=>{
            if(cat){
           return res.json({data:cat})
            }
            return res.status(400).json({mess:"category not found"})
       })
    },

  allCategories: async (req, res) => {
  try {
    const categories = await db.category.findAll({
      order: [['updatedAt', 'DESC']],
      attributes: ['name', 'slug'],
      include: [
        {
          model: db.subCategory,
          attributes: ['name', 'slug'],
          required: true,
          include: [
            {
              model: db.childCategory,
              attributes: ['name', 'slug'],
             // required: true, // This ensures only subcategories that have childCategories are fetched
            }
          ]
        }
      ]
    });

    if (!categories || categories.length === 0) {
      return res.status(200).json({ mess: "No categories with child categories found." });
    }

    return res.status(200).json({ data: categories });

  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ mess: "Internal server error", error });
  }
}
,

 updateChild: async (req, res) => {
    const { name, slug, id } = req.body;

    if (!name || !slug || !id) {
        return res.status(400).json({ mess: "Please provide name, slug, and id" });
    }

    try {
    const newSlug = slugify(slug, { lower: true, strict: true });
    
        // Find the existing record
        const existing = await db.childCategory.findByPk(id);
        if (!existing) {
            return res.status(400).json({ mess: "childCategory does not exist" });
        }

        // Check for duplicate slug (exclude current)
        const slugCheck = await db.childCategory.findOne({
            where: {
                slug:newSlug,
                id: { [Op.ne]: id }
            }
        });

        if (slugCheck) {
            return res.status(400).json({ mess: "Slug is already used by another childCategory" });
        }

        // Check for duplicate name + categoryId + subCategoryId (exclude current)
        const comboCheck = await db.childCategory.findOne({
            where: {
                name,
                categoryId: existing.categoryId,
                subCategoryId: existing.subCategoryId,
                id: { [Op.ne]: id }
            }
        });

        if (comboCheck) {
            return res.status(400).json({ mess: "Another childCategory with same name, category, and subcategory exists" });
        }

        // Proceed to update
        await existing.update({
            name,
            slug:newSlug
        });

        return res.status(200).json({ data: "Successfully updated childCategory" });

    } catch (err) {
        console.error(err);
        return res.status(400).json({ mess: err });
    }
},

    deleteChild: async (req, res) => {
    const { id } = req.body;

    try {
        const child = await db.childCategory.findByPk(id);
        if (!child) {
            return res.status(400).json({ mess: "childCategory does not exist" });
        }

        // Check if any product exists for this childCategory
        const productExists = await db.product.findOne({ where: { childCategoryId: id } });

        if (productExists) {
            return res.status(400).json({ mess: "Cannot delete: Products exist under this childCategory" });
        }

        // Safe to delete
        await child.destroy();
        return res.status(200).json({ data: "Successfully deleted childCategory" });

    } catch (err) {
        return res.status(400).json({ mess: err.message || err });
    }
},

    // find subcategory by maincategory


    subListByMainCategory: (req, res) => {
        db.category.findOne({
            where: { id: req.body.id },
            include: { model: db.subCategory, attributes: ["name", "id"] }
        })
            .then(cat => {
                if (cat) {
                    res.status(200).json({ data: cat });
                    return;
                }
                res.status(200).json({ mess: "empty Category" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                console.log(err)
                return;
            })
    },

    childListByMainCategory: (req, res) => {
        db.subCategory.findOne({
            where: { id: req.body.id },
            include: { model: db.childCategory, attributes: ["name", "id"], order: [['updatedAt', 'DESC']] }
        })
            .then(cat => {
                if (cat) {
                    res.status(200).json({ data: cat });
                    return;
                }
                res.status(200).json({ mess: "empty Category" });
            }).catch(err => {
                res.status(400).json({ mess: err });
                console.log(err)
                return;
            })
    },


}

module.exports = controller;
