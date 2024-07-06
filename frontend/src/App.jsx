import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "./redux/slices/UserDetails.jsx";
import Playground from "./pages/Playground.jsx";
import SocketContext from "./redux/SocketContext.jsx";
import Signup from "./pages/Signup.jsx";
import PlayerLogs from "./pages/PlayerLogs.jsx";

function App() {
  const { setSocketContext } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userdetails = useSelector((state) => state.UserDetails);

  const getUserInfo = async (token) => {
    try {
      const response = await axios.post("/gambit/userinfo", {
        token: token,
      });
      if (response.data.status) {
        console.log(response.data.user);
        dispatch(setUserDetails(response.data.user));
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (userdetails.username !== null && Object.keys(userdetails).length > 0) {
      setIsLoading(false);
    } else {
      if (token) {
        console.log("socket from app");
        getUserInfo(token);
        try {
          const socketInstance = io("http://localhost:7000", {
            auth: {
              token: token,
            },
          });
          console.log(socketInstance);
          setSocketContext(socketInstance);

          socketInstance.on("connect", () => {
            console.log("Connected to socketInstance server");
          });

          socketInstance.on("disconnect", () => {
            // Cookies.remove("token");
            socketInstance.disconnect();
            console.log("user disconnected from server");
          });

          return () => {
            socketInstance.off("connect");
            socketInstance.off("disconnect");
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
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
