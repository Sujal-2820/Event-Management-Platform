// routes/mailConfirmation.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Handle POST request for mail confirmation
router.post('/', async (req, res) => {
  try {
    const {
      attendeeEmail,
      organizerEmail,
      emailSubject,
      emailDescription,
      eventDateTime,
      eventLocation,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: attendeeEmail,
      subject: emailSubject,
      html: `
        <p>${emailDescription}</p>
        <p>Contact the Organizer: ${organizerEmail}</p>
        <p>Event Date and Time: ${new Date(eventDateTime).toLocaleString()}</p>
        <p>Location: ${eventLocation}</p>
        <p>We hope to see you there!</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server while sending mail', details: error.message });
  }
});

module.exports = router;
