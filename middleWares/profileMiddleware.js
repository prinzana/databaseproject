const jwt = require('jsonwebtoken');

const profileMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Received Token:', token); // Log the token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err.message); // Log error details
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = profileMiddleware;
