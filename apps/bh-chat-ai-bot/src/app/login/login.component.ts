import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

/**
 * Login component for user authentication and avatar selection
 *
 * @description
 * The LoginComponent provides a user-friendly interface for entering the chat.
 * Users can choose a username and select an avatar from a grid of emojis.
 * The component validates input and persists user data to localStorage.
 *
 * @example
 * ```typescript
 * <app-login></app-login>
 * ```
 *
 * @remarks
 * Features:
 * - Username input with validation
 * - Avatar selection grid
 * - Enter key support for quick login
 * - Random avatar pre-selection
 * - Disabled state for invalid input
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
})
export class LoginComponent {
  protected readonly userService = inject(UserService);

  protected readonly avatars = this.userService.avatars;
  protected readonly welcomeTitle = 'Welcome to the Chat';
  protected readonly welcomeSubtitle = 'Choose your username and avatar';
  protected readonly usernameLabel = 'Username';
  protected readonly usernamePlaceholder = 'Enter your name...';
  protected readonly avatarLabel = 'Choose Avatar';
  protected readonly loginButtonText = 'Join Chat';
  protected readonly maxUsernameLength = 20;
  protected username = '';

  protected selectedAvatar = signal(this.getRandomAvatar());

  /**
   * Handles login button click or Enter key press
   *
   * @description
   * Validates the username and logs in the user if valid.
   * Trims whitespace and ensures username is not empty.
   *
   * @example
   * ```typescript
   * // User enters "Alice" and clicks Join
   * handleLogin(); // Sets user to "Alice" with selected avatar
   * ```
   */
  protected handleLogin(): void {
    if (this.isValidUsername()) {
      this.performLogin();
    }
  }

  /**
   * Selects an avatar from the grid
   *
   * @param {string} emoji - The emoji to select
   *
   * @example
   * ```typescript
   * selectAvatar('😊'); // Updates selected avatar
   * ```
   */
  protected selectAvatar(emoji: string): void {
    this.selectedAvatar.set(emoji);
  }

  protected isAvatarSelected(emoji: string): boolean {
    return this.selectedAvatar() === emoji;
  }

  protected canLogin(): boolean {
    return this.isValidUsername();
  }

  private isValidUsername(): boolean {
    return this.username.trim().length > 0;
  }

  private performLogin(): void {
    const trimmedUsername = this.username.trim();
    this.userService.setUser(trimmedUsername, this.selectedAvatar());
  }

  private getRandomAvatar(): string {
    return this.userService.getRandomAvatar();
  }
}
