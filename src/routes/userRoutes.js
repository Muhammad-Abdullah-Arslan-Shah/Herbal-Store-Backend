// src/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getAllUsers,
} from '../controllers/userController.js';

import adminAuth from "../middlewares/adminAuthMiddleware.js"; // Import adminAuth middleware
import userAuth from "../middlewares/authMiddleware.js"; // Middleware to ensure the user is authenticated

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to log in an existing user
router.post('/login', loginUser);

// Route to get details of a single user (protected route)
router.get('/:id', userAuth , getUserDetails);

// Route to update details of a user (protected route)
router.put('/:id', userAuth , updateUserDetails);

// Route to delete a user (admin only)
router.delete('/:id', userAuth , adminAuth, deleteUser);

// Route to get all users (admin only)
router.get('/', userAuth , adminAuth, getAllUsers);

export default router;
