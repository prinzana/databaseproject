const { check, validationResult } = require('express-validator');

// Validation rules for profile update
const validateProfileUpdate = [
    check('fullname').notEmpty().withMessage('Full name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('sex').notEmpty().withMessage('Sex is required'),
    // Add more checks as needed for other fields
];

// Middleware to handle validation errors
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateProfileUpdate,
    handleValidation
};
