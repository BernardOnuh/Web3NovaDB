require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'test@example.com', // Replace with your email for testing
  subject: 'Test Email',
  text: 'This is a test email from your application.',
};

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Connection Successful:', success);

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Failed to Send Test Email:', err);
      } else {
        console.log('Test Email Sent Successfully:', info);
      }
    });
  }
});
