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
  styles: [
    `
      @use '../../styles/variables' as *;

      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $padding-header;
        background: $chat-body-background;
        color: $chat-body-text;
      }

      .header-content {
        h2 {
          font-size: $font-size-3;
          font-weight: $font-weight-semibold;
          margin: 0;
        }

        .subtitle {
          font-size: $font-size-1;
          opacity: 0.9;
          margin: 4px 0 0 0;
        }
      }

      .header-actions {
        display: flex;
        gap: $gap-small;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: $gap-small;

        .user-avatar {
          font-size: $font-size-4;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $avatar-background;
          border-radius: 50%;
        }

        .username {
          font-weight: $font-weight-semibold;
          font-size: $font-size-2;
        }

        .logout-btn {
          padding: $padding-small;
          background: $logout-background;
          border: none;
          border-radius: $border-radius-1;
          color: $chat-body-text;
          cursor: pointer;
          font-size: $font-size-1;
          transition: background 0.2s;

          &:hover {
            background: $logout-background-hover;
          }
        }
      }
    `,
  ],
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
