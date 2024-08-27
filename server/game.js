// server/game.js

class Game {
    constructor() {
      this.gridSize = 5;
      this.players = ['A', 'B'];
      this.resetGame();
    }
  
    resetGame() {
      this.board = Array(this.gridSize)
        .fill(null)
        .map(() => Array(this.gridSize).fill(null));
      this.currentPlayer = 'A';
      this.isGameOver = false;
      this.winner = null;
    }
  
    placePieces(player, pieces) {
      if (player !== this.currentPlayer) {
        throw new Error('Its not your turn!');
      }
      if (pieces.length !== 5) {
        throw new Error('You must place 5 pieces.');
      }
      this.board[this.getStartingRow(player)] = pieces.map((piece, index) => ({
        player,
        type: piece,
        x: index,
        y: this.getStartingRow(player),
      }));
      this.switchTurn();
    }
  
    getStartingRow(player) {
      return player === 'A' ? 0 : this.gridSize - 1;
    }
  
    movePiece(player, fromX, fromY, direction) {
      if (player !== this.currentPlayer) {
        throw new Error('Its not your turn!');
      }
      const piece = this.board[fromY][fromX];
      if (!piece || piece.player !== player) {
        throw new Error('Invalid piece selection.');
      }
  
      const [newX, newY] = this.calculateNewPosition(fromX, fromY, piece.type, direction);
      this.validateMove(piece, newX, newY);
  
      // Move the piece
      this.board[fromY][fromX] = null;
      this.board[newY][newX] = piece;
      piece.x = newX;
      piece.y = newY;
  
      // Check for game over
      this.checkGameOver();
  
      this.switchTurn();
    }
  
    calculateNewPosition(x, y, type, direction) {
      const moves = {
        P1: { L: [-1, 0], R: [1, 0], F: [0, -1], B: [0, 1] },
        H1: { L: [-2, 0], R: [2, 0], F: [0, -2], B: [0, 2] },
        H2: { FL: [-2, -2], FR: [2, -2], BL: [-2, 2], BR: [2, 2] },
      };
      const move = moves[type][direction];
      return [x + move[0], y + move[1]];
    }
  
    validateMove(piece, x, y) {
      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
        throw new Error('Move out of bounds.');
      }
      const target = this.board[y][x];
      if (target && target.player === piece.player) {
        throw new Error('Cannot move to a position occupied by a friendly piece.');
      }
      // Handle combat
      if (target && target.player !== piece.player) {
        this.board[y][x] = null; // Remove opponent's piece
      }
    }
  
    switchTurn() {
      this.currentPlayer = this.currentPlayer === 'A' ? 'B' : 'A';
    }
  
    checkGameOver() {
      const pieces = this.board.flat().filter((piece) => piece);
      const playersLeft = [...new Set(pieces.map((piece) => piece.player))];
      if (playersLeft.length === 1) {
        this.isGameOver = true;
        this.winner = playersLeft[0];
      }
    }
  
    getGameState() {
      return {
        board: this.board,
        currentPlayer: this.currentPlayer,
        isGameOver: this.isGameOver,
        winner: this.winner,
      };
    }
  }
  
  module.exports = Game;
  