import React, { useEffect, useState } from 'react';
import Chessboard from '../components/Chessboard';
import { useSelector } from 'react-redux';

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
    <>
        <div>{gameId}</div>
        <div>{color}</div>
        <div className='flex justify-center mt-10'>
          <Chessboard color={color} email={userData.email}/>
        </div>
    </>

  )
}

export default Playground