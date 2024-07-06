const { getDB } = require("../../Configs/mongoConnection");

const handleJoinGame = async (gameId, player) =>{
    try{
        const db = await getDB();   
        const existingGame = await db.collection('games').findOne({gameId : gameId})
        
        // there must be a game with this gameId
        if(!existingGame){
            return{
                status : false,
                reason : "That game doesn't exists!"
            };
        }
        
        // the game must not be full
        if(existingGame.player1 != null && existingGame.player2 != null){
            return {
                status : false,
                reason : "Room is full"
            };
        }
        
        // this player != player1
        if(existingGame.player1 == player){
            return{
                status : false,
                reason : "Player already joined!"
            };
        }
        

        await db.collection('games').updateOne(
            {gameId : gameId},
            {$set : {player2 : player}}
        )
        return {
            status : true
        };
    }
    catch(err){
        return new Error(err.message);
    }
}

module.exports = {handleJoinGame};