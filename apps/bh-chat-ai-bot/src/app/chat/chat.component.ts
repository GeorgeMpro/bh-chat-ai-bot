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
  /** Socket service for real-time communication */
  private readonly socketService = inject(SocketService);

  /** User service for authentication and user state */
  private readonly userService = inject(UserService);

  /** Subscription to incoming messages */
  private messageSubscription?: Subscription;

  /** Default avatar for users without custom avatar */
  private readonly DEFAULT_AVATAR = '😀';

  /** Default avatar for system messages */
  private readonly SYSTEM_AVATAR = '🔔';

  /** Computed signal for current user */
  user = computed(() => this.userService.user());

  /** Computed signal for login state */
  isLoggedIn = computed(() => this.userService.user() !== null);

  /** Signal containing all chat messages */
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
    // Optimistic UI update
    this.addMessageToUI(message);

    try {
      await this.sendMessageToServer(message);
    } catch (error) {
      this.handleSendError(error);
    }
  }

  /**
   * Loads user data from localStorage
   *
   * @private
   */
  private loadUserData(): void {
    this.userService.loadUser();
  }

  /**
   * Subscribes to incoming socket messages
   *
   * @private
   */
  private subscribeToMessages(): void {
    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((msg: string | ServerMessage) => {
        this.handleIncomingMessage(msg);
      });
  }

  /**
   * Unsubscribes from socket messages
   *
   * @private
   */
  private unsubscribeFromMessages(): void {
    this.messageSubscription?.unsubscribe();
  }

  /**
   * Handles incoming messages from the server
   *
   * @private
   * @param {string | ServerMessage} msg - The incoming message
   */
  private handleIncomingMessage(msg: string | ServerMessage): void {
    if (typeof msg === 'string') {
      this.handleSystemMessage(msg);
    } else {
      this.handleUserMessage(msg);
    }
  }

  /**
   * Handles system notification messages
   *
   * @private
   * @param {string} text - The system message text
   */
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

  /**
   * Handles user messages from the server
   *
   * @private
   * @param {ServerMessage} serverMsg - The server message object
   */
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

  /**
   * Adds a message to the UI state
   *
   * @private
   * @param {Message} message - The message to add
   */
  private addMessageToUI(message: Message): void {
    this.messages.update((msgs) => [...msgs, message]);
  }

  /**
   * Sends a message to the server via WebSocket
   *
   * @private
   * @param {Message} message - The message to send
   * @throws {Error} If sending fails
   */
  private async sendMessageToServer(message: Message): Promise<void> {
    const currentUser = this.userService.user();

    await this.socketService.sendMessage({
      text: message.text,
      username: message.user,
      avatar: currentUser?.avatar || this.DEFAULT_AVATAR,
    });
  }

  /**
   * Handles errors when sending messages
   *
   * @private
   * @param {unknown} error - The error that occurred
   */
  private handleSendError(error: unknown): void {
    console.error('Failed to send message:', error);

    // Could add user notification here
    // this.notificationService.showError('Failed to send message');
  }

  /**
   * Formats a timestamp string to local time
   *
   * @private
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time string (e.g., "12:30 PM")
   */
  private formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formats the current time
   *
   * @private
   * @returns {string} Formatted current time
   */
  private formatCurrentTime(): string {
    return this.formatTime(new Date().toISOString());
  }
}
