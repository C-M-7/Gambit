import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import {toast} from 'sonner';
import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./redux/slices/UserDetails.jsx";
import Playground from "./pages/Playground.jsx";
import SocketContext from "./redux/SocketContext.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  const {setSocketContext} = useContext(SocketContext);  
  const [isUser, setIsuser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  console.log('hi app');

  const getUserInfo = async (token) => {
    try {
      const response = await axios.post("/gambit/userinfo", {
        token : token
      });
      if (response.data.status) {
        dispatch(setUserDetails(response.data.user));
        setIsuser(true);
      }
    } catch (err) {
      console.log(err.message)
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUserInfo(token);
      try{
        const socketInstance = io('http://localhost:7000',{
          auth:{
            token : token
          }
        })
        console.log(socketInstance);
        setSocketContext(socketInstance);

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
      catch(err){
        toast.warning('Unable to connect at the moment please try again later');
        <Navigate to='/signin'/>
      }
    }else{
      setIsLoading(false);
      toast.error('Token not found! Please SigIn again!');
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;  
  }
  
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/home" element={!isUser ? <Navigate to='/signin'/> : 
          <Home/>}/>
        <Route path="/" element={!isUser ? <Navigate to='/signin'/> : <Navigate to='/home'/>}/>
        <Route path="/playground" element={!isUser ? <Navigate to='/signin'/> : <Playground/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
