const jwt = require("jsonwebtoken");
require('dotenv').config();
let getUserMail;

const authenticateSocket = (socket, next) =>{
    const token = socket.handshake.auth.token;
    console.log(token);
    jwt.verify(
        token,
        String(process.env.jwt_secret_key),
        (err, user)=>{
            if(err) return next(new Error('Authentication error'));
            getUserMail = user.email;
            next();
        }
    )
}

const getSocketEmail = () => {return getUserMail}

module.exports = {
    authenticateSocket,
    getSocketEmail,
}