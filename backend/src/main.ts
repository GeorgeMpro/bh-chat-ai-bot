import express from 'express';

import { createServer } from 'node:http';
import { join } from 'node:path';

import { Server } from 'socket.io';

import { Filter } from 'bad-words';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

export const io = new Server(server);

const appDir = process.cwd(); // Use the current working directory

app.use(express.static(join(appDir, 'backend/src/public')));

app.use(express.static(join(appDir, 'backend/src/public')));
app.get('/', (req, res) => {
  res.sendFile(join(appDir, 'index.html'));
});

// let count = 0;
io.on('connection', (socket) => {
  const welcomeMessage = 'Welcome to the server!';
  const usrConnect = 'A new user has connected.';
  const usrDisconnected = 'A user has disconnected.';

  socket.emit('message', welcomeMessage);
  // all but this user

  socket.broadcast.emit('message', usrConnect);

  socket.on('sendMessage', (message, callback) => {
    // Notice: filter for faul langauge
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

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
