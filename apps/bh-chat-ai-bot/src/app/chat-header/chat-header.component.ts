import { Component, inject, input } from '@angular/core';
import { User, UserService } from '../services/user.service';

/**
 * Chat header component displaying title and user information
 *
 * @description
 * The ChatHeaderComponent displays the chat title, connection status,
 * and current user information. It provides a logout button that confirms
 * before logging the user out of the application.
 *
 * @example
 * ```typescript
 * <app-chat-header [user]="currentUser"></app-chat-header>
 * ```
 */
@Component({
  selector: 'app-chat-header',
  template: `
    <header class="chat-header">
      <div class="header-content">
        <h2>{{ title }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      @if (currentUser(); as user) {
      <div class="user-info">
        <span class="user-avatar">{{ user.avatar }}</span>
        <span class="username">{{ user.username }}</span>
        <button class="logout-btn" (click)="handleLogout()" aria-label="Logout">
          Logout
        </button>
      </div>
      }
    </header>
  `,
  styleUrl: 'chat-header.component.scss',
})
export class ChatHeaderComponent {
  /** User service for logout functionality */
  protected readonly userService = inject(UserService);

  /** Chat title displayed in header */
  protected readonly title = 'Chat With Bot';

  /** Subtitle showing connection status */
  protected readonly subtitle = 'x users connected'; // TODO: Implement active user count

  /** Confirmation message for logout */
  private readonly LOGOUT_CONFIRMATION = 'Are you sure you want to logout?';

  /**
   * Current user information (optional)
   *
   * @description
   * Accepts user data as input. If provided, displays user info
   * and logout button. Falls back to userService.user() if not provided.
   */
  currentUser = input<User | null>(null, { alias: 'user' });

  /**
   * Handles logout button click
   *
   * @description
   * Prompts the user for confirmation before logging out.
   * Clears user session and returns to login screen.
   *
   * @example
   * ```typescript
   * // User clicks logout button
   * handleLogout(); // Shows confirmation, then logs out
   * ```
   */
  protected handleLogout(): void {
    if (this.confirmLogout()) {
      this.performLogout();
    }
  }

  /**
   * Shows confirmation dialog for logout
   *
   * @private
   * @returns {boolean} True if user confirms logout
   */
  private confirmLogout(): boolean {
    return confirm(this.LOGOUT_CONFIRMATION);
  }

  /**
   * Performs the logout operation
   *
   * @private
   */
  private performLogout(): void {
    this.userService.logout();
  }
}
