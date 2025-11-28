// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      // Split turns string into array ['Bearer', 'token123'] -> index 1 is the token
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database using the ID from the token
      // .select('-password') ensures we don't return the password hash
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error(error);
      res.status(401); // 401 means Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };