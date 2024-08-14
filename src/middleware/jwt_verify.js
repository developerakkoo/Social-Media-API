const jwt = require('jsonwebtoken');
require('dotenv').config();

const verify_token = (req,res, next) => {
    try {
        const accessToken = req.headers['x-access-token'];
        if (!accessToken) {
            return res.status(403).send({message: "No token provided!"});
        }
        jwt.verify(accessToken,process.env.SECRET_KEY,
            (error, decoded) => {
                if (error) {
                    return res.status(401).send({message: "Unauthorized!"});
                }
                req.userId = decoded.userId
                next()
            });
    } catch (error) {
        res.status(500).json({Message:error.message,status:'ERROR',statusCode:500});
    }
}


module.exports = { verify_token };