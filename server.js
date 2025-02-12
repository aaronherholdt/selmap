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

// Fixed room code for testing
const ROOM_CODE = 'GAME123';
rooms.set(ROOM_CODE, new Set());

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomCode, studentName }) => {
    if (roomCode === ROOM_CODE) {
      const room = rooms.get(ROOM_CODE);
      
      if (room.size < 3) {
        // Use the provided student name instead of generic "Student X"
        room.add({ id: socket.id, name: studentName });
        socket.join(ROOM_CODE);
        
        io.to(ROOM_CODE).emit('roomUpdate', {
          members: Array.from(room).map(member => ({
            id: member.id,
            name: member.name
          }))
        });
        
        // Start game if room is full (3 students)
        if (room.size === 3) {
          io.to(ROOM_CODE).emit('startGame');
        }
      } else {
        // Room is full
        socket.emit('roomFull');
      }
    } else {
      // Invalid room code
      socket.emit('invalidRoom');
    }
  });

  socket.on('disconnect', () => {
    const room = rooms.get(ROOM_CODE);
    room.forEach(member => {
      if (member.id === socket.id) {
        room.delete(member);
        io.to(ROOM_CODE).emit('roomUpdate', {
          members: Array.from(room).map(m => ({
            id: m.id,
            name: m.name
          }))
        });
      }
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
  console.log(`Room Code: ${ROOM_CODE}`);
});
