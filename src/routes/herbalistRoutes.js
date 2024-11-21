import express from 'express';
import { upload } from "../middlewares/multer.middleware.js"; // Import multer middleware
import {
  createHerbalist,
  getAllHerbalists,
  getHerbalistById,
  updateHerbalist,
  deleteHerbalist,
  herbalistLogin
} from '../controllers/herbalistController.js';
import adminAuth from '../middlewares/adminAuthMiddleware.js'; // Import adminAuth middleware
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();
// Herbalist Login
router.post('/login', herbalistLogin);

// Admin Route: Create a new herbalist
router.post('/Add',userAuth, adminAuth,upload, createHerbalist);

// Admin Route: Get all herbalists
router.get('/',userAuth, adminAuth, getAllHerbalists);

// Admin Route: Get a specific herbalist by ID
router.get('/:herbalistId',userAuth, adminAuth, getHerbalistById);

// Admin Route: Update a herbalist
router.put('/:herbalistId',userAuth, adminAuth, updateHerbalist);

// Admin Route: Delete a herbalist
router.delete('/:herbalistId',userAuth, adminAuth, deleteHerbalist);

export default router;
