// src/utils/errorHandler.js
const handleError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ success: false, error: message });
  };
  export default handleError;