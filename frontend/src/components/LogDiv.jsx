import React from "react";

const LogDiv = ({ data, user }) => {
  const opponent = data.player1 !== user.email ? data.player1 : data.player2;
  const winner = data.result;
  const date = data.createdAt;
  const moves = data.moves;
  const fen = data.gameState;

  return (
    <>
      <div className={`flex flex-col border-2 px-2 py-4 rounded-md w-[75%] shadow-md ${winner===user.email ? 'bg-green-400' : (winner === undefined ? 'bg-slate-500' : 'bg-red-400')}`}>
        <div className="flex justify-between">
            <div className="font-bold">GameId : {data.gameId}</div>
            <div className="text-gray-400">Played : {date}</div>
        </div>
        <div>Opponent : {opponent}</div>
        <div>Winner : {winner}</div>
        <div>Moves : {moves}</div>
        <div>Fen : {fen}</div>
      </div>
    </>
  );
};

export default LogDiv;
