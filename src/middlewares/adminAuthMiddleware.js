// middlewares/adminAuth.js

// Middleware to check if the user is an admin
const adminAuth = (req, res, next) => {
  console.log(req.user);
    // Assuming `req.user` contains the logged-in user's info, including role
    if (req.user && req.user.role === "Admin") {
      next(); // Proceed if the user is an admin
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
  };
  
  export default adminAuth;
  