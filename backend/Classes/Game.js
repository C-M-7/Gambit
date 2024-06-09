const {Chess} = require('chess.js');
const { validateFen } =  require('chess.js');

class Game{
    constructor(gameId){
        this.p1 = null;
        this.p2 = null;
        this.socket1 = null;
        this.socket2 = null;
        this.gameId = gameId;
        this.chess = new Chess();
        this.moves = [];
        this.gameState = this.chess.fen();
        this.result = "";    
    }

    makeMove(fen, lastmove){
        const result = validateFen(fen);
        if(!result.ok){
            return {valid : false, status : 'Invalid Move', pgn : this.chess.pgn()};
        }
        else{
            let gameStatus = 'Move made';
            this.moves.push(lastmove);
            this.chess.move(lastmove);
            this.gameState = fen;
            if (this.chess.isCheckmate()) {
                gameStatus = 'Checkmate';
            } else if (this.chess.isDraw()) {
                gameStatus = 'Draw';
            } else if (this.chess.isStalemate()) {
                gameStatus = 'Stalemate';
            } else if (this.chess.isThreefoldRepetition()) {
                gameStatus = 'Threefold repetition';
            } else if (this.chess.isInsufficientMaterial()){
                gameStatus = 'Insufficient material';
            } else if (this.chess.inCheck()) {
                gameStatus = 'Check';
            }
            return{
                valid : true, 
                status : gameStatus,
                pgn : this.chess.pgn(),
                fen : this.chess.fen()
            };
        }
    }

    getGameState() {
        return {
            pgn: this.chess.pgn(),
            fen: this.chess.fen(),
            turn: this.chess.turn(),
            inCheck: this.chess.inCheck(),
            inCheckmate: this.chess.isCheckmate(),
            inDraw: this.chess.isDraw(),
            inStalemate: this.chess.isStalemate(),
            inThreefoldRepetition: this.chess.isThreefoldRepetition(),
            insufficientMaterial: this.chess.isInsufficientMaterial()
        };
    }

    resetGame(){
        return this.chess.reset();
    }
}

module.exports = Game;