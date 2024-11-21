import Order from "../models/orderModel.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse class
import handleError from "../utils/errorHandler.js"; // Assuming you have an error handler utility

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json(new ApiResponse(400, null, "No order items found"));
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(new ApiResponse(201, createdOrder));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    res.status(200).json(new ApiResponse(200, order));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get orders for the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json(new ApiResponse(200, orders));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(new ApiResponse(200, orders));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Update order to paid
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse(200, updatedOrder));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Update order to delivered (Admin only)
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(new ApiResponse(200, updatedOrder));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};
