// server/websocket.js

const WebSocket = require("ws");
const Game = require("./game");

const game = new Game();

let players = {
  A: null, // Player A's username
  B: null, // Player B's username
};

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { action, player, data } = parsedMessage;

        switch (action) {
          case "JOIN_GAME":
            handleJoinGame(ws, parsedMessage.username);
            console.log(`JOIN_GAME action received with username: ${username}`);
            break;

          case "PLACE_PIECES":
            if (isValidPlayer(ws)) {
              game.placePieces(ws.role, data);
              broadcastGameState(wss);
            } else {
              ws.send(JSON.stringify({ error: "Unauthorized player." }));
            }
            break;

          case "MOVE_PIECE":
            if (isValidPlayer(ws)) {
              const { fromX, fromY, direction } = data;
              game.movePiece(ws.role, fromX, fromY, direction);
              broadcastGameState(wss);
            } else {
              ws.send(JSON.stringify({ error: "Unauthorized player." }));
            }
            break;

          default:
            ws.send(JSON.stringify({ error: "Unknown action." }));
        }
      } catch (error) {
        ws.send(JSON.stringify({ error: error.message }));
      }
    });

    ws.on("close", () => {
      if (ws.role === "A") {
        players.A = null;
      } else if (ws.role === "B") {
        players.B = null;
      }
    });

    // Send initial game state to the connected client
    ws.send(JSON.stringify(game.getGameState()));
  });
}

function handleJoinGame(ws, username) {
  console.log(`Received JOIN_GAME from ${username}`);
  if (!players.A) {
    players.A = username;
    ws.role = "A";
    ws.send(JSON.stringify({ action: "ASSIGN_ROLE", role: "A" }));
    console.log(`Assigned role A to ${username}`);
  } else if (!players.B) {
    players.B = username;
    ws.role = "B";
    ws.send(JSON.stringify({ action: "ASSIGN_ROLE", role: "B" }));
    console.log(`Assigned role B to ${username}`);
  } else {
    ws.send(JSON.stringify({ action: "ROOM_FULL" }));
    console.log(`Room full. Connection rejected for ${username}`);
    ws.close();
  }
}


function isValidPlayer(ws) {
  // Validate if the player is assigned to either A or B role
  return ws.role === "A" || ws.role === "B";
}

function broadcastGameState(wss) {
  const state = game.getGameState();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(state));
    }
  });
}

module.exports = setupWebSocket;
