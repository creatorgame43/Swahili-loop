// 🎮 Swahili Loop Backend Server
// Multi-Game Platform

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const startGameAPI = require('./api/games/start-game');
const earnCoinsAPI = require('./api/coins/earn');
const withdrawCoinsAPI = require('./api/coins/withdraw');
const leaderboardAPI = require('./api/leaderboard/global');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Swahili Loop Backend' });
});

// Game API routes
app.post('/api/games/start', startGameAPI);
app.post('/api/coins/earn', earnCoinsAPI);
app.post('/api/coins/withdraw', withdrawCoinsAPI);
app.get('/api/leaderboard/global', leaderboardAPI);

// Real-time multiplayer events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game-room', (data) => {
    socket.join(`game_${data.gameType}`);
    io.to(`game_${data.gameType}`).emit('player-joined', {
      userId: data.userId,
      gameType: data.gameType,
      timestamp: new Date()
    });
  });

  socket.on('game-action', (data) => {
    io.to(`game_${data.gameType}`).emit('action-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Swahili Loop Backend running on port ${PORT}`);
  console.log('Games available: Pool Table Pro, Quiz Master, Tropical Crush, Card Masters');
});

module.exports = { app, io };
