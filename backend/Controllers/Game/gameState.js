const Game = require("../../Classes/Game");
const { getDB } = require("../../Configs/mongoConnection");
const { handleEndGame } = require("./endGame");
  
const handleGameState = async (gameId, player, move, game) =>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        console.log(currGame);
        if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF"}; // game not found
        
        if(game.moves.length % 2 === 0 && player === currGame.player1){
            const result = game.makeMove(move);
            
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV"};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game, result.status);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS"};
                } 
            }
        }
        else if(game.moves %2 !== 0 && player === currGame.player2){
            const result = game.makeMove(move);
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV"};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS"};
                } 
            }
        }
        else{
            // wait for turn
            return {status : false, reason : "WFT"};
        }
    }
    catch(err){
        console.log(err.message);
        console.log(err.stack);
        return new Error(err.message);
    }
}

module.exports = {handleGameState};