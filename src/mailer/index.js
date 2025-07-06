const nodemailer = require('nodemailer');
require('dotenv/config')
// Create Nodemailer transporter using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
        user: process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    },
  tls: {
    rejectUnauthorized: false // allow self-signed certs if needed
  }
});

module.exports=transporter;

