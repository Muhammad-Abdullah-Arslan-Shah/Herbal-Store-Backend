import Herbalist from '../models/herbalistModal.js';
import jwt from 'jsonwebtoken'; // To generate the JWT token
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Herbalist Login
export const herbalistLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const herbalist = await Herbalist.findOne({ email });
    if (!herbalist) {
      return res.status(404).json(new ApiResponse(404, null, 'Herbalist not found'));
    }

    const isMatch = await herbalist.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { herbalistId: herbalist._id, email: herbalist.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json(new ApiResponse(200, { token, id: herbalist._id }, 'Login successful'));
  } catch (err) {
    console.error(err);
    res.status(500).json(new ApiResponse(500, null, 'Server error'));
  }
};

// Create a new herbalist
export const createHerbalist = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      experienceYears,
      availability,
      contactNumber,
      Fee,
    } = req.body;

    if (!name || !email || !password || !specialty) {
      return res.status(400).json(new ApiResponse(400, null, 'Missing required fields'));
    }

    let imageUrl = null;
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        imageUrl = cloudinaryResponse.url;
      }
    }

    if (!imageUrl) {
      return res.status(400).json(new ApiResponse(400, null, 'Image upload failed'));
    }

    const herbalist = new Herbalist({
      name,
      email,
      password,
      image: imageUrl,
      specialty,
      experienceYears: experienceYears || 0,
      availability: availability || [],
      contactNumber,
      Fee,
    });

    const savedHerbalist = await herbalist.save();
    const { password: _, ...herbalistData } = savedHerbalist.toObject();

    res.status(201).json(new ApiResponse(201, herbalistData, 'Herbalist created successfully'));
  } catch (error) {
    console.error(error);
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

// Get all herbalists
export const getAllHerbalists = async (req, res) => {
  try {
    const herbalists = await Herbalist.find().select('-password');
    res.status(200).json(new ApiResponse(200, herbalists));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Get a specific herbalist by ID
export const getHerbalistById = async (req, res) => {
  try {
    const herbalist = await Herbalist.findById(req.params.herbalistId).select('-password');
    if (!herbalist) {
      return res.status(404).json(new ApiResponse(404, null, 'Herbalist not found'));
    }
    res.status(200).json(new ApiResponse(200, herbalist));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// Update herbalist
export const updateHerbalist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, specialty, experienceYears, availability, contactNumber, Fee } = req.body;

    const herbalist = await Herbalist.findById(id);
    if (!herbalist) {
      return res.status(404).json(new ApiResponse(404, null, 'Herbalist not found'));
    }

    if (name) herbalist.name = name;
    if (email) herbalist.email = email;
    if (specialty) herbalist.specialty = specialty;
    if (experienceYears !== undefined) herbalist.experienceYears = experienceYears;
    if (availability) herbalist.availability = availability;
    if (contactNumber) herbalist.contactNumber = contactNumber;
    if (Fee !== undefined) herbalist.Fee = Fee;
    if (password) herbalist.password = password;

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse) {
        herbalist.image = cloudinaryResponse.url;
      } else {
        return res.status(400).json(new ApiResponse(400, null, 'Image upload failed'));
      }
    }

    const updatedHerbalist = await herbalist.save();
    const { password: _, ...herbalistData } = updatedHerbalist.toObject();

    res.status(200).json(new ApiResponse(200, herbalistData, 'Herbalist updated successfully'));
  } catch (error) {
    console.error(error);
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

// Delete a herbalist
export const deleteHerbalist = async (req, res) => {
  try {
    const herbalist = await Herbalist.findByIdAndDelete(req.params.herbalistId);
    if (!herbalist) {
      return res.status(404).json(new ApiResponse(404, null, 'Herbalist not found'));
    }
    res.status(200).json(new ApiResponse(200, null, 'Herbalist deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
