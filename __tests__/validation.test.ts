// __tests__/validation.test.ts

import {
  validateEmail,
  validateLoginPassword,
  validateSignupPassword,
  validateFirstName,
  validateLastName,
  validatePhoneNumber,
  validateConfirmPassword,
} from '../src/utils/validation';

describe('Email Validation', () => {
  describe('validateEmail', () => {
    it('should return valid for a correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for email with special characters', () => {
      const result = validateEmail('user.name+tag@example.co.uk');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return invalid for email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email address');
    });

    it('should return invalid for email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email address');
    });

    it('should return invalid for email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email address');
    });

    it('should return invalid for email with spaces', () => {
      const result = validateEmail('test @example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email address');
    });
  });
});

describe('Password Validation', () => {
  describe('validateLoginPassword', () => {
    it('should return valid for any non-empty password', () => {
      const result = validateLoginPassword('password');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for short password', () => {
      const result = validateLoginPassword('123');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty password', () => {
      const result = validateLoginPassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });
  });

  describe('validateSignupPassword', () => {
    it('should return valid for strong password', () => {
      const result = validateSignupPassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for password with special characters', () => {
      const result = validateSignupPassword('Pass123!@#');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty password', () => {
      const result = validateSignupPassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should return invalid for password less than 8 characters', () => {
      const result = validateSignupPassword('Pass1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should return invalid for password without uppercase', () => {
      const result = validateSignupPassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must contain uppercase, lowercase and number'
      );
    });

    it('should return invalid for password without lowercase', () => {
      const result = validateSignupPassword('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must contain uppercase, lowercase and number'
      );
    });

    it('should return invalid for password without number', () => {
      const result = validateSignupPassword('PasswordOnly');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must contain uppercase, lowercase and number'
      );
    });

    it('should return invalid for password with only numbers', () => {
      const result = validateSignupPassword('12345678');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Password must contain uppercase, lowercase and number'
      );
    });
  });
});

describe('Name Validation', () => {
  describe('validateFirstName', () => {
    it('should return valid for a correct first name', () => {
      const result = validateFirstName('John');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for 2-character name', () => {
      const result = validateFirstName('Jo');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for long name', () => {
      const result = validateFirstName('Christopher');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty first name', () => {
      const result = validateFirstName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('First name is required');
    });

    it('should return invalid for single character', () => {
      const result = validateFirstName('J');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('First name must be at least 2 characters');
    });
  });

  describe('validateLastName', () => {
    it('should return valid for a correct last name', () => {
      const result = validateLastName('Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for 2-character name', () => {
      const result = validateLastName('Li');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for long name', () => {
      const result = validateLastName('Schwarzenegger');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty last name', () => {
      const result = validateLastName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Last name is required');
    });

    it('should return invalid for single character', () => {
      const result = validateLastName('D');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Last name must be at least 2 characters');
    });
  });
});

describe('Phone Number Validation', () => {
  describe('validatePhoneNumber', () => {
    it('should return valid for a correct 10-digit phone number', () => {
      const result = validatePhoneNumber('1234567890');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for minimum 6-digit phone number', () => {
      const result = validatePhoneNumber('123456');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for maximum 15-digit phone number', () => {
      const result = validatePhoneNumber('123456789012345');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty phone number', () => {
      const result = validatePhoneNumber('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Phone number is required');
    });

    it('should return invalid for phone number less than 6 digits', () => {
      const result = validatePhoneNumber('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });

    it('should return invalid for phone number more than 15 digits', () => {
      const result = validatePhoneNumber('1234567890123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });

    it('should return invalid for phone number with letters', () => {
      const result = validatePhoneNumber('123abc7890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });

    it('should return invalid for phone number with special characters', () => {
      const result = validatePhoneNumber('123-456-7890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });

    it('should return invalid for phone number with spaces', () => {
      const result = validatePhoneNumber('123 456 7890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid phone number');
    });
  });
});

describe('Confirm Password Validation', () => {
  describe('validateConfirmPassword', () => {
    it('should return valid when passwords match', () => {
      const password = 'Password123';
      const confirmPassword = 'Password123';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for matching complex passwords', () => {
      const password = 'MyC0mpl3x!Pass@2024';
      const confirmPassword = 'MyC0mpl3x!Pass@2024';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when passwords do not match', () => {
      const password = 'Password123';
      const confirmPassword = 'Password456';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should return invalid when confirm password is empty', () => {
      const password = 'Password123';
      const confirmPassword = '';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });

    it('should be case sensitive', () => {
      const password = 'Password123';
      const confirmPassword = 'password123';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should detect even small differences', () => {
      const password = 'Password123';
      const confirmPassword = 'Password123 '; // extra space
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should work with special characters', () => {
      const password = 'P@ssw0rd!#$%';
      const confirmPassword = 'P@ssw0rd!#$%';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(true);
    });

    it('should work with unicode characters', () => {
      const password = 'パスワード123';
      const confirmPassword = 'パスワード123';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when both are empty', () => {
      const password = '';
      const confirmPassword = '';
      const result = validateConfirmPassword(password, confirmPassword);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });
  });
});

