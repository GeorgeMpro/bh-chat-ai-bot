import { Component, input, effect, viewChild, ElementRef } from '@angular/core';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  template: `
    <div class="chat-messages" #messageContainer>
      @for (msg of messages(); track $index) {
      <app-message-item [msg]="msg" />
      }
    </div>
  `,
  styleUrl: 'message-list.component.scss',
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  messages = input.required<Message[]>();
  messageContainer = viewChild<ElementRef>('messageContainer');

  constructor() {
    effect(() => {
      const messages = this.messages();
      const container = this.messageContainer()?.nativeElement;

      if (container && messages.length > 0) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    });
  }
}
