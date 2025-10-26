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
  template: `
    <div class="login-overlay">
      <div class="login-card">
        <h2>{{ welcomeTitle }}</h2>
        <p>{{ welcomeSubtitle }}</p>

        <div class="form-group">
          <label for="username">{{ usernameLabel }}</label>
          <input
            id="username"
            type="text"
            [(ngModel)]="username"
            [placeholder]="usernamePlaceholder"
            (keyup.enter)="handleLogin()"
            [maxlength]="maxUsernameLength"
            aria-label="Username"
          />
        </div>

        <div class="form-group">
          <label>{{ avatarLabel }}</label>
          <div class="avatar-grid">
            @for (emoji of avatars; track emoji) {
            <button
              type="button"
              class="avatar-btn"
              [class.selected]="isAvatarSelected(emoji)"
              (click)="selectAvatar(emoji)"
              [attr.aria-label]="'Select avatar ' + emoji"
            >
              {{ emoji }}
            </button>
            }
          </div>
        </div>

        <button
          type="button"
          class="login-btn"
          (click)="handleLogin()"
          [disabled]="!canLogin()"
          aria-label="Join chat"
        >
          {{ loginButtonText }}
        </button>
      </div>
    </div>
  `,
  styleUrl: 'login.component.scss',
})
export class LoginComponent {
  /** User service for authentication */
  protected readonly userService = inject(UserService);

  /** Available avatar emojis */
  protected readonly avatars = this.userService.avatars;

  /** UI text constants */
  protected readonly welcomeTitle = 'Welcome to the Chat';
  protected readonly welcomeSubtitle = 'Choose your username and avatar';
  protected readonly usernameLabel = 'Username';
  protected readonly usernamePlaceholder = 'Enter your name...';
  protected readonly avatarLabel = 'Choose Avatar';
  protected readonly loginButtonText = 'Join Chat';

  /** Maximum allowed username length */
  protected readonly maxUsernameLength = 20;

  /** User's entered username */
  protected username = '';

  /** Currently selected avatar */
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

  /**
   * Checks if an avatar is currently selected
   *
   * @param {string} emoji - The emoji to check
   * @returns {boolean} True if the emoji is selected
   */
  protected isAvatarSelected(emoji: string): boolean {
    return this.selectedAvatar() === emoji;
  }

  /**
   * Checks if login is allowed
   *
   * @returns {boolean} True if username is valid
   */
  protected canLogin(): boolean {
    return this.isValidUsername();
  }

  /**
   * Validates username input
   *
   * @private
   * @returns {boolean} True if username is valid
   */
  private isValidUsername(): boolean {
    return this.username.trim().length > 0;
  }

  /**
   * Performs the login operation
   *
   * @private
   */
  private performLogin(): void {
    const trimmedUsername = this.username.trim();
    this.userService.setUser(trimmedUsername, this.selectedAvatar());
  }

  /**
   * Gets a random avatar for initial selection
   *
   * @private
   * @returns {string} Random avatar emoji
   */
  private getRandomAvatar(): string {
    return this.userService.getRandomAvatar();
  }
}
