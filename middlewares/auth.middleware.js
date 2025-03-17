import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';

export const authentication = (req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', '');   

    try {
        jwt.verify(accessToken, accessTokenSecret); 
        const result = jwt.decode(accessToken);
        req.currentUserId = result.userId;
        next();
    } catch (exception) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }
};
export const permissionAuth = async (req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', '');   

    try {
        jwt.verify(accessToken, accessTokenSecret); 
        const result = jwt.decode(accessToken);
        console.log("JWT DECODE:", result)
        req.currentUserId = result.userId;
        const user = await userRepository.getUserById(result.userId)
        console.log("[Sensitive action] Verifying for:", user.userName, "\nID:", user._id);
        if (user.role.toLowerCase() == "admin" || user.role.toLowerCase() == "creator") {
            console.log(`Authentication: Authoirzed for ${user.userName} role: ${user.role} to do some sensitive action.`);
            req.user = user;
            next();

        } else {
            console.log(`Authentication Error: Permission error on request for ${user.userName} role: ${user.role} to do some sensitive action.`);

            return res.status(401).json({
                message: "The request was unauthenticated"
            });
        }
    } catch (exception) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }
};
export const allowAdmin = async (req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', '');   

    try {
        jwt.verify(accessToken, accessTokenSecret); 
        const result = jwt.decode(accessToken);
        req.currentUserId = result.userId;
        const user = await userRepository.getUserById(result.userId)
        console.log("[Sensitive action] Verifying for:", user.userName, "\nID:", user._id);
        if (user.role.toLowerCase() == "admin") {
            console.log(`Authentication: Authoirzed for ${user.userName} role: ${user.role} to do some sensitive action.`);
            req.user = user;
        } else {
            console.log(`Authentication Error: Permission error on request for ${user.userName} role: ${user.role} to do some sensitive action.`);

            return res.status(401).json({
                message: "The request was unauthenticated"
            });
        }
        next();
    } catch (exception) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }
}
export const allowCreator = async (req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', '');   

    try {
        jwt.verify(accessToken, accessTokenSecret); 
        const result = jwt.decode(accessToken);
        req.currentUserId = result.userId;
        const user = await userRepository.getUserById(result.userId)
        console.log("[Sensitive action] Verifying for:", user.userName, "\nID:", user._id);
        if (user.role.toLowerCase() == "creator") {
            console.log(`Authentication: Authoirzed for ${user.userName} role: ${user.role} to do some sensitive action.`);
            req.user = user;
        } else {
            console.log(`Authentication Error: Permission error on request for ${user.userName} role: ${user.role} to do some sensitive action.`);

            return res.status(401).json({
                message: "The request was unauthenticated"
            });
        }
        next();
    } catch (exception) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET
    // console.log("Authorization Header:", authHeader);
    if (token == null) {
        return res.status(401).json({ message: 'No token provided' }); // No token
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' }); // Token is not valid (expired, tampered)
        }
        console.log(decoded)
        req.user = decoded;
        next();
    });
};