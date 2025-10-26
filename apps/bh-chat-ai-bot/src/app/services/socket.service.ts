import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServerMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl);

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });
  }


  sendMessage(
    message: string | { text: string; username: string; avatar: string }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('sendMessage', message, (error?: string) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }


  onMessage(): Observable<string | ServerMessage> {
    return new Observable((observer) => {
      this.socket.on('message', (msg: string | ServerMessage) => {
        observer.next(msg);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }
}
