// invoiceGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../../models'); // Sequelize models

const generateInvoice = async (orderId) => {
  try {
    const order = await db.order.findOne({
      where: { id:orderId },
      include: [
        {
          model: db.customer,
          attributes: ['name', 'email', 'phone'],
        },
        {
          model: db.address,
          attributes: ['address', 'postalCode', 'phone'],
          include: [
            {
              model: db.city,
              attributes: ['name'],
              include: [
                {
                  model: db.state,
                  attributes: ['name'],
                }
              ]
            }
          ]
        },
        {
          model: db.orderItem,
          attributes: ['name', 'qty', 'price', 'total'],
        }
      ]
    });

    if (!order) throw new Error('Order not found');

    // Create file path
    const fileName = `invoice-${order.id}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, fileName);

    // Create PDF
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();

      // Order details
      doc.fontSize(12)
        .text(`Order Number: ${order.number}`)
        .text(`Delivery Date: ${order.deliveryDate?.toLocaleDateString()}`)
        .text(`Payment Method: ${order.paymentMethod=='cod'?"Cash On Delivery":order.paymentMethod}`)
        .moveDown();

      // Customer details
      doc.text('Customer Info:', { underline: true });
      doc.text(`Name: ${order.customer.name}`);
      doc.text(`Email: ${order.customer.email}`);
      doc.text(`Phone: ${order.customer.phone}`).moveDown();

      // Address
      const addr = order.address;
      const city = addr?.city?.name || '';
      const state = addr?.city?.state?.name || '';

      doc.text('Shipping Address:', { underline: true });
      doc.text(`${addr.address}, ${city}, ${state}`);
      doc.text(`Postal Code: ${addr.postalCode}`);
      doc.text(`Phone: ${addr.phone}`).moveDown();

      // Items
      doc.text('Items:', { underline: true });
      order.orderItems.forEach((item, i) => {
        doc.text(
          `${i + 1}. ${item.name} x ${item.qty} - PKR ${item.price} = PKR ${item.total}`
        );
      });

      doc.moveDown();
      doc.text(`Subtotal: PKR ${order.subTotal}`);
      doc.text(`Courier Cost: PKR ${order.courierCost}`);
      doc.fontSize(14).text(`Grand Total: PKR ${order.grandTotal}`, { align: 'right' });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return filePath;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

module.exports = generateInvoice;

