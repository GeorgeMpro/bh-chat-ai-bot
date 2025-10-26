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
  styles: [
    `
      .chat-messages {
        position: absolute;
        top: 73px;
        bottom: 73px;
        left: 0;
        right: 0;
        padding: 20px;
        background: #f5f7fb;
        overflow-y: auto;
        scroll-behavior: smooth; // SMOOTH SCROLLING

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
  messages = input.required<Message[]>();
  messageContainer = viewChild<ElementRef>('messageContainer');

  constructor() {
    // Auto-scroll when messages change
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
