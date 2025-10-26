import { Component, input, computed } from '@angular/core';
import { Message } from '../models/message.model';
import { NgClass } from '@angular/common';

/**
 * Message item component for displaying individual chat messages
 *
 * @description
 * The MessageItemComponent renders a single message in the chat.
 * It adapts its layout based on message type (sent/received),
 * displays user avatar, username, message text, and timestamp.
 * Sent messages appear on the right with gradient background,
 * while received messages appear on the left.
 *
 * @example
 * ```typescript
 * <app-message-item [msg]="message"></app-message-item>
 * ```
 */
@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="message" [ngClass]="messageType()">
      @if (isReceived()) {
      <div class="avatar-emoji">{{ avatar() }}</div>
      }

      <div class="message-content">
        <div class="message-bubble">
          @if (isReceived()) {
          <div class="message-header">
            <span class="username">{{ username() }}</span>
          </div>
          }
          <p>{{ text() }}</p>
          <div class="message-footer">
            <span class="time">{{ time() }}</span>
          </div>
        </div>
      </div>

      @if (isSent()) {
      <div class="avatar-emoji">{{ avatar() }}</div>
      }
    </div>
  `,
  styleUrl: 'message-item.component.scss',
})
export class MessageItemComponent {
  /**
   * The message to display
   *
   * @description
   * Required input containing all message data including
   * user, type, text, timestamp, and avatar.
   */
  msg = input.required<Message>();

  /**
   * Computed message type for CSS classes
   *
   * @returns {'sent' | 'received'} The message type
   */
  protected messageType = computed(() => this.msg().type);

  /**
   * Computed username from message
   *
   * @returns {string} The message sender's username
   */
  protected username = computed(() => this.msg().user);

  /**
   * Computed message text
   *
   * @returns {string} The message content
   */
  protected text = computed(() => this.msg().text);

  /**
   * Computed message timestamp
   *
   * @returns {string} Formatted time string
   */
  protected time = computed(() => this.msg().time);

  /**
   * Computed user avatar
   *
   * @returns {string} The emoji avatar
   */
  protected avatar = computed(() => this.msg().avatar);

  /**
   * Checks if message is sent by current user
   *
   * @returns {boolean} True if message type is 'sent'
   */
  protected isSent = computed(() => this.messageType() === 'sent');

  /**
   * Checks if message is received from other user
   *
   * @returns {boolean} True if message type is 'received'
   */
  protected isReceived = computed(() => this.messageType() === 'received');
}
