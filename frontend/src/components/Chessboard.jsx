import React, { useContext, useEffect, useState } from "react";
import SocketContext from "../redux/SocketContext";
import moveSound from "../utils/Sounds/gambit-capture.mp3";
import Cookies from "js-cookie";
// import wrongMoveSound from '../../utils/Sounds/gambit-wrong-move.mp3'
import { Chess } from "chess.js";
import Bbishop from "../utils/Pieces/bishop-b.svg";
import Wbishop from "../utils/Pieces/bishop-w.svg";
import Bking from "../utils/Pieces/king-b.svg";
import Wking from "../utils/Pieces/king-w.svg";
import Bknight from "../utils/Pieces/knight-b.svg";
import Wknight from "../utils/Pieces/knight-w.svg";
import Wpawn from "../utils/Pieces/pawn-w.svg";
import Bpawn from "../utils/Pieces/pawn-b.svg";
import Bqueen from "../utils/Pieces/queen-b.svg";
import Wqueen from "../utils/Pieces/queen-w.svg";
import Wrook from "../utils/Pieces/rook-w.svg";
import Brook from "../utils/Pieces/rook-b.svg";
import { toast } from "sonner";
import { RuleBook } from "./RuleBook";
import reconnectingUser from "./Reconnection";
import { useNavigate } from "react-router-dom";
import { StartModal } from "./StartModal";
import { EndModal } from "./EndModal";
import ClockLoader from "react-spinners/ClockLoader";

function Chessboard({ color, email }) {
  const [game, setGame] = useState(new Chess());
  const [lastmove, setLastMove] = useState("");
  const [position, setPosition] = useState(game.fen());
  const [selectedSq, setSelectedSq] = useState(null);
  const [gameResults, setGameResults] = useState("");
  const [openStartModal, setStartModal] = useState(true);
  const [openEndModal, setEndModal] = useState(false);
  const currGame = JSON.parse(sessionStorage.getItem("gameId"));
  const { socketContext } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (socketContext) {
      socketContext.on("resign", (data) => {
        toast.error(data);
        sessionStorage.clear();
        navigate("/home");
      });

      socketContext.on("reconnection", (data) => {
        if (data) {
          const currfen = sessionStorage.getItem(currGame.gameId);
          setGame(new Chess(currfen));
          toast.error("Reconnected");
        }
      });

      socketContext.on("resultGame", (result) => {
        toast.info(result);
        setGameResults(result);
        setEndModal(true);
      });

      socketContext.on("gameUpdates", (update) => {
        toast.error(update);
      });

      socketContext.on("start", (data) => {
        setStartModal(false);
        if (!sessionStorage.getItem(currGame.gameId)) {
          sessionStorage.setItem(
            currGame.gameId,
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          );
        }
      });
    }

    return () => {
      socketContext.off("reconnection");
      socketContext.off("resign");
      socketContext.off("resultGame");
      socketContext.off("gameUpdates");
      socketContext.off("start");
    };
  }, [socketContext]);

  // HANDLING THE SWITCHING ROUTE CASE
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      const confirmLeave = window.confirm(
        "Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        window.history.pushState(
          null,
          "http://localhost:5173/home",
          window.location.pathname
        );
      } else {
        socketContext.emit("resign", currGame.gameId, color);
        sessionStorage.clear();
        window.location.href = "http://localhost:5173/home";
      }
    };

    window.addEventListener("popstate", handlePopState);

    window.history.pushState(null, null, window.location.pathname);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // HANDLING INCOMING MOVES
  const handleBoard = (fen, oppLastMove) => {
    const result = RuleBook(fen);
    if (!result.valid) {
      toast.error(result.status);
    } else {
      if (oppLastMove === "reconnection") {
        const currfen = sessionStorage.getItem(currGame.gameId);
        setGame(new Chess(currfen));
      } else if (oppLastMove) {
        const newGame = new Chess(fen);
        setGame(newGame);
        sessionStorage.setItem(currGame.gameId, fen);
      }
      if (
        result.status === "DRAW" ||
        result.status === "STALEMATE" ||
        result.status === "TFR" ||
        result.status === "ISM"
      ) {
        toast.error("The Game draws!");
      } else if (result.status === "CHECKMATE") {
        socketContext.emit("endGame", currGame.gameId, email, result.status);
      } else if (result.status === "CHECK") {
        toast.error("You are in Check!");
      }
    }
  };

  // ON RELOADING NEW/OLD GAME
  useEffect(() => {
    if (sessionStorage.getItem(currGame.gameId)) {
      const reconnect = async () => {
        const accessAuthToken = localStorage.getItem("accessAuthToken");
        const response = await reconnectingUser(accessAuthToken, currGame.gameId);
        if (response.status) {
          socketContext.emit(
            "reconnection",
            sessionStorage.getItem(currGame.gameId),
            currGame.gameId
          );
        }
      };
      reconnect();
    }
  }, []);


  // SOCKETS
  useEffect(() => {
    socketContext.on("oppMove", (fen, oppLastMove) =>
      handleBoard(fen, oppLastMove)
    );
    return () => {
      socketContext.off("oppMove");
    };
  }, [socketContext, game, position]);

  useEffect(() => {
    socketContext.emit("move", game.fen(), lastmove, currGame.gameId);
  }, [position]);

  if (openStartModal && !sessionStorage.getItem(currGame.gameId)) {
    return (
      <div>
        <StartModal gameId={currGame.gameId} />
      </div>
    );
  }

  if (openEndModal) {
    return (
      <div>
        <EndModal
          gameId={currGame.gameId}
          gameRes={gameResults}
          closeEndModal={setEndModal}
        />
      </div>
    );
  }

  if(loading){
    return <div><ClockLoader/></div>
  }

  // BOARD LOGIC
  const pieceUnicode = {
    p: <img src={Bpawn} />,
    r: <img src={Brook} />,
    n: <img src={Bknight} />,
    b: <img src={Bbishop} />,
    q: <img src={Bqueen} />,
    k: <img src={Bking} />,
    P: <img src={Wpawn} />,
    R: <img src={Wrook} />,
    N: <img src={Wknight} />,
    B: <img src={Wbishop} />,
    Q: <img src={Wqueen} />,
    K: <img src={Wking} />,
  };

  const handleSqClick = (row, col) => {
    if (color !== game.turn()) {
      toast.error("Please wait for your turn!");
      setSelectedSq(null);
    } else {
      const square =
        color === "w"
          ? String.fromCharCode(97 + col) + (8 - row)
          : String.fromCharCode(104 - col) + (row + 1);
      if (selectedSq) {
        try {
          const move = game.move({
            from: selectedSq,
            to: square,
            promotion: "q",
          });
          if (move) {
            setLastMove(move.san);
            new Audio(moveSound).play();
            setGame(new Chess(game.fen()));
            sessionStorage.setItem(currGame.gameId, game.fen());
            setPosition(game.fen());
            setSelectedSq(null);
          }
        } catch (err) {
          setSelectedSq(null);
        }
      } else {
        setSelectedSq(square);
      }
    }
  };

  const createSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const sqColor = isBlack ? "bg-gray-600" : "bg-gray-300";
    const square =
      color === "w"
        ? String.fromCharCode(97 + col) + (8 - row)
        : String.fromCharCode(104 - col) + (row + 1);
    const piece = game.get(square);

    return (
      <div
        key={square}
        className={`w-20 h-20 flex items-center justify-center ${sqColor} cursor-pointer`}
        onClick={() => handleSqClick(row, col)}
      >
        {piece && (
          <span className="">
            {
              pieceUnicode[
                piece.color === "w" ? piece.type.toUpperCase() : piece.type
              ]
            }
          </span>
        )}
      </div>
    );
  };

  const createBoard = () => {
    const board = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        board.push(createSquare(row, col));
      }
    }
    return board;
  };

  return (
    <>
      <div className="grid grid-cols-8 shadow-lg">{createBoard()}</div>
    </>
  );
}

export default Chessboard;
