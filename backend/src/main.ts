import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { registerChatHandlers } from './services/chat.service.js';

// @ts-expect-error TS1343: import.meta is valid in ES2022
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

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

registerChatHandlers(io);

// Start
server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
