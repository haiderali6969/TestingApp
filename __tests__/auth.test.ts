// __tests__/auth.test.ts

import { mockHashPassword, mockComparePassword } from '../src/utils/auth';

describe('Auth Utility Functions', () => {
  describe('mockHashPassword', () => {
    it('should hash a password', async () => {
      const password = 'myPassword123';
      const hashedPassword = await mockHashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toContain('hashed_');
    });

    it('should produce consistent hashes for the same password', async () => {
      const password = 'testPassword';
      const hash1 = await mockHashPassword(password);
      const hash2 = await mockHashPassword(password);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different passwords', async () => {
      const password1 = 'password1';
      const password2 = 'password2';

      const hash1 = await mockHashPassword(password1);
      const hash2 = await mockHashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', async () => {
      const password = '';
      const hashedPassword = await mockHashPassword(password);

      expect(hashedPassword).toBe('hashed_');
    });

    it('should handle special characters', async () => {
      const password = 'P@ssw0rd!#$%';
      const hashedPassword = await mockHashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toContain('hashed_');
    });

    it('should handle very long passwords', async () => {
      const password = 'a'.repeat(1000);
      const hashedPassword = await mockHashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toContain('hashed_');
      expect(hashedPassword.length).toBe(password.length + 7); // 'hashed_' prefix
    });
  });

  describe('mockComparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle empty passwords', async () => {
      const password = '';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should be case-sensitive', async () => {
      const password = 'Password123';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword('password123', hashedPassword);
      expect(result).toBe(false);
    });

    it('should handle special characters in comparison', async () => {
      const password = 'P@ss!W0rd#2024';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false when comparing with incorrect hash format', async () => {
      const password = 'password123';
      const invalidHash = 'not_a_valid_hash';

      const result = await mockComparePassword(password, invalidHash);
      expect(result).toBe(false);
    });

    it('should handle whitespace differences', async () => {
      const password = 'password';
      const passwordWithSpace = 'password ';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(
        passwordWithSpace,
        hashedPassword
      );
      expect(result).toBe(false);
    });

    it('should work with complex unicode characters', async () => {
      const password = 'パスワード123';
      const hashedPassword = await mockHashPassword(password);

      const result = await mockComparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('Hash Algorithm Consistency', () => {
    it('should reverse the password string in the hash', async () => {
      const password = 'abc123';
      const hashedPassword = await mockHashPassword(password);

      // The mock hash algorithm reverses the string
      const expectedHash = 'hashed_321cba';
      expect(hashedPassword).toBe(expectedHash);
    });

    it('should verify the reversal logic in comparison', async () => {
      const password = 'test';
      const hashedPassword = 'hashed_tset'; // manually created reversed hash

      const result = await mockComparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('Performance and Async Behavior', () => {
    it('should complete hashing within reasonable time', async () => {
      const startTime = Date.now();
      await mockHashPassword('testPassword');
      const endTime = Date.now();

      // Should complete within 200ms (includes 100ms setTimeout)
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('should handle multiple concurrent hash operations', async () => {
      const passwords = ['pass1', 'pass2', 'pass3', 'pass4', 'pass5'];

      const hashPromises = passwords.map((pwd) => mockHashPassword(pwd));
      const hashes = await Promise.all(hashPromises);

      expect(hashes).toHaveLength(5);
      // All hashes should be unique
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(5);
    });

    it('should handle multiple concurrent compare operations', async () => {
      const password = 'testPassword';
      const hashedPassword = await mockHashPassword(password);

      const comparePromises = Array(5)
        .fill(null)
        .map(() => mockComparePassword(password, hashedPassword));

      const results = await Promise.all(comparePromises);

      expect(results).toHaveLength(5);
      expect(results.every((result) => result === true)).toBe(true);
    });
  });
});

