const { getDB } = require("../../Configs/mongoConnection");

const handleEndGame = async(gameId, player, result, game)=>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        
        if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "Game Not Found", update : null}; // game not found

        const moves = game.chess.history().join(',');
        if(result === 'CHECKMATE'){
            if(player === currGame.player2) game.result = currGame.player2;
            else game.result = currGame.player1;
        }
        else{
            game.result = result;
        }

        const stored = await db.collection('games').findOneAndUpdate({gameId : gameId}, {$set:{moves : String(moves), gameState:String(game.chess.fen()), result : String(game.result)}});

        if(stored) delete game;
        
        return{
            status : true,
            reason : game.chess.turn(),
            update : result 
        }
    }
    catch(err){
        return{
            status : false,
            reason : err.message,
        }
    }
}

module.exports = {handleEndGame}