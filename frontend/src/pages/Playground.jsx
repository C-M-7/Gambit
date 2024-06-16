import React, { useContext, useEffect, useState } from 'react';
import SocketContext from '../redux/SocketContext';
import Chessboard from '../components/Chessboard';
import { useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
// import { useSelector } from 'react-redux';
// import axios from "axios";

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

  // const getUserInfo = async (token, gameId) => {
  //   try {
  //     const response = await axios.post("/gambit/userinfo", {
  //       token : token
  //     });
  //     if (response.data.status && gameId.username === response.data.user.username && gameId.name === response.data.user.name && gameId.email === response.data.user.email) {
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err.message)
  //   }finally {
  //     setLoading(false); 
  //   }
  // };

  // useEffect(() => {
  //   if(gameId){
  //     const token = Cookies.get("token");
  //     if (token) {
  //       getUserInfo(token, gameId);
  //     }else{
  //       toast.error('Token not found! Please SigIn again!')
  //       navigate('/signin');
  //     }
  //   }
  // }, [gameId]);



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