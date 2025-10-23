import { Component } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  template: ` <div class="chat-container">
    <app-chat-header></app-chat-header>

    <app-message-list></app-message-list>

    <app-message-input (send)="onSend($event)"></app-message-input>
  </div>`,
  styles: [
    `
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
    `,
  ],
  imports: [MessageListComponent, MessageInputComponent, ChatHeaderComponent],
})
export class ChatComponent {
  // todo
  onSend($event: any) {
    console.log('message sent');
  }
}
