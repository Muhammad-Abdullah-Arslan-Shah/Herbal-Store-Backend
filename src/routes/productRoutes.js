import express from "express";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js"; // Import adminAuth middleware
import userAuth from "../middlewares/authMiddleware.js"; // Middleware to ensure the user is authenticated

const router = express.Router();

// Public routes
router.get("/", getAllProducts); // Anyone can view all products
router.get("/:id", getProductById); // Anyone can view a product by ID

// Admin-only routes (add, update, delete)
router.post("/", userAuth, adminAuth, addProduct); // Only admins can add products
router.put("/:id", userAuth, adminAuth, updateProduct); // Only admins can update products
router.delete("/:id", userAuth, adminAuth, deleteProduct); // Only admins can delete products

export default router;
