import logger from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'

    
    // Mongoose invalid ObjectId
    if (err.name === 'CastError') {
        statusCode = 400
        message = 'Invalid ID format'
    }
    
    // Duplicate key error (unique fields)
    if (err.code === 11000) {
        statusCode = 400
        message = `Duplicate field value entered`
    }
    
    // Validation error
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors)
        .map(val => val.message)
        .join(', ')
    }
    
    logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

export default errorMiddleware
