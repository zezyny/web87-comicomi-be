const errorHandler = (err, req, res, next) => {
    console.error(err);
    // Specific Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(400).json({ message: 'Validation Error', errors });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Authentication Failed', error: err.message });
    }

    // Generic sv error
    res.status(500).json({ message: 'Server Error', error: err.message || 'Something went wrong' });
};

export default errorHandler;