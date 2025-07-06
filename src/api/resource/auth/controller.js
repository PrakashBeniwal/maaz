const jwt = require("jsonwebtoken");
const db = require("../../../../models");
const bcrypt = require('bcryptjs');
const  transporter = require("../../../mailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const routes = {

  register: async (req, res) => {
    const { name, email, password,phone } = req.body;
    
    try {

        const normalizedEmail = email.toLowerCase();
const gmailRegex = /^[^\s@]+@gmail\.com$/;

if (!gmailRegex.test(normalizedEmail)) {
  return res.status(400).json({ mess: 'Only Gmail email addresses are allowed' });
}      

      // Limit the length of name field
      if (name && name.length > 20) {
        return res.status(400).json({ mess: 'Name exceeds maximum length' });
      }

      if (email && email.length > 50) {
        return res.status(400).json({ mess: 'Email exceeds maximum length' });
      }

      if (password && password.length > 20) {
        return res.status(400).json({ mess: 'Password exceeds maximum length' });
      }

      if (password && password.length < 6) {
        return res.status(400).json({ mess: 'The password  is less than 6 character' });
      }


      if (!name || !email || !password) {
        return res.status(400).json({ mess: "please provide all required field" })
      }


      // Check if the username or email is already taken
      const existingUser = await db.customer.findOne({ where: { email:normalizedEmail } });
      if (existingUser) {
        return res.status(400).json({ mess: 'Email is already Registered Please Login' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      // Create a new user record in the database
      await db.customer.create({ name,phone, bock: false, email:normalizedEmail, status: false, password: hashedPassword ,otp,otpExpires});

      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ mess: 'User registered successfully' });

    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => ({ field: err.path, mess: err.mess }));
        console.log(errors)
        res.status(400).json({ mess: "Validation Error" });
      } else {
        console.error('Error registering user:', error);
        res.status(500).json({ mess: 'Internal server error' });
      }
    }
  }
  ,
  
  login: (req, res) => {
    try {
      const { email, id, block } = req.user;
      const token = jwt.sign({ email, id, block }, process.env.SECRET_KEY, { expiresIn: '10h' });
      if (id) {
        return res.status(200).json({ mess: "Login Successfully",token,user:{id,email} });
      } else {
        return res.status(200).json({ mess: "Unauthorized user" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: error })
    }

  },

  list: async (req, res) => {
    try {
      const users = await db.customer.findAll({ where: { status: true } });

      return res.status(200).json({ list: users });

    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;

    try {
      const user = await db.customer.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ mess: 'User not found' });
      }
      if (!(user.otp == otp) || user.otpExpires < new Date()) {
        return res.status(400).json({ mess: 'Invalid or expired OTP' });
      }
      
      // user.otp = null;
      // user.otpExpires = null;
      user.status=true;
      await user.save();

      res.status(200).json({ mess: 'OTP verified' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: 'Server error' });
    }
  },

    verifyEmail: async (req, res) => {
    const { email, otp } = req.body;

    try {
      const user = await db.customer.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ mess: 'User not found' });
      }
      if (!(user.otp == otp) || user.otpExpires < new Date()) {
        return res.status(400).json({ mess: 'Invalid or expired OTP' });
      }
      
      user.otp = null;
      user.otpExpires = null;
      user.status=true;
      await user.save();

      res.status(200).json({ mess: 'OTP verified' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: 'Server error' });
    }
  },

  forgetPassword: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await db.customer.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ mess: 'User not found' });
      }

      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send OTP via email
      const mailOptions = {
  from: `"SyncxWorld Support" <${process.env.MAIL_FROM}>`, // Adds sender name
  to: email,
  subject: 'Your Password Reset Code',
  text: `Hi,

We received a request to reset your password.

Your OTP code is: ${otp}

If you didn’t request this, please ignore this email.

Thanks,  
SyncxWorld Team`,
  html: `
    <p>Hi,</p>
    <p>We received a request to reset your password.</p>
    <p><strong>Your OTP code is: ${otp}</strong></p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Thanks,<br>SyncxWorld Team</p>
  `
};


    await transporter.sendMail(mailOptions);
    
      res.status(200).json({ mess: 'OTP sent to email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: 'Server error' });
    }
  },

  resetPassword: async (req, res) => {
    const { email, otp, password } = req.body;

  if(!email||!otp||!password){
    return res.status(400).json({mess:"missing email,otp or password"})
  }
    
    try {
      const user = await db.customer.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ mess: 'User not found' });
      }

      if (!(user.otp == otp) || user.otpExpires < new Date()) {
        return res.status(400).json({ mess: 'Invalid or expired OTP' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.status(200).json({ mess: 'Password reset successfully' });

       const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Password Reset Successfully',
        text: `Your  password is Reset`
      };
      await transporter.sendMail(mailOptions);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: 'Server error' });
    }
  },

  resendOtp:async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await db.customer.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ mess: 'User not found' });
      }
  
      if (user.status) {
        return res.status(400).json({ mess: 'Email already verified' });
      }
  
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
  
      // Send OTP via email
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({ mess: 'OTP sent to the email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mess: 'Server error' });
    }
  }
  

}

module.exports = routes;
