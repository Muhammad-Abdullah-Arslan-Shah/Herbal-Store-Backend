import Product from "../models/productModel.js"; // Import Product model
import handleError from "../utils/errorHandler.js"; // Import error handling utility

// Create a new product
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, quantity, stockCount } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category || !image || !quantity || !stockCount) {
      return handleError(res, "All fields are required", 400);
    }

    // Create a new product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image,
      quantity,
      stockCount,
    });

    // Send success response
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle errors during creation
    handleError(res, error.message, 500);
  }
};

// Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Send the list of products
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    // Handle errors during retrieval
    handleError(res, error.message, 500);
  }
};

// Retrieve a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);

    // If product is not found
    if (!product) {
      return handleError(res, "Product not found", 404);
    }

    // Send product details
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle errors during retrieval by ID
    handleError(res, error.message, 500);
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update the product by ID
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    // If product is not found
    if (!product) {
      return handleError(res, "Product not found", 404);
    }

    // Send updated product details
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    // Handle errors during update
    handleError(res, error.message, 500);
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const product = await Product.findByIdAndDelete(id);

    // If product is not found
    if (!product) {
      return handleError(res, "Product not found", 404);
    }

    // Send success response for deletion
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    // Handle errors during deletion
    handleError(res, error.message, 500);
  }
};

// Export all CRUD operation handlers
export  { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
