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
  templateUrl: './message-item.component.html',
  styleUrl: 'message-item.component.scss',
})
export class MessageItemComponent {
  msg = input.required<Message>();

  protected messageType = computed(() => this.msg().type);
  protected username = computed(() => this.msg().user);
  protected text = computed(() => this.msg().text);
  protected time = computed(() => this.msg().time);
  protected avatar = computed(() => this.msg().avatar);
  protected isSent = computed(() => this.messageType() === 'sent');
  protected isReceived = computed(() => this.messageType() === 'received');
}
