import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Filter } from 'bad-words';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*', // For development - will tighten for production
    methods: ['GET', 'POST'],
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const welcomeMessage = 'Welcome to the server!';
  const usrConnect = 'A new user has connected.';
  const usrDisconnected = 'A user has disconnected.';

  console.log('User connected:', socket.id);

  socket.emit('message', welcomeMessage);
  socket.broadcast.emit('message', usrConnect);

  socket.on('sendMessage', (message, callback) => {
    // Filter for profanity
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity not allowed.');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', usrDisconnected);
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
