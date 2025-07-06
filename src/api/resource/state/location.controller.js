const { Op } = require("sequelize");
const db = require("../../../../models");

const router={
     list:(req,res)=>{
     
        db.state.findAll()
        .then(data=>{
            res.status(200).json({list:data})
        }).catch(err=>{
            console.log({err});
            // res.status(400).send({message:"error ocurred",err})
            throw new RequestError("Error");
        })

    },
       getSate:(req,res)=>{

       let query={
       attributes:['id','name'],where:{status:1}
       };

        db.state.findAll(query)
        .then(data=>{
            res.status(200).json({list:data})
        }).catch(err=>{
            console.log({err});
            // res.status(400).send({message:"error ocurred",err})
            throw new RequestError("Error");
        })

    },

    create:(req,res)=>{

        const{name,status}=req.body;

        if (!name||!status) {
            res.status(400).json({mess:"please provide name and status"});
            return;
        }
        
        db.state.findOne({where:{name}})
        .then(loc=>{
            if (loc) {
                res.status(400).json({mess:"state already exist with this name"});
                return;
            }
            db.state.create({
                name,status
            })
            .then(data=>{
               if (data) {
                res.status(200).send({mess:"created new state"});
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
        const{name,status,id}=req.body;

        if (!name || !status) {
            res.status(400).send({mess:"please fill name and status"});
            return;
        }

        db.state.findOne({
            where:{name}
        })
        .then(loc=>{
                if (loc?loc.id!=id:false) {
                    res.status(400).json({mess:"state is already exist with this name"});
                    return;
                }
                
                db.state.update({
                    name:name,
                    status:status
                },
                {where:{id}}
                )
                .then(success=>{
                    if (success) {
                        res.status(200).json({mess:"state updated successfully"})
                        return;
                    }
                    res.status(400).json({mess:"err in updating state"});
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
    delete: async (req, res) => {
  const { id } = req.query;

  try {
    const state = await db.state.findByPk(id);
    if (!state) {
      return res.status(404).json({ mess: "State not found" });
    }

    const citiesUsingState = await db.city.count({ where: { stateId: id } });
    if (citiesUsingState > 0) {
      return res.status(400).json({
        mess: "Cannot delete state. Cities are associated with this state.",
      });
    }

    await state.destroy();
    return res.status(200).json({ mess: "State deleted successfully" });
  } catch (err) {
    return res.status(500).json({ mess: err.message || "Error deleting state" });
  }
}


}

module.exports=router;
