import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./redux/slices/UserDetails.jsx";

function App() {
  console.log("app");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.UserDetails);

  const getUserInfo = async (token) => {
    try {
      const response = await axios.get("/gambit/userinfo/", {
        token: token,
      });
      console.log(response);
      if (response.status) {
        dispatch(setUserDetails(response.user));
      }
    } catch (err) {}
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUserInfo(token);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route to='/' element={<Home/>}/>
        <Route to='/signin' element={<Login/>}/>
        <Route path="/" element={userData ? <Navigate to='/'/> : <Navigate to='/signin'/>}/>
      </Routes>
        
    </>
  );
}

export default App;
