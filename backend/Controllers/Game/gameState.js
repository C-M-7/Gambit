const Game = require("../../Classes/Game");
// const GameManager = require("../../Classes/GameManager");
const { getDB } = require("../../Configs/mongoConnection");

// const gm = new GameManager();  
const handleGameState = async (gameId, player, move, turn) =>{
    const game = new Game();
    // console.log(game);
    try{
        const db = await getDB();
        const currGame = await db.collection('games').findOne({gameId : gameId})
        if(!currGame || !currGame.player1 || !currGame.player2) return {status : false, reason : "GNF"}; // game not found
        
        if(turn === currGame.player1){
            const result = game.makeMove(move);
            turn = currGame.player2;
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV"};
            }
            else{
                // const moves = game.moves.join(',');
                await db.collection('games').updateOne({gameState : result.fen});
                return {status : true, reason : "SUS"}; 
                // state updated successfully
            }
        }
        else if(turn === currGame.player2){
            const result = game.makeMove(move);
            turn = currGame.player2;
            if(!result.valid){
                // move not valid
                return {status : false, reason : "MNV"};
            }
            else{
                // const moves = game.moves.join(',');
                await db.collection('games').updateOne({gameState : result.fen});
                return {status : true, reason : "SUS"}; 
                // state updated successfully
            }
        }
        else{
            // wait for turn
            return {status : false, reason : "WFT"};
        }
    }
    catch(err){
        return new Error(err.message);
    }
}

module.exports = {handleGameState};