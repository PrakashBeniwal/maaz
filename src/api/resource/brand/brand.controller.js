const { Op } = require("sequelize");
const db = require("../../../../models");

const router={
     get:(req,res)=>{
       const {id}=req.query; 
       let query={
        where:{id}
       };

        db.brand.findOne(query)
        .then(data=>{
            res.status(200).json({list:data})
        }).catch(err=>{
            console.log({err});
            // res.status(400).send({message:"error ocurred",err})
            throw new RequestError("Error");
        })

    },
     list:(req,res)=>{

       let query={};
        // query.where={name:{[Op.like]:"%pr%"}};
        // query.include={model:db.Student};

        db.brand.findAll(query)
        .then(data=>{
            res.status(200).json({list:data})
        }).catch(err=>{
            console.log({err});
            // res.status(400).send({message:"error ocurred",err})
            throw new RequestError("Error");
        })

    },

    create:(req,res)=>{

        const{name,slug}=req.body;

        if (!name||!slug) {
            res.status(400).json({mess:"please provide name and slug"});
            return;
        }
        
        db.brand.findOne({where:{name}})
        .then(loc=>{
            if (loc) {
                res.status(400).json({mess:"brand already exist with this name"});
                return;
            }
            db.brand.create({
                name,slug
            })
            .then(data=>{
               if (data) {
                res.status(200).send({mess:"created new brand"});
                return;
               }
                return;
            })
            .catch(err=>{
                res.status(400).send({mess:err});
                return;
            })
        })
        .catch(err=>{
            res.status(400).json({mess:err});
            return;
        })

       
    },
    update:(req,res)=>{
        const{name,slug,id}=req.body;

        if (!name || !slug) {
            res.status(400).send({mess:"please fill name and slug"});
            return;
        }

        db.brand.findOne({
            where:{name}
        })
        .then(loc=>{
                if (loc?loc.id!=id:false) {
                    res.status(400).json({mess:"brand is already exist with this name"});
                    return;
                }
                
                db.brand.update({
                    name:name,
                    slug:slug
                },
                {where:{id}}
                )
                .then(success=>{
                    if (success) {
                        res.status(200).json({mess:"brand updated successfully"})
                        return;
                    }
                    res.status(400).json({mess:"err in updating brand"});
                    return
                })
                .catch(err=>{
                    res.status(400).json({mess:err});
                    return;
                })
            
        }).catch(err=>{
            res.status(400).json({mess:err});
            return;
        })

    },
    delete:(req,res)=>{
        
        const {id}=req.query;

        db.brand.findByPk(id)
        .then(loc=>{
            if (loc) {
                loc.destroy()
                .then(success=>{
                    if (success) {
                        res.status(200).json({mess:"brand deleted successfully"})
                        return;
                    }
                    res.status(400).json({mess:"err in deleting brand"});
                    return;
                })
                .catch(err=>{
                    res.status(400).json({mess:err});
                    return;
                })
                return;
            }
            res.status(400).json({mess:"brand not found"})
            return;
        }).catch(err=>{
            res.status(400).json({mess:err});
            return;
        })
        
    },

}

module.exports=router;