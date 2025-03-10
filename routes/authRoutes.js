import express from 'express';
import { registerUser, loginUser, refreshToken, validateUser} from '../controllers/auth.controller.js';
import { registerValidationRules, loginValidationRules, refreshTokenValidationRules, validate } from '../middlewares/inputValidator.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import {verifyToken} from '../middlewares/auth.middleware.js'

const router = express.Router();

// Register Route
router.post('/register', authRateLimiter, registerValidationRules(), validate, registerUser);

// Login Route
router.post('/login', authRateLimiter, loginValidationRules(), validate, loginUser);

// Refresh Token Route
router.post('/refresh-token', refreshTokenValidationRules(), validate, refreshToken);

//FOR TEST AND DEVELOPMENT ONLY.
router.post('/dev/validate-user', verifyToken, validateUser); 

export default router;