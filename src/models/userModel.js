// Import necessary modules
 // Mongoose is used for modeling MongoDB data
 import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Bcrypt is used to hash and compare passwords securely

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // 'name' field is a required string for storing the user's name
    name: { type: String, required: true },

    // 'email' field is a required string and must be unique
    // Ensures no two users can have the same email
    email: { type: String, required: true, unique: true },

    // 'password' field is required and will store the hashed password
    password: { type: String, required: true },

    // 'address' field is an optional string to store the user's address
    address: { type: String },

    // 'role' field defines the user's role in the system
    // Default is "Customer", and can be one of the following: "Customer", "Admin", or "Herbalist"
    role: {
      type: String,
      enum: ["Customer", "Admin", "Herbalist"],
      default: "Customer",
    
    },
  },
  { timestamps: true } // Mongoose will automatically add 'createdAt' and 'updatedAt' fields
);

// Middleware to hash the password before saving the user model
// This is a pre-save hook that runs before a user is saved to the database
userSchema.pre("save", async function (next) {
  // If the password hasn't been modified, skip hashing
  if (!this.isModified("password")) return next();

  // Hash the password using bcrypt with a salt rounds of 10
  // bcrypt.hash takes the plain password and returns a hashed version
  this.password = await bcrypt.hash(this.password, 10);

  // Proceed to save the user after password hashing
  next();
});

// Method to compare entered password with the stored hashed password
// This is used during login to check if the entered password matches the stored one
userSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare compares the entered password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model, making it available to other parts of the application
export default mongoose.model("User", userSchema);
 