const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'staffsync_secret_jwt_key_2026');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found' });
      }
      next();
    } catch (error) {
      console.error('JWT Verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no bearer token provided' });
  }
};

// Role-based authorization guard
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const normalizedRoles = roles.map((r) => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
