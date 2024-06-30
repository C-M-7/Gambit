import React,{ useContext, useEffect, useState } from "react"
import SocketContext from "../redux/SocketContext";
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import { useSelector } from "react-redux";

function Home() {
    console.log('hi home');
    const { socketContext } = useContext(SocketContext);
    const [user, setUser] = useState({});
    const [socket, setSocket] = useState(null);
    const [joinId, setJoinId] = useState('');
    const navigate = useNavigate();
    const userData = useSelector((state) => state.UserDetails);
    
    useEffect(()=>{
      if(socketContext){
        setSocket(socketContext);
      }
    },[])
    
    useEffect(()=>{
      setUser(userData);
    },[userData])

    // Create Game Logic
    const handleClientCreateGame = () =>{
      console.log(1);
      socket.emit('create_game');
    }
  
    useEffect(()=>{
      if(socket){
        socket.on('gameId', (dataGameId)=>{
          sessionStorage.setItem('gameId',JSON.stringify({gameId : dataGameId, color : 'w'}));
          navigate('/playground');
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
    
    const handleLogsClick = () =>{
      navigate('/logs');
    }
  
    useEffect(()=>{
      if(socket){
        socket.on('joinId', (response)=>{
          if(response.status){
            sessionStorage.setItem('gameId', JSON.stringify({gameId : response.res, color : 'b'}));
            navigate('/playground');
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

    // Logout Logic
    const handleLogout = () =>{
      Cookies.remove('token');
      window.location.reload();
    }
  
    return (
      <>
        <div>
          {
            user 
            &&
            <div>hello <span className="font-bold">{user.name}</span></div>
          }
        </div>
        <div className="flex flex-col items-center space-y-20">
          <div className="flex justify-center space-x-56 mt-40">
              <button className="border border-black p-2" onClick={handleClientCreateGame}>Create Game</button>
              <input placeholder="Enter gameId to join game" className="border border-black p-2 w-56" onChange={handleJoinId} value={joinId}/>
              <button className="border border-black p-2" onClick={handleClientJoinGame}>Join Game</button>
          </div>
          <div className="flex space-x-6">
            <button className="border border-black p-2" onClick={handleLogsClick}>My Logs</button>
            <button className="border border-black p-2" onClick={handleLogout}>LogOut</button>
          </div>
        </div>
        
      </>
    )
}

export default Home