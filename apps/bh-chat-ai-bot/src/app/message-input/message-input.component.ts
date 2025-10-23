import { Component, output } from '@angular/core';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-input',
  standalone: true,
  template: `
    <footer class="chat-input">
      <input type="text" placeholder="Type a message…" />
      <button class="send-button">Send</button>
    </footer>
  `,
  styles: [
    `
      .chat-input {
        display: flex;
        padding: 12px;
        background: #f5f5f5;

        input[type='text'] {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .send-button {
          margin-left: 8px;
          padding: 0 16px;
          background: #4a90e2;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    `,
  ],
})
export class MessageInputComponent {
  send = output<Message>();
}
