import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'sonner';

function Login() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleMail = (event) =>{
      setMail(event.target.value);
  }

  const handlePassword = (event) =>{
      setPassword(event.target.value);
  }

  const handleClick = async(event)=>{
    event.preventDefault();
    if(mail === '' || password === ''){
        setMail('');
        setPassword('');
    }
    else{
        try{
            const response = await axios.post('/gambit/signin/',{
                email : mail,
                password : password
            })
            console.log(response);
            if(response){
              navigate('/');
              toast.success('SignIn was successful!');
            }
        }
        catch(err){
            console.error('Error :', err.response.data);
        }
    }
}

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col items-center p-10 space-y-4 rounded-md border border-black">
        <div className="text-3xl font-bold">SignIn</div>
        <div>
          <div>Email</div>
          <input className='border border-black w-72 h-8 px-1' type='text' value={mail} onChange={handleMail}/>
        </div>
        <div>
          <div>Password</div>
          <input className='border border-black w-72 h-8 px-1' type='text' value={password}  onChange={handlePassword}/>
        </div>
        <div>
        <button className='border border-black rounded-md h-10 mt-8 w-40 hover:bg-black hover:text-white transition transform active:scale-95 focus:outline-none' onClick={handleClick}>
            SignIn
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
