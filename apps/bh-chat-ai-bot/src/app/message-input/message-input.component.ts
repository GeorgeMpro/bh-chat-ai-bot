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
  templateUrl: 'message-input.component.html',
  styleUrl: 'message-input.component.scss',
})
export class MessageInputComponent {
  private readonly userService = inject(UserService);

  protected readonly placeholder = 'Type a message…';
  protected readonly sendButtonText = 'Send';
  protected messageText = '';

  send = output<Message>();
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

  protected canSend(): boolean {
    return this.hasValidMessage() && this.hasCurrentUser() && !this.disabled();
  }

  private hasValidMessage(): boolean {
    return this.messageText.trim().length > 0;
  }

  private hasCurrentUser(): boolean {
    return this.userService.user() !== null;
  }

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

  private emitMessage(message: Message): void {
    this.send.emit(message);
  }

  private clearInput(): void {
    this.messageText = '';
  }

  private formatCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
