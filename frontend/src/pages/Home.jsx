import React, { useContext, useEffect, useState } from "react";
import SocketContext from "../redux/SocketContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import ProfileMenu from "../components/ProfileMenu";
import Title from '../utils/home-title-gambit.png';

function Home() {
  const { socketContext } = useContext(SocketContext);
  const [user, setUser] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [socket, setSocket] = useState(socketContext);
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.UserDetails);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  // Create Game Logic
  const handleClientCreateGame = async () => {
    socket.emit("create_game");
  };

  useEffect(() => {
    if (socket) {
      socket.on("gameId", (dataGameId) => {
        sessionStorage.setItem(
          "gameId",
          JSON.stringify({ gameId: dataGameId, color: "w" })
        );
        navigate("/playground");
      });
      return () => {
        socket.off("gameId");
      };
    }
  }, [socket]);

  // Join Game Logic
  const handleJoinId = (event) => {
    setJoinId(event.target.value);
  };

  const handleClientJoinGame = () => {
    if (joinId) {
      socket.emit("join_game", joinId);
    } else {
      setJoinId("");
      setShowInput(!showInput);
    }
  };

  const handleLogsClick = () => {
    navigate("/logs");
  };

  useEffect(() => {
    if (socket) {
      socket.on("joinId", (response) => {
        if (response.status) {
          sessionStorage.setItem(
            "gameId",
            JSON.stringify({ gameId: response.res, color: "b" })
          );
          navigate("/playground");
        } else {
          toast.error(response.res);
        }
      });
      return () => {
        socket.off("joinId");
      };
    }
  }, [socket]);


  return (
    <>
      <div>
        <div className="flex justify-end">
        <div></div>
        <div className="mr-5 mt-3">
          <ProfileMenu />
        </div>
        </div>
        <div className="flex flex-col items-center">
          <img src={Title} className="h-40 mt-10"/>
          <div className="flex flex-col space-y-12 items-center mt-28">
            <div className="flex justify-center space-x-56">
              <button
                className="border-2 shadow-md p-4 hover:bg-black hover:text-white transition rounded-md font-bold text-3xl"
                onClick={handleClientCreateGame}
              >
                Create Game
              </button>
              <button
                className="border-2 shadow-md p-4 hover:bg-black hover:text-white transition rounded-md font-bold text-3xl"
                onClick={handleClientJoinGame}
              >
                Join Game
              </button>
            </div>
            <div>
              {showInput && (
                <input
                  placeholder="Enter gameId to join game"
                  className="border-2 shadow-md rounded-md p-4 ml-5 w-60"
                  onChange={handleJoinId}
                  value={joinId}
                />
              )}
            </div>
          <div className="flex space-x-6">
            <button className="border-2 shadow-md p-4 hover:bg-black hover:text-white transition rounded-md font-bold text-3xl" onClick={handleLogsClick}>My Logs</button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
