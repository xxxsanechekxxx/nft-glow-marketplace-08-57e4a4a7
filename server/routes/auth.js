const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, login, nickname, birthDate, country } = req.body;

    // Validate required fields
    if (!email || !password || !login || !nickname || !birthDate || !country) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const loginExists = await User.findOne({ login });
    if (loginExists) {
      return res.status(400).json({ message: 'Login already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      login,
      nickname,
      birthDate,
      country,
    });

    const savedUser = await user.save();
    
    // Create token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        login: savedUser.login,
        nickname: savedUser.nickname,
        birthDate: savedUser.birthDate,
        country: savedUser.country,
        balance: savedUser.balance,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error.message || 'Error during registration. Please try again.' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        login: user.login,
        nickname: user.nickname,
        birthDate: user.birthDate,
        country: user.country,
        balance: user.balance,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      login: user.login,
      nickname: user.nickname,
      birthDate: user.birthDate,
      country: user.country,
      balance: user.balance,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
