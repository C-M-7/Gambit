const { getDB } = require("../../Configs/mongoConnection");

const handleResign = async(gameId, game, color) =>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        console.log(currGame);
        if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF"}; // game not found
    
        const moves = game.chess.history().join(',');
        if(color === 'w') game.result = currGame.player2;
        else game.result = currGame.player1;

        const stored = await db.collection('games').findOneAndUpdate({gameId : gameId}, {$set:{moves : String(moves), gameState:String(game.chess.fen()), result : String(game.result)}});

        if(stored) delete game;

        return{
            status : true,
            reason : game.result
        }
    }
    catch(err){
        return{
            status : false,
            reason : err.message,
        }
    }
}

module.exports = {handleResign};