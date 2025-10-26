import { Component, input } from '@angular/core';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  template: `
    <div class="chat-messages">
      @for (msg of messages(); track $index) {
      <app-message-item [msg]="msg" />
      }
    </div>
  `,
  styles: [
    `
      .chat-messages {
        position: absolute; // ABSOLUTE POSITIONING
        top: 73px; // HEIGHT OF HEADER (adjust if needed)
        bottom: 73px; // HEIGHT OF INPUT (adjust if needed)
        left: 0;
        right: 0;
        padding: 20px;
        background: #f5f7fb;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
      }
    `,
  ],

  imports: [MessageItemComponent],
})
export class MessageListComponent {
  messages = input.required<Message[]>(); // Modern input() signal
}
