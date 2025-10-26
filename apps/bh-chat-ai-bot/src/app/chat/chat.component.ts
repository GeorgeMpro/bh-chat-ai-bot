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
import { Message } from '../models/message.model';
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
  ], // Make sure this is here
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

  // Use signal for reactive state
  messages = signal<Message[]>([]);

  ngOnInit() {
    // keep if you already call it
    if ((this as any).userService?.loadUser) {
      (this as any).userService.loadUser();
    }

    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((msg: any) => {
        const isObj = msg && typeof msg === 'object';

        const username = isObj ? String(msg.username ?? 'system') : 'system';
        const text = isObj ? String(msg.text ?? '') : String(msg ?? '');
        const when = isObj && msg.time ? new Date(msg.time) : new Date();

        this.messages.update((list) => [
          ...list,
          {
            user: username, // <-- show username from server
            type: 'received',
            text,
            time: when.toLocaleTimeString('en-US', {
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
    // optimistic UI
    this.messages.update((msgs) => [...msgs, message]);

    try {
      await this.socketService.sendMessage({
        text: message.text,
        username: message.user,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}
