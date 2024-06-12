import {Chess} from 'chess.js';
import { validateFen } from 'chess.js';

export function RuleBook(fen) {
  try{
    const game = validateFen(fen);
    const chess = new Chess(fen);
    if(!game.ok){
      return {valid : false, status : 'Invalid Move'};
    }
    else{
      let status = 'MOVE';
      if(chess.isCheckmate()){
        status = 'CHECKMATE';
      }else if(chess.inCheck()){
        status = 'CHECK';
      }else if(chess.isDraw()){
        status = 'DRAW';
      }else if(chess.isStalemate()){
        status = 'STALEMATE';
      }else if(chess.isThreefoldRepetition()){
        status = 'TFR';
      }else if(chess.isInsufficientMaterial()){
        status = 'ISM';
      }
      return{
        valid : true,
        status : status,
      }
    }
  }
  catch(err){
    return {valid : false, status : err.message};
  }
}