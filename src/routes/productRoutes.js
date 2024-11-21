import express from "express";
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import userAuth from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Import multer middleware

const router = express.Router();

// Public routes
router.get("/", getAllProducts); // Anyone can view all products
router.get("/:id", getProductById); // Anyone can view a product by ID

// Admin-only routes (add, update, delete)
router.post("/add", userAuth, adminAuth, upload, addProduct); // Add product with image upload
router.put("/:id", userAuth, adminAuth, upload, updateProduct); // Update product with image upload
router.delete("/:id", userAuth, adminAuth, deleteProduct); // Only admins can delete products

export default router;
