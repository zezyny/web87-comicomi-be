import { body, validationResult } from 'express-validator';

// Validation rules for registration
export const registerValidationRules = () => {
    return [
        body('userName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['member', 'creator']).withMessage('Invalid role'), // Optional role
    ];
};

// Validation rules for login
export const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ];
};

export const refreshTokenValidationRules = () => {
    return [
        body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    ];
};


export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};