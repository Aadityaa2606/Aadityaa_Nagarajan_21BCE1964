// server/index.js
const express = require('express');
const http = require('http');
const setupWebSocket = require('./websocket');

const app = express();
const server = http.createServer(app);

// Serve static files (e.g., the client side)
app.use(express.static('public'));

// Initialize WebSocket
setupWebSocket(server);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
