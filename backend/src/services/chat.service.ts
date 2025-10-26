import { Filter } from 'bad-words';
import { getBotResponse, shouldBotRespond } from './bot.service.js';
import { Server, Socket } from 'socket.io';

const welcomeMessage = 'Welcome to the server!';
const usrConnect = 'A new user has connected.';
const usrDisconnected = 'A user has disconnected.';

type InPayload = string | { text: string; username?: string };
type OutPayload = { username: string; text: string; time: string };
export function registerChatHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    let username = 'anonymous';

    // system notes (strings are fine here)
    socket.emit('message', welcomeMessage);
    socket.broadcast.emit('message', usrConnect);

    socket.on(
      'sendMessage',
      async (message: InPayload, callback: (err?: string) => void) => {
        const isObj = typeof message === 'object' && message !== null;
        const rawText = (isObj ? message.text : message) ?? '';
        const incomingName = isObj ? message.username : undefined;

        if (incomingName && incomingName.trim()) username = incomingName.trim();

        const text = String(rawText).trim();
        if (!text) return callback?.();

        const filter = new Filter();
        if (filter.isProfane(text)) return callback?.('Profanity not allowed.');

        // ✅ Emit ONE structured message (includes username)
        const out: OutPayload = {
          username,
          text,
          time: new Date().toISOString(),
        };
        socket.broadcast.emit('message', out);

        // ❌ REMOVE this line – it caused the duplicate plain-string echo:
        // socket.broadcast.emit('message', message);

        // Optional bot reply (send structured too, or keep as string if you prefer)
        if (shouldBotRespond(text)) {
          try {
            const botText = await getBotResponse(text);
            const botOut: OutPayload = {
              username: 'bot',
              text: botText,
              time: new Date().toISOString(),
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
