import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./redux/slices/UserDetails.jsx";
import Playground from "./pages/Playground.jsx";

function App() {
  const [isUser, setIsuser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.UserDetails);

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
    }else{
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;  
  }
  
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={!isUser ? <Navigate to='/signin'/> : <Navigate to='/home'/>}/>
        <Route path="/playground" element={<Playground/>}/>
      </Routes>
    </>
  );
}

export default App;
