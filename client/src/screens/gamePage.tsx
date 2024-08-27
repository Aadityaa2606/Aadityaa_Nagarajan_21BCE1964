import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";

export default function GamePage() {
  const wsUrl = "ws://localhost:3000";
  const [board, setBoard] = useState(Array(5).fill(Array(5).fill("")));
  const location = useLocation();
  const navigate = useNavigate();
  
  const { username, roomCode } = location.state || {};
  
  const [myUsername, setMyUsername] = useState(username);
  const [opponentUsername, setOpponentUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [playerRole, setPlayerRole] = useState(""); // New state for player role

  const [gameCode, setGameCode] = useState(roomCode || "");

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(wsUrl, {
    queryParams: { username },
  });

  useEffect(() => {
    if (readyState === WebSocket.OPEN) {
      if (roomCode) {
        sendJsonMessage({
          method: "join_game",
          username,
          roomCode,
        });
      } else {
        sendJsonMessage({
          method: "create_game",
          username,
        });
      }
    }
  }, [readyState, sendJsonMessage, username, roomCode]);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.method === "join_game") {
        setBoard(lastJsonMessage.game.board);
        setMyUsername(lastJsonMessage.game.user2.username);
        setGameStarted(lastJsonMessage.game.isGameStarted);
        setOpponentUsername(lastJsonMessage.game.user1.username);
        setPlayerRole(lastJsonMessage.game.user2.username === username ? "player2" : "player1"); // Set player role
      } else if (lastJsonMessage.method === "start_game") {
        setGameStarted(true);
        console.log("Game started!");
        navigate("/live-game", { state: { username, board, roomCode } });
      } else if (lastJsonMessage.method === "update_board") {
        setBoard(lastJsonMessage.board);
      } else if (lastJsonMessage.method === "create_game") {
        setGameCode(lastJsonMessage.game.roomCode);
        setPlayerRole("player1");
      }
    }
  }, [lastJsonMessage, navigate, board, username]);

  const handleCellClick = (row, col) => {
    // Adjust row check based on player role
    const allowedRow = playerRole === "player1" ? 4 : 0;

    if (row !== allowedRow || board[row][col]) return; // Only allow placement in the designated row

    const piece = prompt("Enter your piece (P1, P2, P3, H1, H2)").toUpperCase();

    if (!["P1", "P2", "P3", "H1", "H2"].includes(piece)) {
      alert("Invalid piece! Please enter P1, P2, P3, H1, or H2.");
      return;
    }

    if (board.flat().includes(piece)) {
      alert(`${piece} is already placed!`);
      return;
    }

    const newBoard = board.map((r, rowIndex) =>
      rowIndex === row
        ? r.map((cell, colIndex) => (colIndex === col ? piece : cell))
        : r
    );
    setBoard(newBoard);
  };

  const handleStartGame = () => {
    if (board.flat().filter((cell) => cell !== "").length < 5) {
      alert("You must place all 5 pieces before starting the game.");
      return;
    }

    sendJsonMessage({
      method: "start_game",
      board,
      username,
      roomCode,
    });
  };

  // Invert the board for Player 2
  const displayBoard = playerRole === "player2" ? [...board].reverse() : board;

  return (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-xl"
      style={{ height: `calc(100vh - 4rem)` }}
    >
      <div className="flex-row ">
        <div className="text-center mb-4">
          <p>Room Code: {gameCode}</p>
          <p>Player 1: {myUsername}</p>
          <p>
            Player 2:{" "}
            {opponentUsername !== ""
              ? opponentUsername
              : "Waiting for opponent..."}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-1 w-full max-w-xl p-2">
          {displayBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-full h-full border border-gray-300 rounded-lg 
                    ${rowIndex !== (playerRole === "player1" ? 4 : 0) && "bg-gray-300 cursor-not-allowed"} 
                    ${
                      cell && (rowIndex === (playerRole === "player1" ? 4 : 0) ? "bg-red-500" : "bg-green-500")
                    } text-white h-[50px] w-[80px]`}
                disabled={rowIndex !== (playerRole === "player1" ? 4 : 0) || cell !== ""}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </button>
            ))
          )}
        </div>

        <div className="text-center mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-500"
            disabled={gameStarted}
            onClick={handleStartGame}
          >
            {gameStarted ? "Game in Progress" : "Start Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
