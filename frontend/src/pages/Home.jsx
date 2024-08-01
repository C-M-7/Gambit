import React, { useContext, useEffect, useState } from "react";
import SocketContext from "../redux/SocketContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileMenu from "../components/ProfileMenu";
import Title from "../utils/home-title-gambit.png";

function Home() {
  const { socketContext } = useContext(SocketContext);
  const [showInput, setShowInput] = useState(false);
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate()

  const handleClientCreateGame = async () => {
    socketContext.emit("create_game");
  };

  useEffect(() => {
    if (socketContext) {
      socketContext.on("gameId", (dataGameId) => {
        sessionStorage.setItem(
          "gameId",
          JSON.stringify({ gameId: dataGameId, color: "w" })
        );
        navigate("/playground");
      });

      socketContext.on("joinId", (response) => {
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
        socketContext.off("joinId");
        socketContext.off("gameId");
      };
    }
  }, [socketContext]);

  const handleJoinId = (event) => {
    setJoinId(event.target.value);
  };

  const handleClientJoinGame = () => {
    if (joinId) {
      console.log(joinId);
      socketContext.emit("join_game", joinId);
    } else {
      setJoinId("");
      setShowInput(!showInput);
      toast.error("Invalid GameId");
    }
  };

  return (
    <div className="bg-black">
      <div className="">
        <div className="flex justify-end">
          <div></div>
          <div className="mr-5 mt-3">
            <ProfileMenu />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <img src={Title} />
          </div>
          <div className="flex flex-col space-y-11 items-center mt-28 pb-28">
            <div className="flex justify-center space-x-56">
              <button
                className="border-2 border-white shadow-md p-4 text-white transition rounded-md font-bold text-3xl hover:bg-white hover:text-black hover:border-black"
                onClick={handleClientCreateGame}
              >
                Create Game
              </button>
              <button
                className="border-2 border-white shadow-md p-4 text-white transition rounded-md font-bold text-3xl hover:bg-white hover:text-black hover:border-black"
                onClick={handleClientJoinGame}
              >
                Join Game
              </button>
            </div>
            <div>
              <input
                placeholder="Enter gameId to join game"
                className="border-2 border-white shadow-md rounded-md p-4 ml-5 w-60 bg-black text-white"
                onChange={handleJoinId}
                value={joinId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
