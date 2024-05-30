import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import { io } from "socket.io-client";
import Cookies from 'js-cookie';

function App() {
  const [sockett, setSocket] = useState({});
  const navigate = useNavigate();
  const [gameId, setGameId] = useState('');

  useEffect(()=>{
    const token = Cookies.get('token');
    console.log(token);
    if(token){  
      const socket = io('http://localhost:7000',{
        auth: {
          token: token,
        }
      })
      setSocket(socket);

      socket.on('connect', () => {
        console.log(socket);
        console.log('Connected to socket server');
      });

      socket.on('disconnect',()=>{
        Cookies.remove("token");
        socket.disconnect();
        console.log("user disconnected from server")
      });
    }
    else {
      toast.warning('Please SignIn before accessing Gambit!');
      navigate('/signin');
    }
  },[])

  const handleClientCreateGame = () =>{
    sockett.emit('create_game');
    sockett.on('gameId', (dataGameId)=>{
      setGameId(dataGameId);
    })
    // if(gameId !== ''){
      navigate('/playground',{
        state:{
          gameId : gameId,
        }
      })
    // }
  }

  return (
    <>
      <div className="flex justify-center space-x-56 mt-40">
          <button className="border border-black p-2" onClick={handleClientCreateGame}>Create Game</button>
          <button className="border border-black p-2">Join Game</button>
      </div>
      <div>{gameId}</div>
    </>
  )
}

export default App
