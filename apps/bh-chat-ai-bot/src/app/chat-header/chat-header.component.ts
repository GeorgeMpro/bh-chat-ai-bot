import { Component, inject, input } from '@angular/core';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-header',
  template: `
    <header class="chat-header">
      <div class="header-content">
        <h2>{{ title }}</h2>
        <!--        todo add how many users connected-->
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      @if (userService.user(); as user) {
        <div class="user-info">
          <span class="user-avatar">{{ user.avatar }}</span>
          <span class="username">{{ user.username }}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      }
    </header>
  `,
  styleUrl:'chat-header.component.scss',
})
export class ChatHeaderComponent {
  title = 'Chat With Bot';
  subtitle = 'x users connected';

  userService = inject(UserService);

  user = input<User | null>();
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.userService.logout();
    }
  }
}
