import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import { io } from "socket.io-client";
import Cookies from 'js-cookie';

function App() {
  const navigate = useNavigate();

  useEffect(()=>{
    const token = Cookies.get('token');
    console.log(token);
    if(token){
      console.log('hi');
      const socket = io('http://localhost:7000',{
        extraHeaders: {
          token: `Bearer ${token}`,
        }
      })
      console.log(socket);
      socket.on('connect', () => {
        console.log('Connected to socket server');
      });
    }
    else {
      toast.warning('Please SignIn before accessing Gambit!');
      navigate('/signin');
    }
  },[])

  return (
    <>
      <div>
        Home Page
      </div>
    </>
  )
}

export default App
