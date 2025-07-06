const joi=require('joi');
// const joidateextension=require('joi-date-extensions')

// const JOi=joi.extend(joidateextension)
const validate=(schema)=>{

  return  (req,res,next)=>{
        const result=
        req.method!='GET'?
        schema.validate(req.body):
        schema.validate(req.body);

        // console.log(result.error)

        if (result.error) {
            return  res.status(400).json({message:"some err",err:result.error}); 
           
        }

        if (!req.value) {
            req.value={};
        }

        req.value['body']=result.value;
        next();      
    }

}



const schema={
    registerSchema:joi.object().keys({
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        password:joi.string().required(),
        email:joi.string().email().required()
    }),
    create:joi.object().keys({
        name:joi.string().required(),
        class:joi.string().required(),
        rollNO:joi.number(),
    }),
    // find:joi.ob
}

module.exports={
    validate,schema
}