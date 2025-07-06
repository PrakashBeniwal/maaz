const db = require("../../../../models");

const router={
     list:(req,res)=>{

       let query={
        include:{model:db.state}
       };
        // query.where={name:{[Op.like]:"%pr%"}};
        // query.include={model:db.Student};

        db.city.findAll(query)
        .then(data=>{
            res.status(200).json({list:data})
        }).catch(err=>{
            console.log({err});
            // res.status(400).send({message:"error ocurred",err})
             res.status(400).json({ mess: err });
        })

    },
    getCitiesBySateId:(req,res)=>{
    const {id}=req.query;
       let query={
        include:{model:db.city,attributes:['name','id'],where:{status:1}},
        where:{id}
       };

        db.state.findOne(query)
        .then(data=>{
            res.status(200).json({data})
        }).catch(err=>{
            console.log({err});
             res.status(400).json({ mess: err });
        })

    },

   create: (req, res) => {
  const { name, status, stateId } = req.body;

  if (!name || !status || !stateId) {
    return res.status(400).json({ mess: "Please provide name, status, and stateId" });
  }

  db.city.findOne({ where: { name, stateId } })
    .then(existing => {
      if (existing) {
        return res.status(400).json({ mess: "City already exists in this state" });
      }

      db.city.create({ name, status, stateId })
        .then(data => res.status(200).json({ mess: "Created new city", data }))
        .catch(err => res.status(400).json({ mess: err.message }));
    })
    .catch(err => res.status(400).json({ mess: err.message }));
},


  update: async (req, res) => {
  const { name, status, id } = req.body;

  if (!id || !name || !status) {
    return res.status(400).json({ mess: "Please provide id, name, status, and stateId" });
  }

  try {
    const city = await db.city.findByPk(id);
    if (!city) {
      return res.status(404).json({ mess: "City not found" });
    }
    // Check if another city with same name + stateId exists
    const duplicate = await db.city.findOne({
      where: {
        name,
        stateId:city.stateId,
        id: { [db.Sequelize.Op.ne]: id }
      }
    });

    if (duplicate) {
      return res.status(400).json({ mess: "Another city with same name in this state already exists" });
    }

    await city.update({ name, status,city:city?.stateId });

    return res.status(200).json({ mess: "City updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ mess: err.message });
  }
},

    
    delete:(req,res)=>{
        
        const {id}=req.query;

        db.city.findByPk(id)
        .then(loc=>{
            if (loc) {
                loc.destroy()
                .then(success=>{
                    if (success) {
                        res.status(200).json({mess:"city deleted successfully"})
                        return;
                    }
                    res.status(400).json({mess:"err in deleting city"});
                    return;
                })
                .catch(err=>{
                    res.status(400).json({mess:err});
                    return;
                })
                return;
            }
            res.status(400).json({mess:"city not found"})
            return;
        }).catch(err=>{
            res.status(400).json({mess:err});
            return;
        })
        
    },

}

module.exports=router;
