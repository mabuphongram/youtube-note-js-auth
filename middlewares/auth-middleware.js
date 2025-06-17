const jwt = require('jsonwebtoken')
require('dotenv').config()
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization']
    
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        }); 
    }

    // verify the token 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        
        req.userInfo = decoded;

        next();
    }catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
}

module.exports = authMiddleware;