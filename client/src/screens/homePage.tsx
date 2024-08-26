import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }
    navigate("/game", { state: { username, roomCode: null } });
  };

  const handleJoinRoom = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }
    if (roomCode.trim() === "") {
      alert("Please enter a room code");
      return;
    }
    navigate("/game", { state: { username, roomCode } });
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-xl"
      style={{ height: `calc(100vh - 4rem)` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Enter username
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="John"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="roomCode"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Enter Room Code (Optional for creating a new room)
          </label>
          <input
            type="text"
            id="roomCode"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
