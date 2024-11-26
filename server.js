require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  courseType: String,
  fullName: String,
  email: String,
  phone: String,
  githubProfile: String,
  country: String,
  state: String,
  city: String,
  gender: String,
  trainingTime: String,
  inspiration: String,
  goals: String,
  walletAddress: String,
  hasSecretKey: Boolean,
});

const User = mongoose.model('User', userSchema);

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API to register a user
app.post('/register', async (req, res) => {
  const formData = req.body;

  try {
    // Save user to database
    const newUser = new User(formData);
    await newUser.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Welcome to Web3 Nova',
      text: `
        Hello ${formData.fullName},

        Thank you for registering for the ${formData.courseType} course with Web3 Nova.
        
        Your training duration is ${formData.trainingTime}, and we are thrilled to have you onboard.
        
        Best of luck in achieving your goals: ${formData.goals}!

        Regards,
        Web3 Nova Team
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'User registered and email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
