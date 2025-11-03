import AsyncStorage from '@react-native-async-storage/async-storage';

type StoredUser = {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

class UserAccountStorageService {
  private readonly storageKey = 'com.yourapp.user-accounts';

  private async getStoredUsers(): Promise<StoredUser[]> {
    try {
      const usersJson = await AsyncStorage.getItem(this.storageKey);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('UserAccountStorage: Failed to get users.', error);
      return [];
    }
  }

  private async saveStoredUsers(users: StoredUser[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('UserAccountStorage: Failed to save users.', error);
      throw new Error('Could not save user list.');
    }
  }


  async findUserByEmail(email: string): Promise<StoredUser | null> {
    const users = await this.getStoredUsers();
    const foundUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
    return foundUser || null;
  }

  async addUser(newUser: StoredUser): Promise<boolean> {
    const users = await this.getStoredUsers();
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase(),
    );

    if (existingUser) {
      console.warn('UserAccountStorage: User already exists.');
      return false; // User already exists
    }

    users.push(newUser);
    await this.saveStoredUsers(users);
    console.log('UserAccountStorage: User added successfully.');
    return true;
  }
}

// Export a singleton instance
export const UserAccountStorage = new UserAccountStorageService();
