// src/controllers/userController.js

import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import handleError from '../utils/errorHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
    if (userExists) return res.status(400).json(new ApiResponse(400, null, 'User already exists'));

    // Create a new user
    const user = await User.create({ name, email, password, address, role });
    res.status(201).json(new ApiResponse(201, {
      userId: user._id,
      token: generateToken(user),
    }, 'User registered successfully'));
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
      return res.status(401).json(new ApiResponse(401, null, 'Invalid email or password'));

    // Send response with token
    res.status(200).json(new ApiResponse(200, {
      userId: user._id,
      token: generateToken(user),
    }, 'Login successful'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json(new ApiResponse(404, null, 'User not found'));

    res.status(200).json(new ApiResponse(200, user, 'User details retrieved successfully'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const { name, address,password } = req.body;

    // Find the target user by ID from the route parameters
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(new ApiResponse(404, null, 'User not found'));

    // Check if a customer is trying to update another user's details
    if (req.user.role !== 'Admin' && req.user.id !== req.params.id) {
      return res.status(403).json(new ApiResponse(403, null, 'Unauthorized access: You can only update your own details'));
    }

    // Check if an admin is trying to update another admin's details
    if (user.role === 'Admin' && req.user.role !== 'Admin') {
      return res.status(403).json(new ApiResponse(403, null, 'Unauthorized access: Only admins can update admin details'));
    }

    // Update user details
    user.name = name || user.name;
    user.address = address || user.address;
    user.password = password || user.password;

    await user.save();

    res.status(200).json(new ApiResponse(200, {
      userId: user._id,
      token: generateToken(user),
    }, 'User details updated successfully'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json(new ApiResponse(404, null, 'User not found'));

    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(new ApiResponse(200, users, 'All users retrieved successfully'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json(new ApiResponse(404, null, 'User not found'));

    res.status(200).json(new ApiResponse(200, user, 'Current user details retrieved successfully'));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

export { 
  registerUser, 
  loginUser, 
  getUserDetails, 
  getCurrentUser,
  updateUserDetails, 
  deleteUser, 
  getAllUsers 
};
