import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
 } from "../controllers/orderController.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js"; // Import adminAuth middleware
import userAuth from "../middlewares/authMiddleware.js"; // Middleware to ensure the user is authenticated

const router = express.Router();

// Route to create a new order (authenticated users only)
router.post("/", userAuth, createOrder);

// Route to get order by ID (authenticated users only)
router.get("/:id", userAuth, getOrderById);

// Route to get the logged-in user's orders (authenticated users only)
router.get("/user/orders", userAuth, getUserOrders);

// Route to get all orders (admin only)
router.get("/", userAuth, adminAuth, getAllOrders);

// Route to update order to paid  (admin only)
router.put("/:id/pay", userAuth,adminAuth, updateOrderToPaid);

// Route to update order to delivered (admin only)
router.put("/:id/deliver", userAuth, adminAuth, updateOrderToDelivered);

export default router;
