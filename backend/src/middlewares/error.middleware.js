import logger from '../utils/logger.js';
import ApiError from '../utils/apiError.js';

const errorMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // If custom ApiError
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Mongoose invalid ObjectId
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    // Duplicate key error
    else if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Validation error
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(val => val.message)
            .join(', ');
    }

    logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorMiddleware;
