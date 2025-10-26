import { Filter } from 'bad-words';
import { getBotResponse, shouldBotRespond } from './bot.service.js';
import { Server, Socket } from 'socket.io';

const welcomeMessage = 'Welcome to the server!';
const usrConnect = 'A new user has connected.';
const usrDisconnected = 'A user has disconnected.';

type InPayload = string | { text: string; username?: string; avatar?: string };

type OutPayload = {
  username: string;
  text: string;
  time: string;
  avatar: string;
};
export function registerChatHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    let username = 'anonymous';
    let userAvatar = '😀';
    // system notes (strings are fine here)
    socket.emit('message', welcomeMessage);
    socket.broadcast.emit('message', usrConnect);

    socket.on(
      'sendMessage',
      async (message: InPayload, callback: (err?: string) => void) => {
        const isObj = typeof message === 'object' && message !== null;
        const rawText = (isObj ? message.text : message) ?? '';
        const incomingName = isObj ? message.username : undefined;
        const incomingAvatar = isObj ? message.avatar : undefined;

        if (incomingName && incomingName.trim()) username = incomingName.trim();
        if (incomingAvatar && incomingAvatar.trim()) {
          userAvatar = incomingAvatar.trim();
        }

        const text = String(rawText).trim();
        if (!text) return callback?.();

        const filter = new Filter();
        if (filter.isProfane(text)) return callback?.('Profanity not allowed.');

        const out: OutPayload = {
          username,
          text,
          time: new Date().toISOString(),
          avatar: userAvatar, // Include user's avatar
        };
        socket.broadcast.emit('message', out);

        if (shouldBotRespond(text)) {
          try {
            const botText = await getBotResponse(text);
            const botOut: OutPayload = {
              username: 'Bot',
              text: botText,
              time: new Date().toISOString(),
              avatar: '🤖', // Bot emoji
            };
            io.emit('message', botOut);
          } catch (error) {
            console.error('Bot error:', error);
          }
        }

        callback?.();
      }
    );

    socket.on('disconnect', () => {
      io.emit('message', usrDisconnected);
      console.log('User disconnected:', socket.id);
    });
  });
}
