class ApiError extends Error {
    constructor(message, statusCode) {
        super(message); // Call parent Error class

        this.statusCode = statusCode;
        this.success = false;

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
