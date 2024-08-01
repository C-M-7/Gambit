import React from "react";

const LogDiv = ({ data, user }) => {
  const opponent = data.player1 !== user.email ? data.player1 : data.player2;
  const winner = data.result;
  const date = data.createdAt;
  const moves = data.moves;
  const fen = data.gameState;

  return (
    <>
      <div className={`flex flex-col border-2 px-2 py-4 rounded-md w-[100%] shadow-md ${winner === user.email ? 'bg-green-400' : 'bg-red-400'} cursor-pointer`}>
        <div className="flex justify-between space-x-32">
        {
          winner === user.email
          ?
          <div className="font-bold">WON</div>
          :
          (
            winner === undefined
            ?
            <div className="font-bold">DRAW</div>
            :
            <div className="font-bold">LOST</div>
          )
        }
        <div>{opponent}</div>
        <div>{data.gameId}</div>
        <div>{date}</div>
        </div>
        
      </div>
    </>
  );
};

export default LogDiv;
