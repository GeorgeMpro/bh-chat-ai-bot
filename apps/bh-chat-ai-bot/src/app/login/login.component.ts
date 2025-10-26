import { Component, output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-overlay">
      <div class="login-card">
        <h2>Welcome to Chat!</h2>
        <p>Choose your username and avatar</p>

        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            [(ngModel)]="username"
            placeholder="Enter your name..."
            (keyup.enter)="login()"
            maxlength="20"
          />
        </div>

        <div class="form-group">
          <label>Choose Avatar</label>
          <div class="avatar-grid">
            @for (emoji of userService.avatars; track emoji) {
            <button
              class="avatar-btn"
              [class.selected]="selectedAvatar() === emoji"
              (click)="selectedAvatar.set(emoji)"
            >
              {{ emoji }}
            </button>
            }
          </div>
        </div>

        <button
          class="login-btn"
          (click)="login()"
          [disabled]="!username.trim()"
        >
          Join Chat
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .login-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .login-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

        h2 {
          margin: 0 0 8px 0;
          color: #2d3748;
        }

        p {
          margin: 0 0 24px 0;
          color: #718096;
        }
      }

      .form-group {
        margin-bottom: 24px;

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d3748;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;

          &:focus {
            outline: none;
            border-color: #667eea;
          }
        }
      }

      .avatar-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }

      .avatar-btn {
        width: 50px;
        height: 50px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: #667eea;
          transform: scale(1.1);
        }

        &.selected {
          border-color: #667eea;
          background: #eef2ff;
        }
      }

      .login-btn {
        width: 100%;
        padding: 12px;
        background: #2d3748;
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `,
  ],
})
export class LoginComponent {
  userService = inject(UserService);
  username = '';
  selectedAvatar = signal(this.userService.getRandomAvatar());

  login() {
    if (this.username.trim()) {
      this.userService.setUser(this.username.trim(), this.selectedAvatar());
    }
  }
}
