import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../redux/SocketContext';
import Chessboard from '../components/Chessboard';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import axios from "axios";

function Playground() {
  const [loading, setLoading] = useState(true);
  const playerData = useSelector((state) => state.GameDetails);

  const getUserInfo = async (token, playerData) => {
    try {
      const response = await axios.post("/gambit/userinfo", {
        token : token
      });
      if (response.data.status && playerData.username === response.data.user.username && playerData.name === response.data.user.name && playerData.email === response.data.user.email) {
        setLoading(false);
      }
    } catch (err) {
      console.log(err.message)
    }finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if(playerData){
      const token = Cookies.get("token");
      if (token) {
        getUserInfo(token, playerData);
      }else{
        toast.error('Token not found! Please SigIn again!')
        navigate('/signin');
      }
    }
  }, [playerData]);


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