const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Configuration constants for the Fight Game server
const PORT = process.env.PORT || 3000;
const MAX_HP = 100;
const BASE_DAMAGE = 10;

// Create the core Express application and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io on top of the HTTP server with basic CORS defaults
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Simple in-memory state to track connected players and their moves per round
const players = new Map();
let roundMoves = new Map();

/**
 * Helper to create a fresh player state when a user connects.
 * @param {string} socketId - Unique socket identifier for the player.
 */
function createPlayer(socketId) {
  return {
    id: socketId,
    hp: MAX_HP,
  };
}

/**
 * Helper that resets round-specific data when a new round starts.
 */
function resetRound() {
  roundMoves = new Map();
}

/**
 * Broadcast the latest snapshot of the game state to all clients.
 */
function broadcastState() {
  const state = {
    players: Array.from(players.values()),
  };
  io.emit('state-update', state);
}

/**
 * Evaluate the recorded moves for the active round and apply damage.
 */
function resolveRound() {
  const playerEntries = Array.from(roundMoves.entries());

  if (playerEntries.length !== 2) {
    return; // Wait until both players have submitted moves
  }

  // Extract player references and their chosen actions
  const [playerAId, moveA] = playerEntries[0];
  const [playerBId, moveB] = playerEntries[1];
  const playerA = players.get(playerAId);
  const playerB = players.get(playerBId);

  if (!playerA || !playerB) {
    return;
  }

  // Determine damage from A to B
  const damageToB = moveB.block === moveA.attack ? 0 : BASE_DAMAGE;
  playerB.hp = Math.max(0, playerB.hp - damageToB);

  // Determine damage from B to A
  const damageToA = moveA.block === moveB.attack ? 0 : BASE_DAMAGE;
  playerA.hp = Math.max(0, playerA.hp - damageToA);

  // Reset round data and broadcast the updated state
  resetRound();
  broadcastState();
}

// Serve a basic health-check endpoint
app.get('/', (req, res) => {
  res.send('Fight Game server is running');
});

// Handle socket.io connections for multiplayer gameplay
io.on('connection', (socket) => {
  // Register the player and sync the current game state
  players.set(socket.id, createPlayer(socket.id));
  broadcastState();

  // When a player submits their attack/block choices for the round
  socket.on('player-move', ({ attack, block }) => {
    if (!players.has(socket.id)) {
      return;
    }

    // Store the player's chosen actions for the current round
    roundMoves.set(socket.id, { attack, block });

    // Evaluate the round once both players have responded
    resolveRound();
  });

  // Clean up when a player disconnects from the server
  socket.on('disconnect', () => {
    players.delete(socket.id);
    roundMoves.delete(socket.id);

    // Reset the game when fewer than two players remain connected
    if (players.size < 2) {
      for (const player of players.values()) {
        player.hp = MAX_HP;
      }
      resetRound();
    }

    broadcastState();
  });
});

// Start listening for incoming HTTP and WebSocket connections
server.listen(PORT, () => {
  console.log(`Fight Game server listening on port ${PORT}`);
});
