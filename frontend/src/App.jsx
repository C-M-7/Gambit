import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./redux/slices/UserDetails.jsx";
import Playground from "./pages/Playground.jsx";
import SocketContext from "./redux/SocketContext.jsx";
import Signup from "./pages/Signup.jsx";
import PlayerLogs from "./pages/PlayerLogs.jsx";
import Profile from "./pages/Profile.jsx";
import api from "./api.js";
import socket from "./socket.js";

function App() {
  const { setSocketContext } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userdetails = useSelector((state) => state.UserDetails);

  const getUserInfo = async (token) => {
    try {
      const response = await api.post("/gambit/userinfo", {
        token: token,
      });
      if (response.data.status) {
        dispatch(setUserDetails(response.data.user));
      }
      else{
        toast.error(response.data.error);
      }
    } catch (err) {
      try{
        const response = await api.post("/gambit/accessToken");
        if(response.data.status){
          localStorage.setItem("accessAuthToken", response.data.accessToken);
          dispatch(setUserDetails(response.data.user));
        }
        else{
          toast.error(response.data.error);
        }
      }
      catch(err){
        toast.error(err.message);
      }
      // toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessAuthToken");
    async function fetchDatafromToken(){
      if (token) {
        await getUserInfo(token);
        
        try {
          socket.auth = { token: token };
          socket.connect();
          setSocketContext(socket);

          socket.on("connect", ()=>{});

          socket.on("disconnect", () => {
            socket.disconnect();
            console.log("user disconnected from server");
          });

          return () => {
            socket.off("connect");
            socket.off("disconnect");
          };
        } catch (err) {
          toast.warning(
            "Unable to connect at the moment please try again later"
          );
          <Navigate to="/signin" />;
        }
      } else {
        setIsLoading(false);
        toast.error("Token not found! Please SigIn again!");
      }
    }

    if (userdetails.username !== null && Object.keys(userdetails).length > 0) {
      setIsLoading(false);
    } else {
      fetchDatafromToken();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route
          path="/home"
          element={
            userdetails.username == null ? <Navigate to="/signin" /> : <Home />
          }
        />
        <Route
          path="/"
          element={
            userdetails.username == null ? (
              <Navigate to="/signin" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/playground"
          element={
            userdetails.username == null ? (
              <Navigate to="/signin" />
            ) : (
              <Playground />
            )
          }
        />
        <Route
          path="/logs"
          element={
            userdetails.username == null ? (
              <Navigate to="/signin" />
            ) : (
              <PlayerLogs />
            )
          }
        />
        <Route
          path="/profile"
          element={
            userdetails.username == null ? (
              <Navigate to="/signin" />
            ) : (
              <Profile/>
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
