// src/controllers/userController.js

import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import handleError from '../utils/errorHandler.js';

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return handleError(res, 'User already exists', 400);

    // Create a new user
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      token: generateToken(user),
    });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Login user
const loginUser = async (req, res) => {
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
      token: generateToken(user),
    });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return handleError(res, 'User not found', 404);

    res.json(user);
  } catch (error) {
    handleError(res, error.message, 500);
  }
};


// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const { name, address } = req.body;

    // Find the target user by ID from the route parameters
    const user = await User.findById(req.params.id);
    if (!user) return handleError(res, 'User not found', 404);

    // Check if a customer is trying to update another user's details
    if (req.user.role !== 'Admin' && req.user.id !== req.params.id) {
      return handleError(res, 'Unauthorized access: You can only update your own details', 403);
    }

    // Check if an admin is trying to update another admin's details
    if (user.role === 'Admin' && req.user.role !== 'Admin') {
      return handleError(res, 'Unauthorized access: Only admins can update admin details', 403);
    }

    // Update user details
    user.name = name || user.name;
    user.address = address || user.address;

    await user.save();

    res.json({
      message: 'User details updated successfully',
      userId: user._id,
      token: generateToken(user),
    });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};



// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return handleError(res, 'User not found', 404);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

export { 
  registerUser, 
  loginUser, 
  getUserDetails, 
  updateUserDetails, 
  deleteUser, 
  getAllUsers 
};
