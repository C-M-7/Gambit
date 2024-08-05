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
        
        <div className='flex justify-evenly space-x-10'>
          <div className='flex flex-col justify-between'>
            <div className='mt-10 border-2 p-2 rounded-md'>Timer1</div>
            <div className='mb-10 border-2 p-2 rounded-md'>Timer2</div>
          </div>
          <Chessboard color={color} email={userData.email}/>
          <ChessboardMoves/>
        </div>
    </div>

  )
}

export default Playground