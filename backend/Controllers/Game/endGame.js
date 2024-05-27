const { getDB } = require("../../Configs/mongoConnection");

const handleEndGame = async(gameId, player, game, result)=>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        
        console.log(currGame);
        
        if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF", update : null}; // game not found

        const moves = game.moves.join(',');
        if(result === 'Checkmate'){
            if(player === currGame.player2) game.result = currGame.player2;
            else game.result = currGame.player1;
        }
        else{
            game.result = result;
        }

        const stored = await db.collection('games').findOneAndUpdate({gameId : gameId}, {$set:{moves : String(moves), gameState:String(game.gameState), result : String(game.result)}});

        if(stored) delete game;
        
        return{
            status : true,
            reason : game.result,
            update : result 
        }
    }
    catch(err){
        console.log(err.message);
        console.log(err.stack);
        return new Error(err.message); 
    }
}

module.exports = {handleEndGame}