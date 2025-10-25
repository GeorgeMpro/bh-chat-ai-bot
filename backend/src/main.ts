import express from 'express';

import { createServer } from 'node:http';
import { join } from 'node:path';

import { Server } from 'socket.io';

import { Filter } from 'bad-words';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { existsSync } from 'node:fs';

// const host = process.env.HOST ?? 'localhost';

// Recreate __dirname for ES modules
// @ts-expect-error TS1343: import.meta is valid in ES2022
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*', // For development - tighten this in production
    methods: ['GET', 'POST'],
  },
});

// todo
// health check
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});


const publicPath = join(__dirname, 'public');

console.log(`Attempting to serve from: ${publicPath}`);
console.log(`Path exists: ${existsSync(publicPath)}`);

if (!existsSync(publicPath)) {
  console.error(`WARNING: public directory not found at ${publicPath}`);
  console.log(`Current directory: ${process.cwd()}`);
  console.log(`__dirname: ${__dirname}`);
}

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(join(publicPath, 'index.html'));
});

// app.get('/', (req, res) => {
//   res.sendFile(join(publicPath, 'index.html'));
// });

io.on('connection', (socket) => {
  const welcomeMessage = 'Welcome to the server!';
  const usrConnect = 'A new user has connected.';
  const usrDisconnected = 'A user has disconnected.';

  socket.emit('message', welcomeMessage);
  // all but this user

  socket.broadcast.emit('message', usrConnect);

  socket.on('sendMessage', (message, callback) => {
    // Notice: filter for faul language
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity not allowed.');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', usrDisconnected);
    console.log(usrDisconnected);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[ ready ] Server listening on port ${port}`);
});
