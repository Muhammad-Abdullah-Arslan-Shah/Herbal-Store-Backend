// src/utils/errorHandler.js
exports.handleError = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ success: false, error: message });
  };
  