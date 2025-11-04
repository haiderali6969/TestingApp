// __tests__/password-hashing-verification.test.ts
// Test to verify that passwords are actually getting hashed

import { mockHashPassword, mockComparePassword } from '../src/utils/auth';

describe('Password Hashing Verification', () => {
  describe('Verify Password is Getting Hashed', () => {
    it('should hash the password (not store plaintext)', async () => {
      const plainPassword = 'MySecurePassword123';
      const hashedPassword = await mockHashPassword(plainPassword);

      // Verify the password was transformed
      expect(hashedPassword).not.toBe(plainPassword);
      
      // Verify it has the hash prefix
      expect(hashedPassword).toContain('hashed_');
      
      // Verify it's not just adding a prefix (actual transformation happened)
      expect(hashedPassword).not.toBe(`hashed_${plainPassword}`);
    });

    it('should confirm hashed password is different from original', async () => {
      const passwords = [
        'Password1',
        'Test@123',
        'SecurePass456',
        'admin',
        '12345678'
      ];

      for (const password of passwords) {
        const hashed = await mockHashPassword(password);
        
        // Ensure none of the passwords are stored as plaintext
        expect(hashed).not.toBe(password);
        
        // Ensure all have been processed
        expect(hashed).toMatch(/^hashed_/);
        
        console.log(`✓ Password "${password}" → "${hashed}"`);
      }
    });

    it('should verify the hashing algorithm is working', async () => {
      const password = 'test123';
      const hashedPassword = await mockHashPassword(password);

      // The mock algorithm reverses the string
      const expectedHash = 'hashed_321tset';
      expect(hashedPassword).toBe(expectedHash);
      
      console.log(`✓ Hash algorithm working: "${password}" → "${hashedPassword}"`);
    });

    it('should demonstrate that comparison works with hashed passwords', async () => {
      const originalPassword = 'UserPassword456';
      
      // Step 1: Hash the password (like during signup)
      const hashedPassword = await mockHashPassword(originalPassword);
      console.log(`Step 1 - Signup: Password "${originalPassword}" hashed to "${hashedPassword}"`);
      
      // Step 2: Later, user tries to login with plaintext password
      const loginAttempt = 'UserPassword456';
      console.log(`Step 2 - Login: User enters "${loginAttempt}"`);
      
      // Step 3: Compare plaintext with stored hash
      const isMatch = await mockComparePassword(loginAttempt, hashedPassword);
      console.log(`Step 3 - Verify: Comparison result = ${isMatch}`);
      
      expect(isMatch).toBe(true);
      expect(hashedPassword).not.toBe(originalPassword);
    });

    it('should fail comparison if wrong password is provided', async () => {
      const correctPassword = 'CorrectPassword123';
      const wrongPassword = 'WrongPassword123';
      
      // Hash the correct password
      const hashedPassword = await mockHashPassword(correctPassword);
      
      // Try to login with wrong password
      const isMatch = await mockComparePassword(wrongPassword, hashedPassword);
      
      expect(isMatch).toBe(false);
      console.log(`✓ Security check: Wrong password correctly rejected`);
    });

    it('should demonstrate full signup and login flow with hashing', async () => {
      // SIGNUP FLOW
      const signupData = {
        email: 'user@example.com',
        password: 'MySecurePass123',
      };
      
      console.log('\n--- SIGNUP FLOW ---');
      console.log(`User registers with password: "${signupData.password}"`);
      
      // Hash password before storing (this is what happens in SignupScreen)
      const hashedPasswordForStorage = await mockHashPassword(signupData.password);
      console.log(`Password hashed for storage: "${hashedPasswordForStorage}"`);
      
      // Simulate storing in database
      const userInDatabase = {
        email: signupData.email,
        hashedPassword: hashedPasswordForStorage, // STORED AS HASH
      };
      
      expect(userInDatabase.hashedPassword).not.toBe(signupData.password);
      console.log('✓ Password stored as hash in database (NOT plaintext)');
      
      // LOGIN FLOW
      console.log('\n--- LOGIN FLOW ---');
      const loginAttempt = {
        email: 'user@example.com',
        password: 'MySecurePass123',
      };
      
      console.log(`User tries to login with password: "${loginAttempt.password}"`);
      
      // Compare plaintext login password with stored hash
      const isValidLogin = await mockComparePassword(
        loginAttempt.password,
        userInDatabase.hashedPassword
      );
      
      console.log(`Password comparison result: ${isValidLogin}`);
      expect(isValidLogin).toBe(true);
      console.log('✓ Login successful - password matched!');
      
      // TRY WRONG PASSWORD
      console.log('\n--- WRONG PASSWORD ATTEMPT ---');
      const wrongLoginAttempt = {
        email: 'user@example.com',
        password: 'WrongPassword123',
      };
      
      console.log(`Attacker tries password: "${wrongLoginAttempt.password}"`);
      const isInvalidLogin = await mockComparePassword(
        wrongLoginAttempt.password,
        userInDatabase.hashedPassword
      );
      
      console.log(`Password comparison result: ${isInvalidLogin}`);
      expect(isInvalidLogin).toBe(false);
      console.log('✓ Login failed - wrong password rejected!');
    });
  });
});

