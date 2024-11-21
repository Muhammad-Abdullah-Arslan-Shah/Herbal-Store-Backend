// userAuth middleware example
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    console.log("Current User:",req.user) // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

export default userAuth;
