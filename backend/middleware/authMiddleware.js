const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate users
exports.authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user and token to the request object
    req.user = user;
    req.token = token;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, please authenticate again' });
  }
};

// Middleware to authorize admin users
exports.authorizeAdmin = async (req, res, next) => {
  try {
    // Check if the authenticated user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    // Continue to the next middleware or route
    next();
  } catch (error) {
    res.status(403).json({ message: 'Authorization failed' });
  }
};
