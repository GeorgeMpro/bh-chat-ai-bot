import { Component } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss'],
  imports: [MessageListComponent],
})
export class ChatComponent {}
