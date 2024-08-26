const http = require("http");
const { WebSocketServer } = require("ws");
const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer((req, res) => {
  res.end("Hello World");
});

const port = 3000;

const wsServer = new WebSocketServer({ server });

const connections = {};
const users = {};
const games = {};

// Function to handle a new WebSocket connection
const handleConnection = (connection, request) => {
  const { username } = url.parse(request.url, true).query;

  if (!username) {
    connection.close();
    return;
  }

  const existingUserUuid = Object.keys(users).find(uuid => users[uuid].username === username);

  if (existingUserUuid) {
    connections[existingUserUuid] = connection;
    console.log(`Reconnected User ${existingUserUuid}`);
  } else {
    const uuid = uuidv4();
    connections[uuid] = connection;
    users[uuid] = { username, online: true, state: {} };
    console.log(`New User ${uuid} connected`);
  }

  connection.on("message", (message) => handleMessage(message, username));
  connection.on("close", () => handleDisconnection(connection));
};

// Function to handle incoming messages
const handleMessage = (message, username) => {
  const parsedMessage = JSON.parse(message);
  const { method, roomCode, board } = parsedMessage;
  const game = games[roomCode];

  switch (method) {
    case "create_game":
      createGame(username);
      break;

    case "join_game":
      joinGame(roomCode, username);
      break;

    case "start_game":
      startGame(roomCode, board, username);
      break;

    case "move_piece":
      movePiece(roomCode, board);
      break;

    default:
      console.log("Unknown method:", method);
  }
};

// Function to create a new game
const createGame = (username) => {
  const gameId = uuidv4();
  const roomCode = gameId.slice(0, 6);
  const uuid = Object.keys(users).find(uuid => users[uuid].username === username);

  const response = {
    method: "create_game",
    game: {
      user1: {
        username,
        uuid,
      },
      user2: {},
      gameId,
      roomCode,
      board: Array(5).fill().map(() => Array(5).fill("")),
      turn: "user1",
      isGameFinished: false,
      isGameStarted: false,
      isRoomFull: false,
    },
  };

  games[roomCode] = response.game;

  // Check if the connection exists before sending a response
  if (connections[uuid]) {
    connections[uuid].send(JSON.stringify(response));
    console.log(`Game ${gameId} created by ${username} with room code ${roomCode}`);
  } else {
    console.error(`Connection for UUID ${uuid} not found.`);
  }
};

// Function to join an existing game
const joinGame = (roomCode, username) => {
  const game = games[roomCode.toLowerCase()];
  const existingUserUuid = Object.keys(users).find(uuid => users[uuid].username === username);
  if (game && !game.isRoomFull) {
    game.user2 = { username, uuid: existingUserUuid };
    game.isRoomFull = true;

    if (connections[game.user1.uuid]) {
      connections[game.user1.uuid].send(JSON.stringify({ method: "join_game", game }));
    }
    if (connections[existingUserUuid]) {
      connections[existingUserUuid].send(JSON.stringify({ method: "join_game", game }));
    }

    console.log(`${username} joined game with room code ${roomCode}`);
  } else {
    if (connections[existingUserUuid]) {
      connections[existingUserUuid].send(JSON.stringify({ method: "error", message: "Invalid or full room code" }));
    }
  }
};

// Function to start the game
const startGame = (roomCode, board, username) => {
  const game = games[roomCode];

  if (game) {
    game.board = board;
    game.isGameStarted = true;

    if (connections[game.user1.uuid]) {
      connections[game.user1.uuid].send(JSON.stringify({ method: "start_game", game }));
    }
    if (connections[game.user2.uuid]) {
      connections[game.user2.uuid].send(JSON.stringify({ method: "start_game", game }));
    }

    console.log(`Game with room code ${roomCode} started by ${username}`);
  }
};

// Function to handle piece movements
const movePiece = (roomCode, board) => {
  const game = games[roomCode];

  if (game) {
    game.board = board;

    if (connections[game.user1.uuid]) {
      connections[game.user1.uuid].send(JSON.stringify({ method: "update_board", board }));
    }
    if (connections[game.user2.uuid]) {
      connections[game.user2.uuid].send(JSON.stringify({ method: "update_board", board }));
    }

    console.log(`Board updated for game with room code ${roomCode}`);
  }
};

// Function to handle disconnection
const handleDisconnection = (connection) => {
  const uuidToRemove = Object.keys(connections).find(uuid => connections[uuid] === connection);
  if (uuidToRemove) {
    delete connections[uuidToRemove];
    delete users[uuidToRemove];
    console.log(`User ${uuidToRemove} disconnected`);
  }
};

wsServer.on("connection", handleConnection);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
