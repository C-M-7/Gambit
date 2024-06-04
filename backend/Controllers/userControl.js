const { getDB } = require("../Configs/mongoConnection");

const handleUserInfo = async(req, res) =>{
    try{
        const db = await getDB();
        const {token} = req.body();
        
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

module.exports = {
    handleUserInfo
}