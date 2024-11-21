// models/Herbalist.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Required for hashing passwords

const herbalistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  image: {
    type: String,
    required: true, 
  },
  specialty: {
    type: String,
    required: true,
  },
  experienceYears: {
    type: Number,
    default: 0,
  },
  availability: {
    type: [String], // Example: ["Monday 9-5", "Wednesday 10-4"]
    default: [],
  },
  contactNumber: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Herbalist"],
      default: "Herbalist"
  },
  Fee: {
    type: Number,
  },
});

// Hash password before saving
herbalistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
herbalistSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Herbalist = mongoose.model('Herbalist', herbalistSchema);

export default Herbalist;
