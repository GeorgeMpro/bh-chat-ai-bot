import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServerMessage } from '../models/message.model';
import { MessagePayload } from '../models/payload.model';

/**
 * Service for managing WebSocket connections and real-time communication
 *
 * @description
 * Handles bidirectional communication with the backend server using Socket.IO.
 * Provides methods for sending messages and listening to incoming messages.
 * Automatically handles connection, disconnection, and reconnection.
 *
 * @example
 * ```typescript
 * constructor(private socketService: SocketService) {
 *   this.socketService.onMessage().subscribe(msg => {
 *     console.log('Received:', msg);
 *   });
 * }
 * ```
 *
 * @export
 * @class SocketService
 */
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly socket: Socket;
  private isConnected = false;

  constructor() {
    this.socket = this.initializeSocket();
    this.setupConnectionHandlers();
  }

  /**
   * Sends a message to the server
   *
   * @description
   * Emits a message to the server via WebSocket. Supports both string messages
   * and structured message objects with username and avatar. Returns a promise
   * that resolves when the server acknowledges receipt, or rejects on error.
   *
   * @param {MessagePayload} message - The message to send (string or object)
   * @returns {Promise<void>} Promise that resolves on success
   *
   * @example
   * ```typescript
   * // Send simple message
   * await this.socketService.sendMessage('Hello World');
   *
   * // Send structured message
   * await this.socketService.sendMessage({
   *   text: 'Hello',
   *   username: 'Alice',
   *   avatar: '😊'
   * });
   * ```
   *
   * @throws {string} Server error message (e.g., 'Profanity not allowed.')
   */
  sendMessage(message: MessagePayload): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject('Not connected to server');
        return;
      }

      this.socket.emit('sendMessage', message, (error?: string) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Creates an observable stream of incoming messages
   *
   * @description
   * Returns an Observable that emits incoming messages from the server.
   * Messages can be either system notifications (strings) or structured
   * messages (ServerMessage objects). The observable automatically cleans
   * up its subscription on unsubscribe.
   *
   * @returns {Observable<string | ServerMessage>} Stream of incoming messages
   *
   * @example
   * ```typescript
   * this.socketService.onMessage().subscribe({
   *   next: (msg) => {
   *     if (typeof msg === 'string') {
   *       console.log('System:', msg);
   *     } else {
   *       console.log('Message from', msg.username);
   *     }
   *   },
   *   error: (err) => console.error('Socket error:', err)
   * });
   * ```
   */
  onMessage(): Observable<string | ServerMessage> {
    return new Observable((observer) => {
      const handler = (msg: string | ServerMessage) => {
        observer.next(msg);
      };

      this.socket.on('message', handler);

      // Cleanup on unsubscribe
      return () => {
        this.socket.off('message', handler);
      };
    });
  }

  reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }

  private initializeSocket(): Socket {
    return io(environment.apiUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }

  private setupConnectionHandlers(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logConnection('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.logConnection(`Disconnected from server: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      this.logConnection(`Reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect to server');
    });
  }

  private logConnection(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}
