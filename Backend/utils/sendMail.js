// utils/sendClaimApprovalEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const { User } = require('../models/user.model'); // adjust path as necessary

const sendClaimApprovalEmail = async (userId, subject, text) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('user not found');

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);


  } catch (error) {
    console.error('Error sending claim approval email and notification:', error);
  }
};

module.exports = {sendClaimApprovalEmail};
