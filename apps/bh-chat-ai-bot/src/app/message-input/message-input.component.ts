import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';
import { UserService } from '../services/user.service';

/**
 * Message input component for composing and sending messages
 *
 * @description
 * The MessageInputComponent provides a text input field and send button
 * for composing chat messages. It validates input, formats messages,
 * and emits them to the parent component. Supports Enter key for quick sending.
 *
 * @example
 * ```typescript
 * <app-message-input
 *   (send)="onMessageSent($event)"
 *   [disabled]="isDisconnected">
 * </app-message-input>
 * ```
 */
@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <footer class="chat-input">
      <input
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="messageText"
        (keyup.enter)="handleSend()"
        [disabled]="disabled()"
        aria-label="Message input"
      />
      <button
        class="send-button"
        (click)="handleSend()"
        [disabled]="!canSend()"
        aria-label="Send message"
      >
        {{ sendButtonText }}
      </button>
    </footer>
  `,
  styleUrl: 'message-input.component.scss',
})
export class MessageInputComponent {
  /** User service for current user info */
  private readonly userService = inject(UserService);

  /** UI text constants */
  protected readonly placeholder = 'Type a message…';
  protected readonly sendButtonText = 'Send';

  /** Event emitted when a message is sent */
  send = output<Message>();

  /** Current message text being composed */
  protected messageText = '';

  /**
   * Whether the input is disabled
   *
   * @description
   * Can be used to disable input during connection issues
   * or while waiting for server response.
   */
  disabled = input<boolean>(false);

  /**
   * Handles send button click or Enter key press
   *
   * @description
   * Validates the message, creates a Message object with
   * current user info and timestamp, emits it to parent,
   * and clears the input field.
   *
   * @example
   * ```typescript
   * // User types "Hello" and presses Enter
   * handleSend(); // Emits message and clears input
   * ```
   */
  protected handleSend(): void {
    if (this.canSend()) {
      const message = this.createMessage();
      this.emitMessage(message);
      this.clearInput();
    }
  }

  /**
   * Checks if a message can be sent
   *
   * @returns {boolean} True if message is valid and user is logged in
   */
  protected canSend(): boolean {
    return this.hasValidMessage() && this.hasCurrentUser() && !this.disabled();
  }

  /**
   * Checks if message text is valid
   *
   * @private
   * @returns {boolean} True if message is not empty
   */
  private hasValidMessage(): boolean {
    return this.messageText.trim().length > 0;
  }

  /**
   * Checks if user is logged in
   *
   * @private
   * @returns {boolean} True if user exists
   */
  private hasCurrentUser(): boolean {
    return this.userService.user() !== null;
  }

  /**
   * Creates a Message object from current input
   *
   * @private
   * @returns {Message} The formatted message
   * @throws {Error} If no user is logged in
   */
  private createMessage(): Message {
    const user = this.userService.user();

    if (!user) {
      throw new Error('Cannot create message: No user logged in');
    }

    return {
      user: user.username,
      type: 'sent',
      text: this.messageText.trim(),
      time: this.formatCurrentTime(),
      avatar: user.avatar,
    };
  }

  /**
   * Emits the message to parent component
   *
   * @private
   * @param {Message} message - The message to emit
   */
  private emitMessage(message: Message): void {
    this.send.emit(message);
  }

  /**
   * Clears the input field
   *
   * @private
   */
  private clearInput(): void {
    this.messageText = '';
  }

  /**
   * Formats current time for message timestamp
   *
   * @private
   * @returns {string} Formatted time (e.g., "12:30 PM")
   */
  private formatCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
