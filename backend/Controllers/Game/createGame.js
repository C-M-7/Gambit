const { getDB } = require("../../Configs/mongoConnection");

const handleCreateGame = async (gameId, player) =>{
    try{
        const db = await getDB();   
        await db.collection('games').insertOne({
            gameId : gameId,
            player1 : player,
            createdAt : new Date().toLocaleString()
        })
    }
    catch(err){
        return new Error(err.message);
    }
}

module.exports = {handleCreateGame};