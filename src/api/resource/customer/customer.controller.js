const { Op } = require("sequelize");
const db = require("../../../../models");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs")


const controller = {

    list:(req,res)=>{

        let query={
        attributes:['id','name','email','phone','createdAt']
        };
 
         db.customer.findAll(query)
         .then(data=>{
             res.status(200).json({list:data})
         }).catch(err=>{
             console.log({err});
             res.status(400).send({mess:"error ocurred",err})
         })
 
     },

    delete:(req,res)=>{

        let query={
            where:{
                id:req.body.id
            }
        };
 
         db.Customer.destroy(query)
         .then(data=>{
            if (data) {
             res.status(200).json({mess:"successfully delete customer"})
                return;
            }
            res.status(400).json({mess:"customer not exist"});
            return;
         }).catch(err=>{
             console.log({err});
             res.status(400).send({mess:`error ocurred ${err}`})
            //  throw new RequestError("Error");
         })

     },
    
  getUserDetailsByid(req, res) {
    const { id } = req.query;

    // Validate ID
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ mess: "Invalid or missing user ID" });
    }

    db.customer.findOne({
        where: { id },
        attributes: ['id','name','email','phone','createdAt'], 
        // include: [
        //     {
        //         model: db.addresses,
        //         required: false
        //     }
        // ]
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({ mess: "Account does not exist" });
        }

        res.status(200).json({data: user });
    })
    .catch(error => {
        console.error("Error fetching user:", error);
        res.status(500).json({ mess: "Internal server error" });
    });

},

updateUser: async (req, res) => {
 
  const { name, email, phone, currentPassword, newPassword,id } = req.body;

  try {
    const customer = await db.customer.findByPk(id);
    if (!customer) return res.status(404).json({ mess: 'User not found' });

    // If password change is requested
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, customer.password);
      if (!isMatch) return res.status(400).json({ mess: 'Incorrect current password' });

      customer.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    customer.name = name;
    // customer.email = email;
    customer.phone = phone;

    await customer.save();

    res.status(200).json({ mess: 'Account updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ mess: 'Server error' });
  }
},

getAddress: async (req, res) => {
  const { id } = req.query; 
    if(!id){
    return res.status(400).json({mess:"Cannot get Id"})
    }
  try {

    const userAddress=await db.customer.findOne({
    where:{id},
    attributes:['name','email'],
    include:[{
        model:db.address, attributes:['postalCode','phone','address','cityId'],
        include:[{model:db.state,attributes:['name']},{model:db.city,attributes:['name']}]
    }]
    });

    if (!userAddress) {
      return res.status(404).json({ mess: 'Address not found' });
    }

    res.status(200).json(userAddress);
  } catch (err) {
    console.error('Fetch address error:', err);
    res.status(500).json({ mess: 'Server error' });
  }
},

getCheckoutAddress: async (req, res) => {
  const { id } = req.query; 
    if(!id){
    return res.status(400).json({mess:"Cannot get Id"})
    }
  try {

    const userAddress=await db.customer.findOne({
    where:{id},
    attributes:['name','email','id'],
    include:[{
        model:db.address, attributes:['postalCode','phone','address','cityId','id'],
        include:[{model:db.state,attributes:['name','id']},
        {model:db.city,attributes:['name','id'],include:[{model:db.courierPricing,
        attributes:['id','price'],include:[{model:db.courier,attributes:['id','name']}]}]}]
    }]
    });

    if (!userAddress) {
      return res.status(404).json({ mess: 'Address not found' });
    }

    res.status(200).json(userAddress);
  } catch (err) {
    console.error('Fetch address error:', err);
    res.status(500).json({ mess: 'Server error' });
  }
},
updateAddress: async (req, res) => {
  const { id, address, cityId, stateId, postalCode, phone } = req.body;

  if (!id || !cityId || !stateId || !postalCode || !phone || !address) {
    return res.status(400).json({ mess: "Please provide all values" });
  }

  const t = await db.sequelize.transaction();

  try {
    const user = await db.customer.findOne({
      where: { id },
      include: { model: db.address },
      transaction: t
    });

    const oldAddressId = user.addressId;

    // Step 1: Create a new address
    const newAddress = await db.address.create({
      address,
      cityId,
      stateId,
      postalCode,
      phone
    }, { transaction: t });

    // Step 2: Update customer's addressId to new address
    await db.customer.update(
      { addressId: newAddress.id },
      { where: { id }, transaction: t }
    );

    // Step 3: Check if old address is used in any order
    const orderCount = await db.order.count({
      where: { addressId: oldAddressId },
      transaction: t
    });

    // Step 4: Delete old address if not used
    if (orderCount === 0) {
      await db.address.destroy({
        where: { id: oldAddressId },
        transaction: t
      });
    }

    // Step 5: Commit transaction
    await t.commit();
    return res.status(200).json({ mess: 'Address updated successfully' });

  } catch (err) {
    await t.rollback();
    console.error('Address update error:', err);
    return res.status(500).json({ mess: 'Server error' });
  }
}


}

module.exports = controller;
