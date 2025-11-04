export const mockHashPassword = (password: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hashedPassword = `hashed_${password.split("").reverse().join("")}`;
      resolve(hashedPassword);
    }, 100);
  });
};

export const mockComparePassword = async (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const hashedInput = await mockHashPassword(plaintextPassword);
  return hashedInput === hashedPassword;
};
