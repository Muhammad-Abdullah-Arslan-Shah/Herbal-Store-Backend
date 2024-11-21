import Product from "../models/productModel.js"; // Import Product model
import handleError from "../utils/errorHandler.js"; // Import error handling utility
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import Cloudinary utility
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse class

// Create a new product
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity, stockCount } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category || !quantity || !stockCount) {
      return res.status(400).json(new ApiResponse(400, null, "All fields except image are required"));
    }

    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        imageUrl = cloudinaryResponse.url; // Save the Cloudinary URL
      }
    }

    // Create a new product
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: imageUrl,
      quantity,
      stockCount,
    });

    // Send success response
    res.status(201).json(new ApiResponse(201, product));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Retrieve all products
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Send the list of products
    res.status(200).json(new ApiResponse(200, products));
  } catch (error) {
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
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    // Send product details
    res.status(200).json(new ApiResponse(200, product));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If a new image is uploaded, upload it to Cloudinary
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        updates.image = cloudinaryResponse.url; // Update the image URL
      }
    }

    // Find and update the product by ID
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    // Send updated product details
    res.status(200).json(new ApiResponse(200, product,"Product updated successfully"));
  } catch (error) {
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
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    // Send success response for deletion
    res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    handleError(res, error.message, 500);
  }
};

// Export all CRUD operation handlers
export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
