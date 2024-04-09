// routes/mailVerify.js
//To verify the Email of organizer by sending the OTP


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();


// Create a nodemailer transporter with your email provider details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Store OTPs temporarily (ideally, you should use a database for this)
const otpStore = new Map();

// Route to send OTP to the user's email
router.post(
  '/generate-otp',
  [
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const otp = generateOTP();

    // Send the OTP to the user's email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Verification OTP',
      text: `Your OTP for email verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Store the OTP for verification
      otpStore.set(email, otp);

      return res.status(200).json({ message: 'OTP sent successfully' });
    });
  }
);

// Route to verify the OTP
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('otp').isNumeric().withMessage('Invalid OTP format'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const userOTP = req.body.otp;
    const storedOTP = otpStore.get(email);

    if (!storedOTP || storedOTP !== parseInt(userOTP, 10)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear the OTP after successful verification (ideally, you should use a database for this)
    otpStore.delete(email);

    return res.status(200).json({ message: 'OTP verified successfully' });
  }
);

module.exports = router;
