const jwt = require("jsonwebtoken");
require('dotenv').config();
let getUserMail;

const authenticateToken = (req, res, next) =>{
    // Getting auth headers
    const headers = req.headers.authorization;

    if(!headers || !headers.startsWith("Bearer ")){
        return res.status(401).json({ status:false, status_code: 401, message: "Unauthorized" });
    }
    const token = headers.split("Bearer ")[1];

    // Verifying auth token
    jwt.verify(
        token,
        String(process.env.jwt_secret_key),
        (err, user)=>{
            if(err) return res.status(403).json({status : false, status_code : 403, message : "Invalid Token"});
            getUserMail = user.email;
            next();
        }
    );
}

const getUserEmail = () => {return getUserMail}

module.exports={
    getUserEmail,
    authenticateToken,
}