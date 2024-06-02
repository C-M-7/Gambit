import React,{ useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import { io } from "socket.io-client";
import Cookies from 'js-cookie';

function Home() {
    console.log('home');
    const [socket, setSocket] = useState(null);
    const [joinId, setJoinId] = useState('');
    const [gameId, setGameId] = useState('');
    const navigate = useNavigate();
  
    useEffect(()=>{
      const token = Cookies.get('token');
      if(token){  
        const socketInstance = io('http://localhost:7000',{
          auth: {
            token: token,
          }
        })
        setSocket(socketInstance);
  
        socketInstance.on('connect', () => {
          console.log('Connected to socketInstance server');
        });
  
        socketInstance.on('disconnect',()=>{
          // Cookies.remove("token");
          socketInstance.disconnect();
          console.log("user disconnected from server")
        });
        
        return () =>{
          socketInstance.off('connect');
          socketInstance.off('disconnect');
        }
      }
      else {
        toast.warning('Please SignIn before accessing Gambit!');
        navigate('/signin');
      }
    },[navigate])
  
    // Create Game Logic
    const handleClientCreateGame = () =>{
      socket.emit('create_game');
    }
  
    useEffect(()=>{
      if(gameId !== ''){
        navigate('/playground',{
          state:{
            gameId : gameId,
            color : 'w',
            socket : socket,
          }
        })
      }
    },[gameId, navigate]);
  
    
    useEffect(()=>{
      if(socket){
        socket.on('gameId', (dataGameId)=>{
          setGameId(dataGameId);
        })
        return () =>{
          socket.off('gameId');
        }
      }
    },[socket])
  
  
    // Join Game Logic
    const handleJoinId = (event) =>{
      setJoinId(event.target.value);
    }
  
    const handleClientJoinGame = () =>{
      if(joinId){
        socket.emit('join_game', joinId);
      }
      else{
        setJoinId('');
        toast.error('Invalid Joining GameId');
      }
    }
  
    useEffect(()=>{
      if(socket){
        socket.on('joinId', (response)=>{
          if(response.status){
            navigate('/playground',{
              state:{
                color : 'b',
                socket : socket,
              }
            });
          }
          else{
            toast.error(response.res);
          }
        });
        return () =>{
          socket.off('joinId');
        }
      }
    },[socket])
  
    return (
      <>
        <div className="flex justify-center space-x-56 mt-40">
            <button className="border border-black p-2" onClick={handleClientCreateGame}>Create Game</button>
            <input placeholder="Enter gameId to join game" className="border border-black p-2" onChange={handleJoinId} value={joinId}/>
            <button className="border border-black p-2" onClick={handleClientJoinGame}>Join Game</button>
        </div>
        <div>{gameId}</div>
      </>
    )
}

export default Home