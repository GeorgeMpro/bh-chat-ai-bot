import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../models/message.model';
import { UserService } from '../services/user.service';

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
        [disabled]="disabled()"
      />
      <button class="send-button" (click)="sendMessage()">Send</button>
    </footer>
  `,
  styleUrl: 'message-input.component.scss',
})
export class MessageInputComponent {
  send = output<Message>();
  messageText = '';

  userService = inject(UserService);
  disabled = input<boolean>(false);

  sendMessage() {
    const user = this.userService.user();
    if (this.messageText.trim() && user) {
      const message: Message = {
        user: user.username,
        type: 'sent',
        text: this.messageText,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: user.avatar, // Use user's emoji avatar
      };

      this.send.emit(message);
      this.messageText = '';
    }
  }
}
