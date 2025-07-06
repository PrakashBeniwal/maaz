const jwt = require("jsonwebtoken");
const db = require("../../../../models");
const bcrypt = require('bcryptjs');
const  transporter = require("../../../mailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const routes = {
  
  login: (req, res) => {
    try {
      const { email, id, block } = req.user;
      const token = jwt.sign({ email, id, block }, process.env.SECRET_KEY, { expiresIn: '1h' });
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


  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;

    try {
      const user = await db.Admin.findOne({ where: { email } });

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
      const user = await db.Admin.findOne({ where: { email } });

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
      const user = await db.Admin.findOne({ where: { email } });

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
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}`
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
      const user = await db.Admin.findOne({ where: { email } });

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
      const user = await db.Admin.findOne({ where: { email } });
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
