import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';

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
      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #2d3748;
        color: white;
      }

      .header-content {
        h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .subtitle {
          font-size: 12px;
          opacity: 0.9;
          margin: 4px 0 0 0;
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .icon-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .user-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .username {
          font-weight: 600;
          font-size: 14px;
        }

        .logout-btn {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
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
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.userService.logout();
    }
  }
}
