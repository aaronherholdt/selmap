const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Store active rooms
const rooms = new Map();

io.on('connection', (socket) => {
  // Handle room joining
  socket.on('joinRoom', ({ roomCode, studentName }) => {
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, new Set());
    }
    
    const room = rooms.get(roomCode);
    room.add({ id: socket.id, name: studentName });
    
    socket.join(roomCode);
    
    // Broadcast updated room status
    io.to(roomCode).emit('roomUpdate', {
      members: Array.from(room).map(member => ({
        id: member.id,
        name: member.name
      }))
    });
    
    // Start game if room is full (3 students)
    if (room.size === 3) {
      io.to(roomCode).emit('startGame');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    rooms.forEach((members, roomCode) => {
      members.forEach(member => {
        if (member.id === socket.id) {
          members.delete(member);
          io.to(roomCode).emit('roomUpdate', {
            members: Array.from(members).map(m => ({
              id: m.id,
              name: m.name
            }))
          });
        }
      });
    });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Generate room code (add to server.js)
app.post('/api/createRoom', (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  rooms.set(roomCode, new Set());
  res.json({ roomCode });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
