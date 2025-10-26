import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageListComponent, MessageInputComponent, ChatHeaderComponent], // Make sure this is here
  template: `
    <div class="chat-container">
      <app-chat-header />
      <app-message-list [messages]="messages()" />
      <app-message-input (send)="onSend($event)" />
    </div>
  `,
  styles: [
    `
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 90vh;
        max-height: 800px;
        width: 100%;
        max-width: 480px;
        margin: 20px auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        position: relative; // ADD THIS
      }
    `,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  private socketService = inject(SocketService);
  private messageSubscription?: Subscription;

  // Use signal for reactive state
  messages = signal<Message[]>([]);

  ngOnInit() {
    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((msg) => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            user: 'other',
            type: 'received',
            text: msg,
            time: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            avatar: 'assets/icons/avatar-bot.png',
          },
        ]);
      });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  async onSend(message: Message) {
    // Add user message to UI
    this.messages.update((msgs) => [...msgs, message]);

    // Send to server (just the text)
    try {
      await this.socketService.sendMessage(message.text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
