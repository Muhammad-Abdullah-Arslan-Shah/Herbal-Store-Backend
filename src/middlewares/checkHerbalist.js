
import jwt from 'jsonwebtoken';

export const checkHerbalist = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach herbalist info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};


export default checkHerbalist;
