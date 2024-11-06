// src/utils/errorHandler.js

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture the stack trace (helpful for debugging)
        Error.captureStackTrace(this, this.constructor);
    }
}

// Utility function to create new errors easily
const createError = (message, statusCode = 500) => {
    return new ErrorHandler(message, statusCode);
};

module.exports = {
    ErrorHandler,
    createError,
};
