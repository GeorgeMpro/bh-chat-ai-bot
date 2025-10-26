import { Injectable, signal } from '@angular/core';

/**
 * Represents a user in the chat application
 * @interface User
 */
export interface User {
  username: string;
  avatar: string;
}

/**
 * Service for managing user authentication and state
 *
 * @description
 * Handles user login, logout, avatar selection, and persistence across sessions.
 * User data is stored in localStorage to maintain state on page refresh.
 *
 * @example
 * ```typescript
 * constructor(private userService: UserService) {
 *   this.userService.setUser('John', '😊');
 *   const currentUser = this.userService.user();
 * }
 * ```
 *
 * @export
 * @class UserService
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser = signal<User | null>(null);

  /** Local storage key for user data persistence */
  private static readonly STORAGE_KEY = 'chatUser';
  /**
   * Collection of available emoji avatars for users to choose from
   * @readonly
   */
  readonly avatars: readonly string[] = [
    '👤',
    '😊',
    '🚀',
    '💻',
    '🎨',
    '🎮',
    '📚',
    '☕',
    '🌟',
    '🔥',
    '😀',
    '😎',
    '🤓',
    '😇',
    '🥳',
    '🤖',
    '👨‍💻',
    '👩‍💻',
    '🦸‍♂️',
    '🦸‍♀️',
  ] as const;

  get user() {
    return this.currentUser.asReadonly();
  }

  /**
   * Sets the current user and persists to localStorage
   *
   * @description
   * Updates the current user state and saves it to localStorage for persistence.
   * This allows the user to remain logged in across page refreshes.
   *
   * @param {string} username - The user's display name
   * @param {string} avatar - The user's emoji avatar
   *
   * @example
   * ```typescript
   * this.userService.setUser('Alice', '🚀');
   * ```
   *
   * @throws {Error} If localStorage is not available
   */
  setUser(username: string, avatar: string): void {
    const user: User = { username, avatar };
    this.currentUser.set(user);
    this.persistUser(user);
  }

  /**
   * Loads user data from localStorage
   *
   * @description
   * Attempts to restore user state from localStorage. Should be called
   * during application initialization to restore previous session.
   *
   * @example
   * ```typescript
   * ngOnInit() {
   *   this.userService.loadUser();
   * }
   * ```
   *
   * @throws {SyntaxError} If stored data is not valid JSON
   */
  loadUser(): void {
    try {
      const stored = localStorage.getItem(UserService.STORAGE_KEY);
      if (stored) {
        const user = this.parseStoredUser(stored);
        this.currentUser.set(user);
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
      this.clearStorage();
    }
  }

  /**
   * Logs out the current user
   *
   * @description
   * Clears the user state and removes data from localStorage.
   * After logout, user() will return null.
   *
   * @example
   * ```typescript
   * logout() {
   *   this.userService.logout();
   *   this.router.navigate(['/login']);
   * }
   * ```
   */
  logout(): void {
    this.currentUser.set(null);
    this.clearStorage();
  }

  /**
   * Returns a random avatar from the available avatars
   *
   * @description
   * Useful for providing a default avatar when user first logs in.
   * Uses Math.random() for selection.
   *
   * @returns {string} A random emoji avatar
   *
   * @example
   * ```typescript
   * const defaultAvatar = this.userService.getRandomAvatar();
   * ```
   */
  getRandomAvatar(): string {
    const randomIndex = Math.floor(Math.random() * this.avatars.length);
    return this.avatars[randomIndex];
  }
  /**
   * Persists user data to localStorage
   *
   * @private
   * @param {User} user - The user data to persist
   */
  private persistUser(user: User): void {
    try {
      const serialized = JSON.stringify(user);
      localStorage.setItem(UserService.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to persist user to localStorage:', error);
    }
  }

  /**
   * Parses stored user data from JSON string
   *
   * @private
   * @param {string} stored - JSON string from localStorage
   * @returns {User} Parsed user object
   * @throws {SyntaxError} If JSON is invalid
   */
  private parseStoredUser(stored: string): User {
    const parsed = JSON.parse(stored);

    // Validate structure
    if (!this.isValidUser(parsed)) {
      throw new Error('Invalid user data structure');
    }

    return parsed;
  }

  /**
   * Validates user object structure
   *
   * @private
   * @param {any} obj - Object to validate
   * @returns {boolean} True if object has valid User structure
   */
  private isValidUser(obj: any): obj is User {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.username === 'string' &&
      typeof obj.avatar === 'string'
    );
  }

  /**
   * Clears user data from localStorage
   *
   * @private
   */
  private clearStorage(): void {
    try {
      localStorage.removeItem(UserService.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
