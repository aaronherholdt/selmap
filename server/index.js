import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const rooms = new Map();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? "https://sel-interactive-map-client.onrender.com"
    : "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? "https://sel-interactive-map-client.onrender.com"
      : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('SEL Interactive Map Server is running');
});

app.post('/api/rooms/create', (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  rooms.set(roomCode, {
    participants: [],
    createdAt: new Date()
  });
  res.json({ roomCode });
});

app.post('/api/rooms/join', (req, res) => {
  const { roomCode, username } = req.body;
  if (!rooms.has(roomCode)) {
    return res.status(404).json({ error: 'Room not found' });
  }
  const room = rooms.get(roomCode);
  room.participants.push(username);
  res.json({ success: true });
});

// Use httpServer instead of app.listen
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
