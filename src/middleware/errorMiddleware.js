// src/middleware/errorMiddleware.js
const { ErrorHandler } = require('../utils/errorHandler');

const notFound = (req, res, next) => {
    const error = new ErrorHandler(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Use the custom error handler if available; otherwise, default to 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
