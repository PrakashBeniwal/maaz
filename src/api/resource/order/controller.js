const db = require("../../../../models");
const dayjs = require('dayjs'); // npm install dayjs
const crypto = require('crypto');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // store your secret key in .env
const  transporter = require("../../../mailer");
const  generateInvoice = require("../../../invoice");
const DeleteInvoice = require("../../../invoice/delete");
const ExcelJS = require('exceljs');
const endpointSecret =process.env.STRIPE_WEBHOOK_SECRET;
const { Op } = require("sequelize");

const formatDate = (inputDate) => {
  if (!inputDate) return '';
  const date = new Date(inputDate);
  if (isNaN(date)) return ''; // Handle invalid dates
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
  

async function createStripeCheckoutSession({ orderItems, courierCost, courierName, orderId, email }) {
  // Stripe requires prices in the smallest currency unit (e.g., cents, paisa)
  const lineItems = orderItems.map(item => ({
    price_data: {
      currency: 'pkr', // Change to 'usd' if PKR fails
      product_data: {
        name: item.name,
        // Stripe requires HTTPS URLs for images, or remove this field
        // Uncomment only if item.photo is a valid HTTPS URL
         images: [item.photo],
      },
      unit_amount: Math.round(parseFloat(item.price) * 100), // Float to int (e.g. 99.99 → 9999)
    },
    quantity: item.qty,
  }));

  // Add shipping line item
  lineItems.push({
    price_data: {
      currency: 'pkr',
      product_data: {
        name: `Shipping (${courierName})`,
      },
      unit_amount: Math.round(parseFloat(courierCost) * 100),
    },
    quantity: 1,
  });

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // ✅ Only include supported types. Add 'paypal' only if enabled in Stripe
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/order-success`,
    cancel_url: `${process.env.CLIENT_URL}/order-fail`,
    metadata: {
      orderId: orderId.toString(),
      email: email
    }
  });

  return session;
}


const routes = {

  create: async (req, res) => {
    const { items, paymentMethod, courierPricingId, customerId, addressId,email } = req.body;

    if (
  !items || !Array.isArray(items) || items.length === 0 ||
  !paymentMethod ||
  !courierPricingId ||
  !customerId ||
  !addressId
) {
console.log({items,paymentMethod,courierPricingId,customerId,addressId})
  return res.status(400).json({
    success: false,
    mess: 'Missing or invalid required fields'
  });
}


const invalidItems = items.some(item => 
  !item.id || typeof item.quantity !== 'number' || item.quantity <= 0
);

if (invalidItems) {
  return res.status(400).json({
    success: false,
    mess: 'Each item must include a valid product ID and quantity'
  });
}

const allowedMethods = ['cod', 'stripe', 'hbl'];
if (!allowedMethods.includes(paymentMethod)) {
  return res.status(400).json({
    success: false,
    mess: 'Invalid payment method'
  });
}

    const t = await db.sequelize.transaction();

    try {
      // 1. Fetch courier pricing
      const courierPricing = await db.courierPricing.findOne(
      {
      where:{id:courierPricingId},include:{model:db.courier,attributes:['name']},attributes:['courierId','price','estimatedDays']
      }
      );
      if (!courierPricing) {
      return res.status(500).json({ success: false, mess: "Invalid courierPricingId" });
        
      }

      const courierId = courierPricing.courierId;
      const courierCost = courierPricing.price;

      let deliveryDate = null;
const days = parseInt(courierPricing.estimatedDays);

if (!isNaN(days)) {
  deliveryDate = dayjs().add(days, 'day').toDate();
}


      // 2. Fetch products
      const productIds = items.map(i => i.id);
      const products = await db.product.findAll({
        where: { id: productIds }
      });

      const productMap = {};
      for (const product of products) {
        productMap[product.id] = product;
      }

      // 3. Build order items and calculate totals
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = productMap[item.id];

        if (!product) {
      return res.status(500).json({ success: false, mess: `Product with ID ${item.id} not found` });
        }

        const netPrice = product.netPrice * item.quantity;
        subtotal += netPrice;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          total: netPrice,
          name: product.name,
          photo: product.imgUrl,
          price: product.netPrice,
          qty: item.quantity
        });
      }

      const grandTotal = subtotal + parseInt(courierCost);

      // 4. Generate order number
      const dateStr = dayjs().format('YYYYMMDD');
      const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderNumber = `ORD-${dateStr}-${randomStr}`;

      // 5. Create order
      const order = await db.order.create({
        customerId,
        addressId,
        courierId,
        courierPricingId,
        paymentMethod,
        subTotal:subtotal,
        courierCost,
        grandTotal,
        status: 'pending',
        number: orderNumber,
        deliveryDate
      }, { transaction: t });

      // 6. Add orderId to each item
      orderItemsData.forEach(oi => oi.orderId = order.id);
      await db.orderItem.bulkCreate(orderItemsData, { transaction: t });

      for (const item of items) {
  const product = productMap[item.id];

  // Optional: check for available stock before deducting
  if (product.stock < item.quantity) {
      return res.status(500).json({ success: false, mess: `Insufficient stock for product ${product.name}` });
  }

  await db.product.update(
      { stock: product.stock - item.quantity,isAvailable:( product.stock - item.quantity ) >0?true:false },
    { where: { id: product.id }, transaction: t }
  );
}



      // 7. Handle COD payment
      if (paymentMethod === 'cod') {
        await db.payment.create({
          orderId: order.id,
          method: 'cod',
          status: 'success',
          amount: grandTotal
        }, { transaction: t });

        await t.commit();

     const pdf= await generateInvoice(order.id);

           
       const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your Invoice',
    text: 'Thanks for your order! Please find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: pdf,
      },
    ],
  };
  
      await transporter.sendMail(mailOptions); 
      await DeleteInvoice(pdf)
      
        return res.json({
          success: true,
          paymentMethod:'cod',
          redirectUrl:'https://www.syncxworld.com/order-success'
          // mess: "Order placed with COD",
          // orderId: order.id,
          // number: order.number
        });

      }


      // 8. For Stripe or HBL
     if (paymentMethod === 'stripe') {
  const session = await createStripeCheckoutSession({
    orderItems: orderItemsData,
    courierCost,
    courierName: courierPricing?.courier?.name,
    orderId: order.id,
    email:email
  });
 
  await t.commit();

  return res.json({
    success: true,
    paymentMethod,
    // orderId: order.id,
    // number: order.number,
    sessionId: session.id,
    redirectUrl: session.url
  });
}
    } catch (err) {
      await t.rollback();
      console.error(err);
      return res.status(500).json({ success: false, mess: "Checkout failed" });
    }
  }
,
retryStripePayment: async (req, res)=> {
  try {
    const { orderId } = req.body;

    // Fetch order from DB including price info
    const order = await db.order.findOne({ 
      where: { id: orderId } 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create Stripe session with single line item: total payment only
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: `Order Payment #${order?.number}`,
            },
            unit_amount: Math.round(order.grandTotal * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/order-success`,
      cancel_url: `${process.env.CLIENT_URL}/order-fail`,
      metadata: { orderId },
    });

  await db.order.update({paymentMethod:'stripe'})


    // Return session URL for redirect
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
}
,
retryCodPayment: async (req, res)=> {
  try {
    const { orderId,email } = req.body;

    // Fetch order from DB including price info
    const order = await db.order.findOne({ 
      where: { id: orderId } 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
  await db.payment.create({
          orderId: order.id,
          method: 'cod',
          status: 'success',
          amount: order?.grandTotal
        });
  await order.update({paymentMethod:'cod'})
  
        const pdf= await generateInvoice(order.id);

           
       const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your Invoice',
    text: 'Thanks for your order! Please find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: pdf,
      },
    ],
  };
  
      await transporter.sendMail(mailOptions); 
      await DeleteInvoice(pdf);
      
    // Return session URL for redirect
    res.json({ url:`${process.env.CLIENT_URL}/order-success`});
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
}
,
 paymentSuccess:async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
 // ✅ Get total amount paid in smallest currency unit (e.g., paisa if PKR)
    const amountTotal = session.amount_total; // e.g., 12000 for PKR 120
    const email=session.metadata.email;
    // If needed, convert to actual currency format
    const formattedAmount = (amountTotal / 100).toFixed(2); // e.g., 120.00
    
    await db.payment.create({
          orderId: order.id,
          method: 'stripe',
          status: 'success',
          amount: formattedAmount
        });
        
      const pdf= await generateInvoice(order.id);
 
       const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Your Invoice',
    text: 'Thanks for your order! Please find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: pdf,
      },
    ],
  };
  
      await transporter.sendMail(mailOptions); 
      await DeleteInvoice(pdf)
    // Optionally save other session/payment data
  }

  res.status(200).send('Webhook received');
},

 getOrdersByCustomer:async (req, res) => {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ success: false, mess: 'Customer ID is required' });
  }

  try {
    const orders = await db.order.findAll({
      where: { customerId },
      order: [['createdAt', 'DESC']],
      attributes:["id","courierCost","number","grandTotal","subTotal",
      "status","deliveryDate","createdAt","paymentMethod"],
      include: [
        {
          model: db.orderItem,
          as: 'orderItems',
          attributes: ['productId', 'name', 'photo', 'price', 'qty', 'total']
        },
        {
          model: db.payment,
          as: 'payment',
          attributes: ['method', 'status', 'amount', 'createdAt']
        },
        {
          model: db.courier,
          as: 'courier',
          attributes: ['name']
        }
      ]
    });

    return res.json({ success: true, orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, mess: 'Failed to fetch orders' });
  }
},


 cancelOrder: async (req, res) => {
  const { id } = req.query;
  const t = await db.sequelize.transaction();

  try {
    // 1. Fetch the order with orderItems and product (inside transaction)
    const order = await db.order.findOne({
      where: { id },
      include: [
        { model: db.payment },
        {
          model: db.orderItem,
          include: [{ model: db.product }]
        }
      ],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ success: false, mess: 'Order not found' });
    }

    // 2. Check cancel conditions
    if (order.status !== 'pending') {
      await t.rollback();
      return res.status(400).json({ success: false, mess: 'Only pending orders can be cancelled' });
    }

    if (order.payment?.method !== 'cod' && order.payment?.status!=="success") {
      await t.rollback();
      return res.status(400).json({ success: false, mess: 'Only COD orders can be cancelled at this time' });
    }

    // 3. Restore product stock
    for (const item of order.orderItems) {
      const product = item.product;
      if (product) {
        await product.update(
          { stock: product.stock + item.qty ,isAvailable:(product.stock + item.qty)>0?true:false},
          { transaction: t }
        );
      }
    }

    // 4. Update order status
    await order.update({ status: 'cancelled' }, { transaction: t });

    // 5. Commit transaction
    await t.commit();
    return res.json({ success: true, mess: 'Order cancelled and stock restored' });

  } catch (error) {
    console.error('Cancel order error:', error);
    await t.rollback();
    return res.status(500).json({ success: false, mess: 'Failed to cancel order' });
  }
}
,

  list: async (req, res) => {
    try {
      const order = await db.order.findAll(
      {order:[['createdAt','DESC']]}
      );
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },
  orderByStatus: async (req, res) => {
    try {
      const { status } = req.query;
  
      // Allowed statuses
      const allowedStatuses = ['pending', 'shipped', 'cancelled', 'delivered'];
  
      // Validate status param
      if (!status || !allowedStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          mess: "Invalid or missing status. Allowed: pending, shipping, cancelled, delivered"
        });
      }
  
      const orders = await db.order.findAll({
        where: { status: status.toLowerCase() },
        order: [['createdAt', 'DESC']],
      });
  
      return res.json({ success: true, data: orders });
    } catch (err) {
      console.error("Error fetching orders by status:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },
  

   count: async (req, res) => {
  try {
    const counts = await db.order.findAll({
      attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      group: ['status']
    });

    // Convert array to an object with 0 fallback for missing statuses
    const statusList = ['pending', 'paid', 'shipping', 'delivered', 'cancelled'];
    const countMap = statusList.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    counts.forEach(item => {
      const status = item.getDataValue('status');
      const count = item.getDataValue('count');
      countMap[status] = parseInt(count, 10);
    });

    return res.json(countMap);

  } catch (error) {
    console.error('Error counting orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
},

  getById: async (req, res) => {
    const { id } = req.query;
    if(!id){
    return res.status(400).json({mess:"Id is Missing"})
    }
    try {
      const order = await db.order.findOne({
      where:{id},
      attributes:['courierCost','deliveryDate','grandTotal','number','paymentMethod','status','subTotal','id','createdAt'],
      include:[
      // {model:db.payment},
      {model:db.orderItem,attributes:['name','photo','price','qty','total']},
      {model:db.address,attributes:['address','phone','postalCode'],
      include:[{model:db.city,attributes:['name'],
      include:[{model:db.state,attributes:['name']
      }]}]}]
      }
      );
      if (!order) return res.status(404).json({ mess: "order not found" });
      return res.json({ success: true, data: order });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

update: async (req, res) => {
  const { id, status, deliveryDate } = req.body;

  if (!id || !status) {
    return res.status(400).json({ mess: "Order ID and status are required" });
  }

  try {
    const order = await db.order.findByPk(id);

    if (!order) {
      return res.status(404).json({ mess: "Order not found" });
    }

    await order.update({
      status,
      deliveryDate: deliveryDate || order.deliveryDate, // update only if provided
    });

    return res.json({ success: true, mess: "Order updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(500).json({ mess: "Server error" });
  }
},

getAllPayments: async (req, res) => {

  try {
    const payments = await db.payment.findAll(
    {include:{model:db.order,attributes:['number']},
    attributes:['method','gatewayPaymentId','status','id','createdAt','amount'],
    order: [['createdAt', 'DESC']]
    }
    );

    if (!payments) {
      return res.status(404).json({ mess: "payments not found" });
    }

    return res.json({ success: true, data:payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({ mess: "Server error" });
  }
},


  delete: async (req, res) => {
    const { id } = req.query;
    try {
      const courier = await db.courier.findByPk(id);
      if (!courier) return res.status(404).json({ mess: "Courier not found" });

      await courier.destroy();
      return res.json({ success: true, mess: "Courier deleted" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

export: async (req, res) => {
  try {
    const { startDate, endDate, status, email } = req.query;
    const workbook = new ExcelJS.Workbook();
    const from = new Date(startDate);
    const to = new Date(endDate);

    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ success: false, message: 'Invalid date range' });
    }

    const sheetName = status === 'all'
      ? 'All'
      : status.charAt(0).toUpperCase() + status.slice(1);

    const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = [
      { header: 'Order ID', key: 'id' },
      { header: 'Customer Name', key: 'customer' },
      { header: 'Status', key: 'status' },
      { header: 'Total', key: 'total' },
      { header: 'Created At', key: 'createdAt' }
    ];

    const whereClause = {
      createdAt: { [Op.between]: [from, to] }
    };

    if (status !== 'all') {
      whereClause.status = status;
    }

    const orders = await db.order.findAll({
      where: whereClause,
      include: [{ model: db.customer, attributes: ['name'] }]
    });

    orders.forEach(order => {
      sheet.addRow({
        id: order.id,
        customer: order.customer?.name,
        status: order.status,
        total: order.grandTotal,
        createdAt: formatDate(order.createdAt)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    if (email) {

      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Order Report',
        text: `Your requested order report from ${startDate} to ${endDate} is attached.`,
        attachments: [
          {
            filename: `orders_${status}_${Date.now()}.xlsx`,
            content: buffer
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      // return res.send(buffer);
      // return res.json({ success: true, message: 'Email sent with Excel report.' });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=orders_${status}_${Date.now()}.xlsx`
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);
  } catch (err) {
    console.error("Export or Email Error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

};

module.exports = routes;



