import Herbalist from '../models/herbalistModal.js';
import jwt from 'jsonwebtoken'; // To generate the JWT token

// Herbalist Login
export const herbalistLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find herbalist by email
    const herbalist = await Herbalist.findOne({ email });
    
    if (!herbalist) {
      return res.status(404).json({ message: 'Herbalist not found' });
    }

    // Check if the password matches
    const isMatch = await herbalist.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { herbalistId: herbalist._id, email: herbalist.email },
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '1d' } // Token expiry time
    );

    // Respond with token
    res.status(200).json({ message: 'Login successful', token ,id:herbalist._id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Create a new herbalist
export const createHerbalist = async (req, res) => {
  try {
    const herbalist = new Herbalist(req.body);
    const savedHerbalist = await herbalist.save();
    res.status(201).json(savedHerbalist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all herbalists
export const getAllHerbalists = async (req, res) => {
  try {
    const herbalists = await Herbalist.find();
    res.status(200).json(herbalists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific herbalist by ID
export const getHerbalistById = async (req, res) => {
  try {
    const herbalist = await Herbalist.findById(req.params.herbalistId);
    if (!herbalist) return res.status(404).json({ error: 'Herbalist not found' });
    res.status(200).json(herbalist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a herbalist
export const updateHerbalist = async (req, res) => {
  try {
    const herbalist = await Herbalist.findByIdAndUpdate(req.params.herbalistId, req.body, { new: true });
    if (!herbalist) return res.status(404).json({ error: 'Herbalist not found' });
    res.status(200).json(herbalist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a herbalist
export const deleteHerbalist = async (req, res) => {
  try {
    const herbalist = await Herbalist.findByIdAndDelete(req.params.herbalistId);
    if (!herbalist) return res.status(404).json({ error: 'Herbalist not found' });
    res.status(200).json({ message: 'Herbalist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
