import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule], // Add this!
  template: `
    <footer class="chat-input">
      <input
        type="text"
        placeholder="Type a message…"
        [(ngModel)]="messageText"
        (keyup.enter)="sendMessage()"
        [disabled]="disabled()"
      />
      <button class="send-button" (click)="sendMessage()">Send</button>
    </footer>
  `,
  styles: [
    `
      @use '../../styles/variables' as *;

      .chat-input {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding: $padding-header;
        background: $chat-body-text;
        border-top: 1px solid #e2e8f0;
        gap: $gap-small;
        border-radius: 0 0 16px 16px;
        z-index: 10; // ENSURE IT'S ON TOP

        input[type='text'] {
          flex: 1;
          padding: $padding-input-text;
          border: 1px solid #e2e8f0;
          border-radius: $border-radius-5;
          font-size: $font-size-1;
          background: $input-background;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: $border-focus;
            background: $chat-body-text;
          }

          &::placeholder {
            color: #a0aec0;
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        .send-button {
          padding: $send-button-padding;
          background: $chat-body-background;
          color: $chat-body-text;
          border: none;
          border-radius: $border-radius-5;
          cursor: pointer;
          font-weight: $font-weight-semibold;
          font-size: $font-size-1;
          transition: transform 0.2s;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    `,
  ],
})
export class MessageInputComponent {
  send = output<Message>();
  messageText = '';

  userService = inject(UserService);
  disabled = input<boolean>(false);

  sendMessage() {
    const user = this.userService.user();
    if (this.messageText.trim()) {
      const message: Message = {
        user: user!.username,
        type: 'sent',
        text: this.messageText,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: 'assets/icons/avatar-user.png',
      };

      this.send.emit(message);
      this.messageText = '';
    }
  }
}
