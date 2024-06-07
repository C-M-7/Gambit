const Game = require("../../Classes/Game");
const { getDB } = require("../../Configs/mongoConnection");
const { handleEndGame } = require("./endGame");
const {Chess} = require('chess.js')
  
const handleGameState = async (gameId, player, fen, game) =>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})

        // if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF", update: null}; // game not found
        if(fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){
            return {status : false, reason : "GC",  update: 'W'};
        }
        else if(game.moves.length % 2 === 0 && player === currGame.player1){
            const result = game.makeMove(fen);
            console.log(result.status);
            
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV", update: 'W'};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game, result.status);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS", update : 'B'};
                } 
            }
        }
        else if(game.moves %2 !== 0 && player === currGame.player2){
            const result = game.makeMove(move);
            console.log(result.status);
            
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV", update : 'B'};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game, result.status);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS", update : 'W'};
                } 
            }
        }
        else{
            // wait for turn
            return {status : false, reason : "WFT", update : `${player===currGame.player2} : 'B' ? 'W'`};
        }
    }
    catch(err){
        console.log(err.message);
        console.log(err.stack);
        return new Error(err.message);
    }
}

module.exports = {handleGameState};