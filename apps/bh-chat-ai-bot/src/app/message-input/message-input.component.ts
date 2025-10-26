import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';

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
      />
      <button class="send-button" (click)="sendMessage()">Send</button>
    </footer>
  `,
  styles: [
    `
      .chat-input {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        background: white;
        border-top: 1px solid #e2e8f0;
        gap: 12px;
        flex-shrink: 0;

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
        }

        .send-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.2s;

          &:hover {
            transform: translateY(-2px);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    `,
  ],
})
export class MessageInputComponent {
  send = output<Message>();
  messageText = '';

  sendMessage() {
    if (this.messageText.trim()) {
      const message: Message = {
        user: 'you',
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
