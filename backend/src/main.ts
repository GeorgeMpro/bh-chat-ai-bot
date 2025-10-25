import express from 'express';

import { createServer } from 'node:http';
import { join } from 'node:path';

import { Server } from 'socket.io';

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
  console.log('User connected.');


  // socket.emit('countUpdated', count);
  // socket.on('increment', () => {
  //   count++;
  //   notice: emits to all clients
  // io.emit('countUpdated', count);
  // });
  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
