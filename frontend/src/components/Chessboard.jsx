import React, { useContext, useEffect, useState } from "react";
import SocketContext from '../redux/SocketContext';
import moveSound from '../utils/Sounds/gambit-capture.mp3'
import Cookies from 'js-cookie';
// import wrongMoveSound from '../../utils/Sounds/gambit-wrong-move.mp3'
import { Chess } from "chess.js";
import Bbishop from '../utils/Pieces/bishop-b.svg'
import Wbishop from '../utils/Pieces/bishop-w.svg'
import Bking from '../utils/Pieces/king-b.svg'
import Wking from '../utils/Pieces/king-w.svg'
import Bknight from '../utils/Pieces/knight-b.svg'
import Wknight from '../utils/Pieces/knight-w.svg'
import Wpawn from '../utils/Pieces/pawn-w.svg'
import Bpawn from '../utils/Pieces/pawn-b.svg'
import Bqueen from '../utils/Pieces/queen-b.svg'
import Wqueen from '../utils/Pieces/queen-w.svg'
import Wrook from '../utils/Pieces/rook-w.svg'
import Brook from '../utils/Pieces/rook-b.svg'

function Chessboard({color}) {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [selectedSq, setSelectedSq] = useState(null);
  const {socketContext} = useContext(SocketContext); 

  
  useEffect(()=>{
    const token = Cookies.get('token');
    if(token){
      
    }
    else{
      toast.error('Token not found! Please SigIn again!')
      navigate('/signin');
    }
  },[])
  
  const pieceUnicode = {
    p: <img src={Bpawn}/>,
    r: <img src={Brook}/>,
    n: <img src={Bknight}/>,
    b: <img src={Bbishop}/>,
    q: <img src={Bqueen}/>,
    k: <img src={Bking}/>,
    P: <img src={Wpawn}/>,
    R: <img src={Wrook}/>,
    N: <img src={Wknight}/>,
    B: <img src={Wbishop}/>,
    Q: <img src={Wqueen}/>,
    K: <img src={Wking}/>,
  };

  const handleSqClick = (row, col) => {
    const square = color === 'w' ? String.fromCharCode(97 + col) + (8 - row) : String.fromCharCode(104 - col) + (row + 1);
    if (selectedSq) {
      try {
        const move = game.move({
          from: selectedSq,
          to: square,
          promotion: "q",
        });
        if (move) {
          setPosition(game.fen());
          new Audio(moveSound).play();
          setSelectedSq(null);
        }
      } catch (err) {
        // new Audio(wrongMoveSound).play();
        setSelectedSq(null);
      }
    } else {
      setSelectedSq(square);
    }
  };

  const createSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const sqColor = isBlack ? "bg-gray-600" : "bg-gray-300";
    const square = color === 'w' ? String.fromCharCode(97 + col) + (8 - row) : String.fromCharCode(104 - col) + (row + 1);
    const piece = game.get(square);
    // const isSelected = square === selectedSq;

    return (
      <div
        key={square}
        className={`w-20 h-20 flex items-center justify-center ${sqColor} cursor-pointer`}
        onClick={() => handleSqClick(row, col)}
      >
        {piece && (
          <span className="">
            {
              pieceUnicode[
                piece.color === "w" ? piece.type.toUpperCase() : piece.type
              ]
            }
          </span>
        )}
      </div>
    );
  };

  const createBoard = () => {
    const board = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        board.push(createSquare(row, col));
      }
    }
    return board;
  };

  return <div className="grid grid-cols-8 shadow-lg">{createBoard()}</div>;
}

export default Chessboard;
