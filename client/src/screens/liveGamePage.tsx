import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";

export default function LiveGamePage() {
  const location = useLocation();
  const { username, board: initialBoard, roomCode } = location.state || {};
  const [board, setBoard] = useState(initialBoard);

  // Use the same WebSocket URL
  const wsUrl = "ws://localhost:3000";
  
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
    queryParams: { username }, // Use the same username to keep track of the same user
  });

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.method === "update_board") {
      setBoard(lastJsonMessage.board);
    }
  }, [lastJsonMessage]);

  const handleMovePiece = (row, col) => {
    // Add logic for moving pieces here
    // Make sure to update the board state and send the update to the server
    sendJsonMessage({
      method: "update_board",
      board,
      roomCode,
    });
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-xl"
      style={{ height: `calc(100vh - 4rem)` }}
    >
      <div className="flex-row">
        <div className="text-center mb-4">
          <p>Room Code: {roomCode}</p>
          <p>Player 1: {username}</p>
          <p>Player 2: {lastJsonMessage?.game?.user2?.username || "Opponent"}</p>
        </div>

        <div className="grid grid-cols-5 gap-1 w-full max-w-xl p-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-full h-full border border-gray-300 rounded-lg 
                ${cell && (rowIndex === 0 ? "bg-red-500" : "bg-green-500")} text-white`}
                onClick={() => handleMovePiece(rowIndex, colIndex)}
              >
                {cell.startsWith("O-") ? cell : ""}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
