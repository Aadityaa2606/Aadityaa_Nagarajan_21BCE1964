// src/components/GameBoard.js

import React, { useState } from 'react';

const GameBoard = () => {
  const [roomCode, setRoomCode] = useState('12345');  // Replace with dynamic room code
  const [player1, setPlayer1] = useState('21BCE1964');
  const [player2, setPlayer2] = useState(null);  // Replace with actual opponent data when available
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill(null)));

  const startGame = () => {
    // Handle game start logic
  };

  const handleCellClick = (rowIndex, colIndex) => {
    // Handle cell click logic
    console.log(`Cell clicked: Row ${rowIndex}, Col ${colIndex}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center mb-4">
        <div className="text-lg font-semibold">Room Code: {roomCode}</div>
        <div className="text-lg font-semibold">Player 1: {player1}</div>
        <div className="text-lg font-semibold">
          Player 2: {player2 ? player2 : 'Waiting for opponent...'}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 flex items-center justify-center bg-gray-300 rounded ${
                cell ? 'bg-gray-500' : 'bg-gray-200'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700 disabled:bg-gray-500"
        onClick={startGame}
        disabled={!player2}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameBoard;
