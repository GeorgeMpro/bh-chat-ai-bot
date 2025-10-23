import { Component } from '@angular/core';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  messages: Message[] = [
    {
      user: 'bot',
      type: 'received',
      text: 'Hello, how can I help you?',
      time: '10:00',
      avatar: 'assets/icons/avatar-bot.png',
    },
    {
      user: 'you',
      type: 'sent',
      text: 'I’d like to know about the project.',
      time: '10:01',
      avatar: 'assets/icons/avatar-user.png',
    },
    {
      user: 'alice',
      type: 'received',
      text: 'Hey everyone, just joined the chat!',
      time: '10:02',
      avatar: 'assets/icons/avatar-alice.png',
    },
    {
      user: 'bob',
      type: 'received',
      text: 'Morning folks, what’s the topic today?',
      time: '10:03',
      avatar: 'assets/icons/avatar-bob.png',
    },
    {
      user: 'you',
      type: 'sent',
      text: 'We’re discussing the new chat bot design.',
      time: '10:04',
      avatar: 'assets/icons/avatar-user.png',
    },
    {
      user: 'bot',
      type: 'received',
      text: 'Remember to keep messages concise and clear!',
      time: '10:05',
      avatar: 'assets/icons/avatar-bot.png',
    },
    {
      user: 'charlie',
      type: 'received',
      text: 'Got it! Sounds like an interesting project.',
      time: '10:06',
      avatar: 'assets/icons/avatar-charlie.png',
    },
  ];
}
