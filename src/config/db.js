import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Ensure MONGO_URI is correctly configured in .env
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); // Optional: exit the app if connection fails
  }
};

export default connectDB

