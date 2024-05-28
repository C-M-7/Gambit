import React, { useState } from 'react'
import {toast} from 'sonner';
import axios from 'axios';

function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (event) =>{
        setName(event.target.value);
    }

    const handleUsername = (event) =>{
        setUsername(event.target.value);
    }

    const handleMail = (event) =>{
        setMail(event.target.value);
    }

    const handlePassword = (event) =>{
        setPassword(event.target.value);
    }

    const handleClick = async(event)=>{
        event.preventDefault();
        if(name === '' || username === '' || mail === '' || password === ''){
            setMail('');
            setName('');
            setPassword('');
            setUsername('');
            toast.warning('All fields are mandatory')
        }
        else{
            try{
                const response = await axios.post('/gambit/signup/',{
                    name : name,
                    username : username,
                    email : mail,
                    password : password
                })
                console.log(response);
            }
            catch(err){
                console.error('Error :', err.response.data);
            }
        }
    }

  return (
    <div className='flex justify-center items-center h-screen w-screen'>
        <div className='flex flex-col items-center p-10 space-y-4 rounded-md border border-black shadow-md'>
            <div className='text-3xl font-bold'>
                SignUp
            </div>
            <div>
                <div>Name</div>
                <input className='border border-black w-72 h-8 px-1' type='text' value={name} onChange={handleName}/>
            </div>
            <div>
                <div>Username</div>
                <input className='border border-black w-72 h-8 px-1' type='text' value={username} onChange={handleUsername}/>
            </div>
            <div>
                <div>Email</div>
                <input className='border border-black w-72 h-8 px-1' type='text' value={mail} onChange={handleMail}/>
            </div>
            <div>
                <div>Password</div>
                <input className='border border-black w-72 h-8 px-1' type='text' value={password}  onChange={handlePassword}/>
            </div>
            <div>
                <button className='border border-black rounded-md h-10 mt-8 w-40 hover:bg-black hover:text-white transition transform active:scale-95 focus:outline-none' onClick={handleClick}>Sign Up</button>
            </div>
        </div>
    </div>
  )
}

export default Signup