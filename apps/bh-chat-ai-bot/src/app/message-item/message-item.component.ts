import { Component, input } from '@angular/core';
import { Message } from '../models/message.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="message" [ngClass]="msg().type">
      @if (msg().type === 'received') {
      <div class="avatar-emoji">{{ msg().avatar }}</div>
      }

      <div class="message-content">
        <div class="message-bubble">
          @if (msg().type === 'received') {
          <div class="message-header">
            <span class="username">{{ msg().user }}</span>
          </div>
          }
          <p>{{ msg().text }}</p>
          <div class="message-footer">
            <span class="time">{{ msg().time }}</span>
          </div>
        </div>
      </div>

      @if (msg().type === 'sent') {
      <div class="avatar-emoji">{{ msg().avatar }}</div>
      }
    </div>
  `,
  styleUrl: 'message-item.component.scss',
})
export class MessageItemComponent {
  msg = input.required<Message>();
}
