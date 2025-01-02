require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/register', async (req, res) => {
  const formData = req.body;

  try {
    const newUser = new User(formData);
    await newUser.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Welcome to Web3Nova - Your Journey Begins Here!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Web3Nova, ${formData.fullName}!</h2>
          
          <p>We're thrilled to receive your application for the ${formData.courseType} course!</p>
          
          <p>We will be selecting 20 dedicated developers for our first cohort, and we're excited about the possibility of having you join us.</p>

          <h3>Next Steps:</h3>
          <ol>
            <li>Join our WhatsApp community for updates and announcements:
              <br><a href="https://chat.whatsapp.com/CuPv6e9N8Rt7cY6gDU82Qp" style="color: #2388DA;">Click here to join WhatsApp group</a>
            </li>
            <li>Follow us on Twitter for the latest news:
              <br><a href="https://x.com/web3_nova" style="color: #2388DA;">@web3nova</a>
            </li>
          </ol>

          <p>We'll be reviewing applications and will contact you soon with further details.</p>

          <p>Best regards,<br>Web3Nova Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ 
      message: 'User registered and email sent successfully',
      whatsappLink: 'https://chat.whatsapp.com/CuPv6e9N8Rt7cY6gDU82Qp'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));