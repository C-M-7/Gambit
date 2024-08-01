import React, { useEffect, useState } from 'react';
import Chessboard from '../components/Chessboard';
import { useSelector } from 'react-redux';
import ChessboardMoves from '../components/ChessboardMoves';

function Playground() {
  const [loading, setLoading] = useState(true);
  const game = JSON.parse(sessionStorage.getItem('gameId'));
  const gameId = game.gameId;
  const color = game.color;
  const userData = useSelector((state) => state.UserDetails);

  useEffect(()=>{
    if(userData){
      setLoading(false);
    }
  },[userData])
  
  if(loading){
    return(<div>isLoading...</div>)
  }

  return (
    <div>
        <div className='flex justify-between px-20 py-5'>
          <div className='font-bold text-lg'>GameId : {gameId}</div>
          <div className='font-bold text-lg'>Color : {color === 'w' ? 'White' : 'Black'}</div>
        </div>
        <div className='flex justify-center space-x-10'>
          <Chessboard color={color} email={userData.email}/>
          <ChessboardMoves/>
        </div>
    </div>

  )
}

export default Playground