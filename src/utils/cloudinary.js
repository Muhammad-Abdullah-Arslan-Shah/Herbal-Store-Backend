import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  

  try {
    if (!localFilePath) return null;

    // Check if the file exists before attempting upload
    if (!fs.existsSync(localFilePath)) {
      
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

   
    return response; // Return the response with the uploaded file URL

  } catch (error) {
    

    // Attempt to delete the local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
