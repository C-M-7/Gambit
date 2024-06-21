import React,{ useContext, useEffect, useState } from "react"
import SocketContext from "../redux/SocketContext";
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
// import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
// import { setGameDetails } from "../redux/slices/GameDetails";

function Home() {
    // const {setSocketContext} = useContext(SocketContext)
    console.log('hi home');
    const { socketContext } = useContext(SocketContext);
    const [user, setUser] = useState({});
    const [socket, setSocket] = useState(null);
    const [joinId, setJoinId] = useState('');
    const navigate = useNavigate();
    const userData = useSelector((state) => state.UserDetails);
    // const dispatch = useDispatch();
    
    useEffect(()=>{
      if(socketContext){
        setSocket(socketContext);
      }
    },[])
    
    // useEffect(()=>{
    //   const token = Cookies.get('token');
    //   if(token){
    //     try{
    //       const socketInstance = io('http://localhost:7000',{
    //         auth:{
    //           token : token
    //         }
    //       })
    //       console.log(socketInstance);
    //       setSocket(socketInstance);
    //       setSocketContext(socketInstance);
          
    //       socketInstance.on('connect', () => {
    //         console.log('Connected to socketInstance server');
    //       });

    //       socketInstance.on('disconnect',()=>{
    //         // Cookies.remove("token");
    //         socketInstance.disconnect();
    //         console.log("user disconnected from server")
    //       });
          
    //       return () =>{
    //         socketInstance.off('connect');
    //         socketInstance.off('disconnect');
    //       }
    //     }
    //     catch(err){
    //       toast.warning('Unable to connect at the moment please try again later');
    //       navigate('/sigin')
    //     }
    //   }
    //   else{
    //     toast.error('Token not found! Please SigIn again!')
    //     navigate('/signin');
    //   }
    // },[])
    
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
  
    return (
      <>
        <div>
          {
            user 
            &&
            <div>hello <span className="font-bold">{user.name}</span></div>
          }
        </div>
        <div className="flex justify-center space-x-56 mt-40">
            <button className="border border-black p-2" onClick={handleClientCreateGame}>Create Game</button>
            <input placeholder="Enter gameId to join game" className="border border-black p-2" onChange={handleJoinId} value={joinId}/>
            <button className="border border-black p-2" onClick={handleClientJoinGame}>Join Game</button>
        </div>
        
      </>
    )
}

export default Home