const { getDB } = require("../../Configs/mongoConnection");

const handleJoinGame = async (gameId, player) =>{
    try{
        const db = await getDB();   
        const existingGame = await db.collection('games').findOne({gameId : gameId})
        
        // there must be a game with this gameId
        // the game must not be full
        // this player != player1
        if(!existingGame || existingGame.player1 === player || (existingGame.player1 != null && existingGame.player2 != null)){
            return false;
        }

        await db.collection('games').updateOne(
            {gameId : gameId},
            {$set : {player2 : player}}
        )
        return true;
    }
    catch(err){
        return new Error(err.message);
    }
}

module.exports = {handleJoinGame};