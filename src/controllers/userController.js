// src/controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { handleError } = require('../utils/errorHandler');

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return handleError(res, 'User already exists', 400);

    // Create a new user
    const user = await User.create({ name, email, password, address });
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user._id, 
      token: generateToken(user) 
    });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return handleError(res, 'Invalid email or password', 401);

    // Send response with token
    res.json({ 
      message: 'Login successful', 
      userId: user._id, 
      token: generateToken(user) 
    });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};
