const jwt = require('jsonwebtoken');
require('dotenv').config(); // Import dotenv to access environment variables


const authMiddleware = (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract JWT token from Authorization header
    const token = authHeader.split(' ')[1];
    

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Attach user information to request object
        req.user = decoded;
        // console.log(req.user.userId);
        
        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
