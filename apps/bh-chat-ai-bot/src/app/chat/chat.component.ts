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

/**
 * Main chat component that orchestrates the chat interface
 *
 * @description
 * The ChatComponent serves as the main container for the chat application.
 * It manages the connection between the UI and backend services, handles
 * message flow, and coordinates authentication state. The component uses
 * Angular signals for reactive state management and provides optimistic
 * UI updates for better user experience.
 *
 * @example
 * ```typescript
 * <app-chat></app-chat>
 * ```
 *
 * @remarks
 * This component:
 * - Manages WebSocket connection for real-time messaging
 * - Handles user authentication state
 * - Provides optimistic UI updates
 * - Maintains message history
 * - Auto-scrolls to new messages
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MessageListComponent,
    MessageInputComponent,
    ChatHeaderComponent,
    LoginComponent,
  ],
  templateUrl: 'chat.component.html',
  styleUrl: 'chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly DEFAULT_AVATAR = '😀';
  private readonly SYSTEM_AVATAR = '🔔';

  private readonly socketService = inject(SocketService);
  private readonly userService = inject(UserService);

  private messageSubscription?: Subscription;

  user = computed(() => this.userService.user());
  isLoggedIn = computed(() => this.userService.user() !== null);
  messages = signal<Message[]>([]);

  /**
   * Component initialization lifecycle hook
   *
   * @description
   * Sets up the component by:
   * 1. Loading persisted user data from localStorage
   * 2. Subscribing to incoming socket messages
   * 3. Setting up message handlers
   */
  ngOnInit(): void {
    this.loadUserData();
    this.subscribeToMessages();
  }

  /**
   * Component cleanup lifecycle hook
   *
   * @description
   * Cleans up subscriptions to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.unsubscribeFromMessages();
  }

  /**
   * Handles sending a new message
   *
   * @description
   * Implements optimistic UI updates by immediately adding the message
   * to the local state before confirming with the server. This provides
   * instant feedback to the user while the message is being sent.
   *
   * @param {Message} message - The message to send
   *
   * @example
   * ```typescript
   * const message: Message = {
   *   user: 'Alice',
   *   type: 'sent',
   *   text: 'Hello World',
   *   time: '12:00 PM',
   *   avatar: '😊'
   * };
   * await component.onSend(message);
   * ```
   */
  async onSend(message: Message): Promise<void> {
    this.addMessageToUI(message);

    try {
      await this.sendMessageToServer(message);
    } catch (error) {
      this.handleSendError(error);
    }
  }

  private loadUserData(): void {
    this.userService.loadUser();
  }

  private subscribeToMessages(): void {
    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((msg: string | ServerMessage) => {
        this.handleIncomingMessage(msg);
      });
  }

  private unsubscribeFromMessages(): void {
    this.messageSubscription?.unsubscribe();
  }

  private handleIncomingMessage(msg: string | ServerMessage): void {
    if (typeof msg === 'string') {
      this.handleSystemMessage(msg);
    } else {
      this.handleUserMessage(msg);
    }
  }

  private handleSystemMessage(text: string): void {
    const systemMessage: Message = {
      user: 'System',
      type: 'received',
      text,
      time: this.formatCurrentTime(),
      avatar: this.SYSTEM_AVATAR,
    };

    this.addMessageToUI(systemMessage);
  }

  private handleUserMessage(serverMsg: ServerMessage): void {
    const message: Message = {
      user: serverMsg.username,
      type: 'received',
      text: serverMsg.text,
      time: this.formatTime(serverMsg.time),
      avatar: serverMsg.avatar || this.DEFAULT_AVATAR,
    };

    this.addMessageToUI(message);
  }

  private addMessageToUI(message: Message): void {
    this.messages.update((msgs) => [...msgs, message]);
  }

  private async sendMessageToServer(message: Message): Promise<void> {
    const currentUser = this.userService.user();

    await this.socketService.sendMessage({
      text: message.text,
      username: message.user,
      avatar: currentUser?.avatar || this.DEFAULT_AVATAR,
    });
  }

  private handleSendError(error: unknown): void {
    console.error('Failed to send message:', error);
  }

  private formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatCurrentTime(): string {
    return this.formatTime(new Date().toISOString());
  }
}
