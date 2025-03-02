import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

const accessTokenSecret = process.env.JWT_ACCESS_SECRET; // Secure your secrets!
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
console.log(accessTokenSecret)
console.log(refreshTokenSecret)
// Function to generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, accessTokenSecret, {
        expiresIn: '15m' // Short expiration for access tokens
    });
};

// Function to generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, refreshTokenSecret, {
        expiresIn: '7d' // Longer expiration for refresh tokens
    });
};

// Function to verify Refresh Token (for refresh token route)
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, refreshTokenSecret);
};