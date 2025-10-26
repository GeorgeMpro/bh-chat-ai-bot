import { Injectable, signal } from '@angular/core';

export interface User {
  username: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser = signal<User | null>(null);

  // Available emoji avatars
  readonly avatars = [
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
  ];

  get user() {
    return this.currentUser.asReadonly();
  }

  setUser(username: string, avatar: string) {
    const user = { username, avatar };
    this.currentUser.set(user);
    // Store in localStorage so user persists on refresh
    localStorage.setItem('chatUser', JSON.stringify(user));
  }

  loadUser() {
    const stored = localStorage.getItem('chatUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('chatUser');
  }

  getRandomAvatar(): string {
    return this.avatars[Math.floor(Math.random() * this.avatars.length)];
  }
}
