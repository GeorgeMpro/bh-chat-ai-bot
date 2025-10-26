import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { ServerMessage } from '../models/message.model';
import { Socket } from 'socket.io-client';

// Mock Socket.IO
jest.mock('socket.io-client');

describe('SocketService', () => {
  let service: SocketService;
  let mockSocket: Partial<Socket>;

  beforeEach(() => {
    // Create mock socket
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      off: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    };

    // Mock the io() constructor
    (require('socket.io-client') as any).io = jest
      .fn()
      .mockReturnValue(mockSocket);

    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should create socket connection on initialization', () => {
      const io = require('socket.io-client').io;
      expect(io).toHaveBeenCalled();
    });

    it('should set up connect event handler', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        'connect',
        expect.any(Function)
      );
    });

    it('should set up disconnect event handler', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        'disconnect',
        expect.any(Function)
      );
    });

    it('should log connection status', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Find and execute the connect callback
      const connectCall = (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'connect'
      );
      connectCall[1]();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Connected')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('onMessage', () => {
    it('should create observable for message events', (done) => {
      const testMessage: ServerMessage = {
        username: 'TestUser',
        text: 'Hello',
        time: new Date().toISOString(),
        avatar: '😊',
      };

      const observable = service.onMessage();

      observable.subscribe((msg) => {
        expect(msg).toEqual(testMessage);
        done();
      });

      // Find and execute the message handler
      const messageHandler = (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'message'
      );
      if (messageHandler) messageHandler[1](testMessage);
    });

    it('should handle string messages', (done) => {
      const testMessage = 'System message';

      const observable = service.onMessage();

      observable.subscribe((msg) => {
        expect(msg).toBe(testMessage);
        done();
      });

      const messageHandler = (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'message'
      );
      if (messageHandler) messageHandler[1](testMessage);
    });

    it('should handle multiple messages', (done) => {
      const messages: ServerMessage[] = [
        {
          username: 'User1',
          text: 'Hi',
          time: new Date().toISOString(),
          avatar: '😊',
        },
        {
          username: 'User2',
          text: 'Hello',
          time: new Date().toISOString(),
          avatar: '🚀',
        },
      ];

      const receivedMessages: (string | ServerMessage)[] = [];
      const observable = service.onMessage();

      observable.subscribe((msg) => {
        receivedMessages.push(msg);
        if (receivedMessages.length === messages.length) {
          expect(receivedMessages).toEqual(messages);
          done();
        }
      });

      const messageHandler = (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'message'
      );
      messages.forEach((msg) => {
        if (messageHandler) messageHandler[1](msg);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle reconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Simulate reconnection
      const connectHandler = (mockSocket.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'connect'
      );
      if (connectHandler) connectHandler[1]();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
