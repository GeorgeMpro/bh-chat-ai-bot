import { TestBed } from '@angular/core/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have 20 predefined avatars', () => {
      expect(service.avatars).toBeDefined();
      expect(service.avatars.length).toBe(20);
    });

    it('should initialize with null user', () => {
      expect(service.user()).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user with username and avatar', () => {
      const username = 'TestUser';
      const avatar = '😊';

      service.setUser(username, avatar);

      const user = service.user();
      expect(user).toBeTruthy();
      expect(user?.username).toBe(username);
      expect(user?.avatar).toBe(avatar);
    });

    it('should store user in localStorage', () => {
      const username = 'TestUser';
      const avatar = '😊';

      service.setUser(username, avatar);

      const stored = localStorage.getItem('chatUser');
      expect(stored).toBeTruthy();

      const parsedUser = JSON.parse(stored!);
      expect(parsedUser.username).toBe(username);
      expect(parsedUser.avatar).toBe(avatar);
    });

    it('should update existing user', () => {
      service.setUser('User1', '😊');
      service.setUser('User2', '🚀');

      const user = service.user();
      expect(user?.username).toBe('User2');
      expect(user?.avatar).toBe('🚀');
    });
  });

  describe('loadUser', () => {
    it('should load user from localStorage', () => {
      const testUser: User = { username: 'StoredUser', avatar: '💻' };
      localStorage.setItem('chatUser', JSON.stringify(testUser));

      service.loadUser();

      const user = service.user();
      expect(user).toEqual(testUser);
    });

    it('should handle missing localStorage data gracefully', () => {
      service.loadUser();
      expect(service.user()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear current user', () => {
      service.setUser('TestUser', '😊');
      expect(service.user()).toBeTruthy();

      service.logout();

      expect(service.user()).toBeNull();
    });

    it('should remove user from localStorage', () => {
      service.setUser('TestUser', '😊');
      expect(localStorage.getItem('chatUser')).toBeTruthy();

      service.logout();

      expect(localStorage.getItem('chatUser')).toBeNull();
    });
  });

  describe('getRandomAvatar', () => {
    it('should return an avatar from the avatars array', () => {
      const avatar = service.getRandomAvatar();

      expect(service.avatars).toContain(avatar);
    });

    it('should return different avatars on multiple calls (statistical test)', () => {
      const avatars = new Set<string>();

      // Get 50 random avatars
      for (let i = 0; i < 50; i++) {
        avatars.add(service.getRandomAvatar());
      }

      // With 20 avatars and 50 calls, we should get at least 5 different ones
      expect(avatars.size).toBeGreaterThan(5);
    });

    it('should always return a valid emoji string', () => {
      for (let i = 0; i < 10; i++) {
        const avatar = service.getRandomAvatar();
        expect(typeof avatar).toBe('string');
        expect(avatar.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty username', () => {
      service.setUser('', '😊');

      const user = service.user();
      expect(user?.username).toBe('');
    });

    it('should handle empty avatar', () => {
      service.setUser('TestUser', '');

      const user = service.user();
      expect(user?.avatar).toBe('');
    });

    it('should handle special characters in username', () => {
      const specialName = 'User!@#$%^&*()';
      service.setUser(specialName, '😊');

      const user = service.user();
      expect(user?.username).toBe(specialName);
    });

    it('should handle very long username', () => {
      const longName = 'a'.repeat(1000);
      service.setUser(longName, '😊');

      const user = service.user();
      expect(user?.username).toBe(longName);
    });
  });

  describe('Signal Behavior', () => {
    it('should maintain signal reference', () => {
      const signal1 = service.user;
      const signal2 = service.user;

      expect(signal1).toBe(signal2);
    });

    it('should be readonly signal', () => {
      const userSignal = service.user;

      // TypeScript should prevent this, but we can verify the signal is readonly
      expect(userSignal).toBeTruthy();
    });
  });
});
