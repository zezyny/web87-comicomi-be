import User from '../models/user.model.js';
import { hashPassword, comparePasswords } from '../utils/password.utils.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';

// Register User
export const registerUser = async (req, res, next) => {
    try {
        const { userName, email, password, role } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' }); // 409 Conflict
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role: role || 'member' // Default to 'member' if role is not provided
        });

        const savedUser = await newUser.save();

        // Generate tokens imidiately after registration
        const accessToken = generateAccessToken(savedUser);
        const refreshToken = generateRefreshToken(savedUser);

        // Save refresh token to user document 
        savedUser.refreshToken = refreshToken;
        await savedUser.save();

        res.status(201).json({ // 201 Created
            message: 'User registered successfully',
            user: {
                _id: savedUser._id,
                userName: savedUser.userName,
                email: savedUser.email,
                role: savedUser.role,
                wallet: savedUser.wallet
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};

// Login User
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Update refresh token in database on login
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                wallet: user.wallet
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
};

// Refresh Token Route
export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken); // Verify refresh token

        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {  // Verify refresh token in DB
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new access token 
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        next(error); // Handle JWT verification
    }
};
//validate
export const validateUser = async (req, res, next) => {
    try {
        const { email } = req.body; // Get email from request body
        const decodedUserFromToken = req.user; // User info from token is attached by verifyToken middleware

        // if (!email) {
        //     return res.status(400).json({ message: 'Email is required in the request body' });
        // }

        if (!decodedUserFromToken || !decodedUserFromToken._id) {
            return res.status(401).json({ message: 'Invalid or missing user information in token' }); // Should not happen if middleware works correctly, but good to check
        }

        res.status(200).json({
            message: 'User is valid',
        });

    } catch (error) {
        next(error);
    }
};

export const PermissionOk = async(req, res) => {
    //cause middleware handled the checking process, here just return status 200.
    return res.status(200).json({message:"Access granted."})
}