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

class MessageHistory {
  private messages: OutPayload[] = [];
  private readonly MAX_MESSAGES = 20;

  add(message: OutPayload): void {
    this.messages.push(message);
    if (this.messages.length > this.MAX_MESSAGES) {
      this.messages.shift();
    }
  }

  getAll(): OutPayload[] {
    return [...this.messages];
  }
}

const messageHistory = new MessageHistory();

export function registerChatHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    let username = 'anonymous';
    let userAvatar = '😀';
    socket.emit('message', welcomeMessage);

    // sending new user history
    const history = messageHistory.getAll();
    history.forEach((msg) => socket.emit('message', msg));

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
          avatar: userAvatar,
        };
        // message history storage
        messageHistory.add(out);

        socket.broadcast.emit('message', out);

        if (shouldBotRespond(text)) {
          try {
            const botText = await getBotResponse(text);
            const botOut: OutPayload = {
              username: 'Bot',
              text: botText,
              time: new Date().toISOString(),
              avatar: '🤖',
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
