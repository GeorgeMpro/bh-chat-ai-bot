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
        flex: 1;
        padding: 16px;
        background: #fff;
        overflow-y: auto;
      }
    `,
  ],
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  messages = input.required<Message[]>(); // Modern input() signal
}
