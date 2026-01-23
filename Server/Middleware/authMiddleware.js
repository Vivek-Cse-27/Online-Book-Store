const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path matches your project structure

// Middleware to verify JWT Token
const auth = async (req, res, next) => {
    try {
        const tokenHeader = req.header('Authorization');
        
        if (!tokenHeader) {
            throw new Error('AUTHENTICATION_ERROR');
        }

        const token = tokenHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.userId = decoded.userId;
        
        next(); // Move to next middleware
    } catch (error) {
        // Pass error to the errorMiddleware
        error.type = 'AUTHENTICATION_ERROR';
        next(error); 
    }
};

// Middleware to check if user is Admin
const admin = async (req, res, next) => {
    try {
        // Find the user based on the ID from the previous 'auth' step
        const user = await User.findById(req.userId);

        // Check if the user exists and has the role 'admin'
        if (!user || user.role !== 'admin') {
            throw new Error('ACCESS_DENIED');
        }

        // If they are an admin, let them pass
        next();
    } catch (error) {
        // Pass error to the errorMiddleware
        if (error.message !== 'ACCESS_DENIED') {
            error.type = 'SERVER_ERROR'; // Distinguish system errors from access errors
        } else {
            error.type = 'ACCESS_DENIED';
        }
        next(error);
    }
};

module.exports = { auth, admin };