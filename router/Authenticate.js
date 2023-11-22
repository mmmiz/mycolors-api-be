const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/UserData');
const jwt = require('jsonwebtoken');
const { verifyToken, SECRET_KEY } = require('../middleware/middleware');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const router = express.Router();
require('dotenv').config();


// Router settings 
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('this email address is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  } 
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//get profile
router.get('/profile', verifyToken, async(req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    res.status(200).json({ user });
    // this user is set up here means in the frontened <h1>Welcome, {userInfo.user.username}!</h1> not userinfo.username
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


// Put route UPDATE user data
router.put('/profile/edit', verifyToken, async (req, res) => {
  const { newEmail } = req.body; // Use newEmail from the request body

  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      { email: newEmail },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'newEmail updated Successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
