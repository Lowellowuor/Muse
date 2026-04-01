const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const threadRoutes = require('./routes/threads');
const journalRoutes = require('./routes/journal');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/user', userRoutes);

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(`room-${roomId}`);
  });
  
  socket.on('new-thread', (thread) => {
    io.emit('thread-created', thread);
  });
  
  socket.on('new-comment', (data) => {
    io.to(`thread-${data.threadId}`).emit('comment-added', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});