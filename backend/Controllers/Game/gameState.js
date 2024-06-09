const Game = require("../../Classes/Game");
const { getDB } = require("../../Configs/mongoConnection");
const { handleEndGame } = require("./endGame");
const {Chess} = require('chess.js')
  
const handleGameState = async (gameId, player, fen, game, lastmove) =>{
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId});

        // if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF", update: null}; // game not found
        if(fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'){
            return {status : false, reason : "GC",  update: 'w'};
        }
        else if(game.moves.length % 2 === 0 && player === currGame.player1){
            const result = game.makeMove(fen, lastmove);
            console.log(result.status);
            
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV", update: 'w'};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game, result.status);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS", update : 'b'};
                } 
            }
        }
        else if(game.moves %2 !== 0 && player === currGame.player2){
            const result = game.makeMove(fen, lastmove);
            console.log(result.status);
            
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV", update : 'b'};
            }
            else{
                if(result.status === 'Checkmate' || result.status==='Draw' || result.status === 'Stalemate' || result.status === 'Threefold repetition' || result.status === 'Insufficient material'){
                    return handleEndGame(gameId, player, game, result.status);
                }
                else{
                    await db.collection('games').findOneAndUpdate({gameId : gameId},{$set:{gameState : String(result.fen)}});
                    // state updated successfully
                    return {status : true, reason : "SUS", update : 'w'};
                } 
            }
        }
        else{
            // wait for turn
            return {status : false, reason : "WFT", update : `${player===currGame.player2} : 'b' ? 'w'`};
        }
    }
    catch(err){
        console.log(err.message);
        console.log(err.stack);
        return new Error(err.message);
    }
}

module.exports = {handleGameState};