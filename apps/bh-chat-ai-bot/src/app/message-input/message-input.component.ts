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
      .chat-input {
        position: absolute; // FIXED POSITION
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding: 16px 20px;
        background: white;
        border-top: 1px solid #e2e8f0;
        gap: 12px;
        border-radius: 0 0 16px 16px;
        z-index: 10; // ENSURE IT'S ON TOP

        input[type='text'] {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          font-size: 14px;
          background: #f7fafc;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: #667eea;
            background: white;
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
          padding: 12px 24px;
          background: #2d3748;
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
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
