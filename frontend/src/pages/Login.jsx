import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/slices/UserDetails";
import SocketContext from "../redux/SocketContext";
import { io } from "socket.io-client";
import ClockLoader from "react-spinners/ClockLoader";
import openEyeSvg from "../utils/open-eye-svg.svg";
import closeEyeSvg from "../utils/close-eye-svg.svg";
// import api from "../api";
import socket from "../socket";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setSocketContext } = useContext(SocketContext);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleMail = (event) => {
    setMail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const setSocketFromLogin = async (token) => {
    try {
      localStorage.setItem("accessAuthToken", token);
      setLoading(true);
      socket.auth = {token : token};
      socket.connect();
      setSocketContext(socket);
      setLoading(false);
    } catch (err) {
      navigate("/signin");
      toast.error("Unable to join you at the moment!");
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (mail === "" || password === "") {
      setMail("");
      setPassword("");
      toast.error("All fields are mandatory!");
    } else {
      try {
       
        const sendConf={
          url:"https://gambit.strangled.net/gambit/signin/",
          // url:"http://localhost:7000/gambit/signin",
          method:'POST',
          data:{
            email:mail,
            password:password
          },
          withCredentials:true
        }
        const response = await axios(sendConf);
        if (response.status) {
          dispatch(setUserDetails(response.data.user));
          await setSocketFromLogin(response.data.accessToken);
          navigate("/home");
          toast.success("SignIn was successful!");
        }
        // else if(response.data.status_code === 401){
          
        // }
      } catch (err) {
        console.error("Error :", err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="ml-[50%] mt-[25%]">
        <ClockLoader speedMultiplier={4} />
      </div>
    );
  }

  return (
    <div className="bg-custom-bg flex flex-col justify-center items-center h-screen w-screen bg-cover bg-no-repeat">
      <div className="flex flex-col items-center p-10 space-y-4 rounded-md border-2 shadow-lg text-white bg-tranparent bg-black bg-opacity-85">
        <div className="text-3xl font-bold ">SignIn</div>
        <div>
          <div>Email</div>
          <input
            className="border-2 text-black border-white bg-gray-200 w-72 h-8 px-1 transition"
            type="text"
            value={mail}
            onChange={handleMail}
          />
        </div>
        <div>
          <div>Password</div>
          <div className="relative flex items-center">
            <input
              type = {inputType ? 'password' : 'text'}
              value={password}
              onChange={handlePassword}
              className="border-2 border-white bg-gray-200 text-black w-72 h-8 p-1 focus:bg-gray-100 transition"
            />
            {
              !inputType 
              ?
              <img
                src={closeEyeSvg}
                onClick={()=>{setInputType(!inputType)}}
                alt="Toggle visibility"
                className="absolute z-10 inset-y-0 right-0 w-6 h-6 m-1 mt-2 cursor-pointer"
              />
              :
              <img
                src={openEyeSvg}
                onClick={()=>{setInputType(!inputType)}}
                alt="Toggle visibility"
                className="absolute z-10 inset-y-0 right-0 w-6 h-6 m-1 cursor-pointer"
              />
            }
          </div>
        </div>
        <div>
          <button
            className="border border-whiter rounded-md h-10 mt-8 w-40 transition transform active:scale-95 focus:outline-none bg-transparent hover:bg-gray-100 hover:text-black"
            onClick={handleClick}
          >
            SignIn
          </button>
        </div>
      </div>
      <div className="mt-3 text-white text-lg">
        Don't have an account?{" "}
        <Link to={"/signup"} className="underline font-bold">
          SignUp here
        </Link>
      </div>
    </div>
  );
}

export default Login;
