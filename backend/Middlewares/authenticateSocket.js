const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateSocket = (socket, next) =>{
    
    const token = socket.handshake.auth.token;
    jwt.verify(
        token,
        String(process.env.jwt_secret_key),
        (err, user)=>{
            if(err) return next(new Error('Authentication error'));
            socket.handshake.headers.email = user.email;
            next();
        }
    )
}


module.exports = {
    authenticateSocket,
}