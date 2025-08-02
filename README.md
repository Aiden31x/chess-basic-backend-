# ♟️ Chess Multiplayer Backend (WebSocket)

This is a simple backend-only multiplayer chess server built using **Node.js**, **WebSockets**, and the **chess.js** library. It manages real-time gameplay between two connected clients by maintaining game state, validating moves, and broadcasting board updates.

---

## 🚀 Features

- Supports **real-time 1v1 chess games** using WebSockets  
- Validates moves using `chess.js`  
- Broadcasts **live board state** and turn info to both players  
- Automatically detects game over conditions  
- Minimal and modular codebase for easy extensibility  

---

## 🛠️ Technologies Used

- **Node.js**  
- **TypeScript**  
- **WebSockets (`ws`)**  
- **chess.js** – for game logic and move validation  

---

## 🔧 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/chess-websocket-backend.git
   cd chess-websocket-backend
2. **Install dependencies**
   ```bash
   npm install

3. **Run the Server**
   ```bash
   cd backend
   tsc -b
   node dist/index.js
