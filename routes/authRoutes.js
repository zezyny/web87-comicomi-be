import express from 'express';
import { registerUser, loginUser, refreshToken, validateUser} from '../controllers/auth.controller.js';
import { registerValidationRules, loginValidationRules, refreshTokenValidationRules, validate } from '../middlewares/inputValidator.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import {verifyToken, permissionAuth, allowAdmin, allowCreator} from '../middlewares/auth.middleware.js'
import { checkAccessToEditChapter } from '../middlewares/access.middleware.js';
import { PermissionOk } from '../controllers/auth.controller.js';

const router = express.Router();

// Register Route
router.post('/register', authRateLimiter, registerValidationRules(), validate, registerUser);

// Login Route
router.post('/login', authRateLimiter, loginValidationRules(), validate, loginUser);

// Refresh Token Route
router.post('/refresh-token', refreshTokenValidationRules(), validate, refreshToken);

//FOR TEST AND DEVELOPMENT ONLY.
router.post('/dev/validate-user', verifyToken, validateUser); 

router.get('/admin', allowAdmin, validateUser)

router.get('/creator', allowCreator, validateUser)

router.get('/adminorcreator', permissionAuth, validateUser)

router.get('/editor/haveaccess/:chapterId', checkAccessToEditChapter, PermissionOk)


export default router;