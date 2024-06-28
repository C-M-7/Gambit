const { getDB } = require("../Configs/mongoConnection");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const handleUserInfo = async(req, res) =>{
    try{
        const db = await getDB();
        const {token} = req.body;

        jwt.verify(
            token,
            String(process.env.jwt_secret_key),
            (err)=>{
                if(err) return res.status(403).json({status : false, status_code : 403, message : "Invalid Token"});
            }
        );
        
        const user = await db.collection("users").findOne({loginToken : token});

        if(!user){
            return res.status(400).json({
                status: false,
                status_code: 400,
                error: "User doesn't exist",
            })
        }

        return res.status(200).json({
            status : true,
            status_code : 200,
            user : {
                username : user.username,
                name : user.name,
                email : user.email,
            }
        })
    }
    catch(err){
        return res
        .status(400)
        .json({ status: false, status_code: 400, error: err.message });
    }
}

const handleUserLogs = async(req, res) =>{
    try{
        const db = await getDB();
        const {email} = req.body;

        const user = await db.collection("users").findOne({email : email});

        if(!user){
            return res.status(400).json({
                status : false, 
                status_code : 400,
                error : "User doesn't exist",
            })
        }

        const logs = await db.collection("games").findOne({
            
        });

    }
    catch(err){
        return res
        .status(400)
        .json({status : false, status_code : 400, error : err.message});
    }
}

module.exports = {
    handleUserInfo,
    handleUserLogs
}