import { Component, Input } from '@angular/core';

import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-item',
  standalone: true,
  template: `
    <div
      class="message"
      [class.recieved]="msg.type === 'received'"
      [class.sent]="msg.type === 'sent'"
    >
      <div class="text"> {{ msg.user }}: {{ msg.text }}</div>
      <div class="time">{{ msg.time }}</div>
      <div class="avatar"><img [src]="msg.avatar" alt="msg.user" /></div>
    </div>
  `,
  styles: [`
    .message {
      display: flex;
      align-items: flex-end;
      margin-bottom: 12px;

      &.received {
        .avatar {
          margin-right: 12px;
        }

        .text {
          background: #e0e0e0;
          color: #000;
          border-radius: 12px 12px 12px 0;
          padding: 10px;
          max-width: 70%;
        }
      }

      &.sent {
        flex-direction: row-reverse;

        .avatar {
          margin-left: 12px;
        }

        .text {
          background: #4a90e2;
          color: #fff;
          border-radius: 12px 12px 0 12px;
          padding: 10px;
          max-width: 70%;
        }
      }

      .avatar img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }

      .time {
        font-size: 0.75rem;
        color: #999;
        margin: 0 8px;
      }
    }
  `],
})
export class MessageItemComponent {
  @Input() msg!: Message;
}
