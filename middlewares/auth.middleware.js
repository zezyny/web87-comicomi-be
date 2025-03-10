import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET; 

    let accessToken = req.get("Authorization");

    if (!accessToken) {
        return res.status(401).json({
            message: "The request was unauthenticated"
        });
    }

    accessToken = accessToken.replace('Bearer ', ''); // Correctly remove "Bearer " prefix

    try {
        jwt.verify(accessToken, accessTokenSecret); // Verify with accessTokenSecret
        const result = jwt.decode(accessToken);
        req.currentUserId = result.userId;
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
        req.user = decoded;
        next();
    });
};