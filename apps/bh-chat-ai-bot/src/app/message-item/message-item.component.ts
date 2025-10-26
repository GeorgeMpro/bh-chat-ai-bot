import { Component, input } from '@angular/core';
import { Message } from '../models/message.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [NgClass],
 template: `
  <div class="message" [ngClass]="msg().type">
    @if (msg().type === 'received') {
      <img [src]="msg().avatar" [alt]="msg().user" class="avatar" />
    }

    <div class="message-content">
      <div class="message-bubble">
        @if (msg().type === 'received') {
          <div class="message-header">
            <span class="username">{{ msg().user }}</span>
          </div>
        }
        <p>{{ msg().text }}</p>
        <div class="message-footer">
          <span class="time">{{ msg().time }}</span>
        </div>
      </div>
    </div>

    @if (msg().type === 'sent') {
      <img [src]="msg().avatar" [alt]="msg().user" class="avatar" />
    }
  </div>
`,
  styles: [
    `
      .message {
        display: flex;
        gap: 8px; // Reduced from 12px
        margin-bottom: 12px; // Reduced from 16px
        align-items: flex-start;

        &.received {
          flex-direction: row;

          .message-bubble {
            background: white;
            color: #2d3748;
            border-radius: 12px 12px 12px 4px;
          }
        }

        &.sent {
          flex-direction: row-reverse;

          .message-content {
            align-items: flex-end;
          }

          .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px 12px 4px 12px;
          }
        }

        .avatar {
          width: 32px; // Reduced from 40px
          height: 32px; // Reduced from 40px
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
          gap: 4px;
        }

        .message-header {
          .username {
            font-size: 13px;
            font-weight: 600;
            color: #4a5568;
          }
        }

        .message-bubble {
          padding: 8px 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex; // ADD THIS
          flex-direction: column; // ADD THIS

          p {
            margin: 0 0 4px 0; // ADD MARGIN BOTTOM
            line-height: 1.4;
            font-size: 13px;
            word-wrap: break-word;
            word-break: break-word;
          }
        }

        .message-footer {
          display: flex;
          justify-content: flex-end; // ALIGN RIGHT
          margin-top: auto; // PUSH TO BOTTOM

          .time {
            font-size: 10px;
            opacity: 0.7; // MAKE IT SUBTLE
          }
        }

        .sent .message-footer .time {
          color: rgba(255, 255, 255, 0.8); // WHITE FOR SENT MESSAGES
        }

        .received .message-footer .time {
          color: #a0aec0; // GRAY FOR RECEIVED
        }
      }
    `,
  ],
})
export class MessageItemComponent {
  msg = input.required<Message>();
}
