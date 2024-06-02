import React from 'react';
import { useLocation } from 'react-router-dom';
import Chessboard from '../components/Chessboard';

function Playground() {
  const location = useLocation();
  const {gameId} = location.state || {};
  const {color} = location.color || {};
  const {socket} = location.socket || {};

  return (
    <>
        <div>{gameId ? gameId : 'Create a game'}</div>
        <div className='flex justify-center mt-10'>
          <Chessboard color={color} socket = {socket}/>
        </div>
    </>

  )
}

export default Playground