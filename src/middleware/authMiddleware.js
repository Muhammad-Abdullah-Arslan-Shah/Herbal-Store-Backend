const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Auth middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the header (after 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Decode the JWT and verify it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user information to the request object
      req.user = decoded.user;

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      // If the token is invalid or expired
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
