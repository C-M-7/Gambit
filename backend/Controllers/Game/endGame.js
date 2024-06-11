const { getDB } = require("../../Configs/mongoConnection");
const Game = require('../Classes/Game.js');
const GameManager = require('../Classes/GameManager.js');

const handleEndGame = async(req, res)=>{
    try{
        const {gameId, player, result} = req.body();
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        
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