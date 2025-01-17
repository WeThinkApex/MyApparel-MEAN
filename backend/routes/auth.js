const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(200).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object
    const userData = {
      name,
      email,
      oriPassword: password,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      role: isAdmin ? 'admin' : 'user'
    };
    // Create and save user
    const user = new User(userData);
    await user.save();
    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      throw new Error("JWT_SECRET is not configured");
    }
    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: user.isAdmin,
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10d' }
    );

    // Send response
    return res.status(201).json({ 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      isAdmin: user.isAdmin,
      role: user.role,
      token 
    });

  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login route remains the same
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: user.isAdmin,
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10d' }
    );

    res.json({ 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      isAdmin: user.isAdmin,
      role: user.role,
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;