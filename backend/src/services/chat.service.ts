import { Filter } from 'bad-words';
import { getBotResponse, shouldBotRespond } from './bot.service.js';
import { Server } from 'socket.io';

export function registerChatHandlers(io: Server): void {
  io.on('connection', (socket) => {
    const welcomeMessage = 'Welcome to the server!';
    const usrConnect = 'A new user has connected.';
    const usrDisconnected = 'A user has disconnected.';

    socket.emit('message', welcomeMessage);
    socket.broadcast.emit('message', usrConnect);

    socket.on('sendMessage', async (message, callback) => {
      const filter = new Filter();
      if (filter.isProfane(message)) {
        return callback('Profanity not allowed.');
      }

      // Broadcast user message to others
      socket.broadcast.emit('message', message);

      // Check if bot should respond
      if (shouldBotRespond(message)) {
        try {
          const botResponse = await getBotResponse(message);
          // Send bot response to everyone
          io.emit('message', `🤖 HelpBot: ${botResponse}`);
        } catch (error) {
          console.error('Bot error:', error);
        }
      }

      callback();
    });

    socket.on('disconnect', () => {
      io.emit('message', usrDisconnected);
      console.log('User disconnected:', socket.id);
    });
  });
}
