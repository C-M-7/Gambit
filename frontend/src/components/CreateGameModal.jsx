import React, { useContext, useState } from "react";

const CreateGameModal = ({ toggleModal, startGame }) => {
  const [timer, setTimer] = useState(10);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white text-black rounded-md shadow-lg border-4 flex flex-col items-center p-5 border-black">
        <div className="text-5xl font-bold p-7">Set Game Timer</div>
        <div className="flex my-5 space-x-10">
          <button
            className={`border-2 border-black rounded-md transition hover:bg-black hover:text-white p-2 font-bold text-lg ${
              timer === 5 ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => {
              setTimer(5);
            }}
          >
            5:00
          </button>
          <button
            className={`border-2 border-black rounded-md transition hover:bg-black hover:text-white p-2 font-bold text-lg ${
              timer === 10 ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => {
              setTimer(10);
            }}
          >
            10:00
          </button>
          <button
            className={`border-2 border-black rounded-md transition hover:bg-black hover:text-white p-2 font-bold text-lg ${
              timer === 15 ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => {
              setTimer(15);
            }}
          >
            15:00
          </button>
        </div>
        <div className="flex space-x-10">
    <button
            className="border-2 mt-3 border-black hover:bg-black hover:text-white transition p-2 rounded-md font-bold"
            onClick={() => {
              startGame(timer);
            }}
          >
            Start Game
          </button>
          <button
            className="border-2 mt-3 border-black hover:bg-black hover:text-white transition p-2 rounded-md font-bold"
            onClick={toggleModal}
          >
            Cancel Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameModal;
