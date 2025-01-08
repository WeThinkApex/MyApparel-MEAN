const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get user profile (protected route)
// router.get('/profile', authenticate, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     if (!user) {
//       console.log("user middle")

//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Admin-only route: Get all users
// router.get('/admin/users', authenticate, authorizeAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;
