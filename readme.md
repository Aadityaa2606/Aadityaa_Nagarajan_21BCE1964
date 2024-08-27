
## Game Description

This is a two-player, turn-based strategy game played on a 5x5 grid. Players place five pieces on their starting row and take turns moving them across the board to capture or eliminate the opponent's pieces.

### Pieces and Moves

- **P1 (Pawn)**: Moves one step in any direction (L, R, F, B).
- **H1 (Horse)**: Moves two steps in straight lines (L, R, F, B).
- **H2 (Knight)**: Moves two steps diagonally (FL, FR, BL, BR).

### Objective

The objective of the game is to eliminate all of the opponent's pieces. The game ends when one player has no pieces left on the board.

## Setup Instructions

### Prerequisites

- Node.js (version 14.x or higher)
- npm (Node Package Manager)

### Server Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/turn-based-grid-game.git
    cd turn-based-grid-game
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### Client Setup

1. **Open the client in a web browser:**
    Navigate to `http://localhost:3000` in your web browser.

2. **Join the game:**
    - Enter a username and click "Join Game".
    - If the room is full (more than two players), you'll receive a "Room Full" message.

3. **Playing the game:**
    - Place your pieces on the starting row.
    - Take turns with your opponent to move pieces across the board.
    - The game will automatically switch turns after each move.
    - The game ends when one player's pieces are all eliminated.

## Troubleshooting

- **No Role Assigned or Errors:** If you don't see role assignment or receive error messages, check the server logs for any issues.
- **WebSocket Connection Issues:** Ensure your server is running and accessible at `http://localhost:3000`.

