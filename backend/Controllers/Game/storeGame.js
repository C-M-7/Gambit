const { getDB } = require("../../Configs/mongoConnection");

const storeGame = async(gameId, fen) => {
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})

        if(!currGame /*|| !currGame.player1 || !currGame.player2*/) return {status : false, reason : "GNF"}; // game not found

        const stored = await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(fen)}});

        return{
            status : true
        }
    }
    catch(err){
        return{
            status : false,
            reason : err.message,
        }
    }
}

module.exports = {storeGame};