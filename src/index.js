// Import necessary modules and configurations
import express from 'express'; // Express framework for creating server
import dotenv from 'dotenv'; // Library for loading environment variables from .env file
import connectDB from './config/db.js'; // Custom function to connect to MongoDB
import userRoutes from './routes/userRoutes.js'; // Import user routes for handling user-related API requests
import productRoutes from './routes/productRoutes.js';// Import product routes for handling product-related API requests
import orderRoutes from './routes/orderRoutes.js'; 
import cors from 'cors'; // CORS middleware to allow cross-origin requests (for frontend/backend communication)

// Load environment variables from a .env file into process.env
// (e.g., variables like PORT, DB connection string)
dotenv.config();

// Connect to MongoDB database by calling the connectDB function
// This function likely contains the code for connecting to the MongoDB database
connectDB();

// Create an instance of the Express application
const app = express();

// Middleware setup:
// Enable CORS to allow the server to handle requests from different origins (e.g., frontend on a different port)
app.use(cors());

// Middleware to parse incoming JSON request bodies into JavaScript objects
// This is essential for APIs that accept JSON data (e.g., login, registration requests)
app.use(express.json());

// Route setup:
// Set up routes for user-related requests, like registration, login, etc.
// Routes will be prefixed with '/api/users', so for example, '/api/users/register' could be a route in userRoutes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware for undefined routes
// If a request is made to a route that is not defined, this will send a 404 response
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server:
// Define the port the server will listen on, either from environment variables or defaulting to 5000
const PORT = process.env.PORT || 5000;

// Start listening on the specified port and log a message to confirm the server is running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
