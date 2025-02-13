import React, { useState } from 'react';
import axios from 'axios';

const RoomManagement = () => {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  
  const createRoom = async () => {
    try {
      const response = await axios.post('/api/rooms/create');
      setRoomCode(response.data.roomCode);
      // Generate shareable link
      const shareableLink = `${window.location.origin}/join/${response.data.roomCode}`;
      alert(`Room created! Share this code with students: ${response.data.roomCode}\n\nOr share this link:\n${shareableLink}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rooms/join', { roomCode, username });
      // Handle successful join
    } catch (error) {
      alert('Failed to join room. Please check the room code.');
    }
  };

  return (
    <div className="room-management">
      <div className="user-type-selection">
        <button onClick={() => setIsTeacher(true)}>I'm a Teacher</button>
        <button onClick={() => setIsTeacher(false)}>I'm a Student</button>
      </div>

      {isTeacher ? (
        <div className="teacher-panel">
          <h2>Teacher Controls</h2>
          <button onClick={createRoom}>Create New Room</button>
          {roomCode && (
            <div className="room-info">
              <h3>Room Code: {roomCode}</h3>
              <p>Share this code with your students</p>
            </div>
          )}
        </div>
      ) : (
        <div className="student-panel">
          <h2>Join Classroom</h2>
          <form onSubmit={joinRoom}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit">Join Room</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoomManagement; 