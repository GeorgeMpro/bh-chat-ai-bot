import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  template: ` <header class="chat-header">
    <h2>{{ title }}</h2>
  </header>`,
  styles: [`
    .chat-header {
      padding: 16px;
      background-color: #f5f5f5;
      text-align: center;
      font-weight: bold;
    }
  `],
})
export class ChatHeaderComponent {
  title = 'AI Chatroom';
}
