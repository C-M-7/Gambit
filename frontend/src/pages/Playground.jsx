import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../redux/SocketContext';
import Chessboard from '../components/Chessboard';
import { useSelector } from 'react-redux';

function Playground() {
  const [loading, setLoading] = useState(true);
  const playerData = useSelector((state) => state.GameDetails);
  const {socketContext} = useContext(SocketContext); 

  useEffect(()=>{
    if(playerData){
      setLoading(false);
    }
  },[playerData])

  if(loading){
    return(<div>isLoading...</div>)
  }

  return (
    <>
        <div>{playerData && playerData.gameId ? playerData.gameId : 'Create a game'}</div>
        <div>{playerData && playerData.color ? playerData.color : 'color'}</div>
        <div className='flex justify-center mt-10'>
          <Chessboard color={playerData.color}/>
        </div>
    </>

  )
}

export default Playground