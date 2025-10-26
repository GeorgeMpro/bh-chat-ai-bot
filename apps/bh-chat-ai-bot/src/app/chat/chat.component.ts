import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { SocketService } from '../services/socket.service';
import { Subscription } from 'rxjs';
import { Message, ServerMessage } from '../models/message.model';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MessageListComponent,
    MessageInputComponent,
    ChatHeaderComponent,
    LoginComponent,
  ],
  template: `
    @if (!user()) {
    <app-login />
    } @else {
    <div class="chat-container">
      <app-chat-header [user]="user()" />
      <app-message-list [messages]="messages()" />
      <app-message-input (send)="onSend($event)" />
    </div>
    @if (!isLoggedIn()) {
    <app-login />
    } }
  `,
  styles: [
    `
      @use '../../styles/variables' as *;

      .chat-container {
        display: flex;
        flex-direction: column;
        height: 90vh;
        width: 100%;
        max-width: 900px;
        margin: 20px auto;
        background: white;
        border-radius: $border-radius-3;
        box-shadow: $chat-shadow;
        overflow: hidden;
        position: relative;
      }
    `,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  private socketService = inject(SocketService);
  private userService = inject(UserService);
  private messageSubscription?: Subscription;

  user = computed(() => this.userService.user());
  isLoggedIn = computed(() => this.userService.user() !== null);
  messages = signal<Message[]>([]);

  ngOnInit() {
    this.userService.loadUser();

    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((msg: string | ServerMessage) => {
        if (typeof msg === 'string') {
          this.messages.update((list) => [
            ...list,
            {
              user: 'System',
              type: 'received',
              text: msg,
              time: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              avatar: '🔔', // System notification icon
            },
          ]);
          return;
        }

        const serverMsg = msg as ServerMessage;
        this.messages.update((list) => [
          ...list,
          {
            user: serverMsg.username,
            type: 'received',
            text: serverMsg.text,
            time: new Date(serverMsg.time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            avatar: serverMsg.avatar || '😀', // Use avatar from server
          },
        ]);
      });
  }
  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  async onSend(message: Message) {
    // Optimistic UI update
    this.messages.update((msgs) => [...msgs, message]);

    try {
      const currentUser = this.userService.user();

      // ✅ STEP 3C: Send message with avatar to server
      await this.socketService.sendMessage({
        text: message.text,
        username: message.user,
        avatar: currentUser?.avatar || '😀',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
