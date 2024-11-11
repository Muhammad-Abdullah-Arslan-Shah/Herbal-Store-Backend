// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token;

  // Check if token is sent in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object
      req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Authentication failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('No token, authentication failed');
  }
};

export default authMiddleware;
