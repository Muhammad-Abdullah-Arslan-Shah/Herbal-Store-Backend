import multer from 'multer';
import path from 'path';

// Set the storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './Public/temp'); // Specify where the file should be saved temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name to current timestamp with extension
  }
});

// Create the multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
}).single('image'); // 'image' is the field name for the uploaded image

export { upload };
