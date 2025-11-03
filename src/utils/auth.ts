// services/authUtils.ts

/**
 * MOCK Password Hashing Function.
 * In a real app, DO NOT DO THIS. Use a real library like bcrypt.
 * This just simulates the async nature and "hashing" (by reversing the string).
 *
 * @param password The plaintext password
 * @returns A "hashed" password
 */
export const mockHashPassword = (password: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hashedPassword = `hashed_${password.split('').reverse().join('')}`;
      resolve(hashedPassword);
    }, 100); // Simulate async work
  });
};

/**
 * MOCK Password Comparison Function.
 * In a real app, your hashing library (like bcrypt) would provide this.
 *
 * @param plaintextPassword The password the user typed in
 * @param hashedPassword The hash from the database
 * @returns True if they match
 */
export const mockComparePassword = async (
  plaintextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const hashedInput = await mockHashPassword(plaintextPassword);
  return hashedInput === hashedPassword;
};