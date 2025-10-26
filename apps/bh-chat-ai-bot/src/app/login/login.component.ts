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
        <h2>Welcome to the Chat</h2>
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
  styleUrl: 'login.component.scss',
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
