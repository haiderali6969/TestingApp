// validation.ts - Validation utility functions

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email address format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailPattern.test(email)) {
    return { isValid: false, error: "Invalid email address" };
  }

  return { isValid: true };
};

/**
 * Validates password for login (basic validation)
 */
export const validateLoginPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  return { isValid: true };
};

/**
 * Validates password for signup (strong password requirements)
 */
export const validateSignupPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!strongPasswordPattern.test(password)) {
    return {
      isValid: false,
      error: "Password must contain uppercase, lowercase and number",
    };
  }

  return { isValid: true };
};

/**
 * Validates first name
 */
export const validateFirstName = (firstName: string): ValidationResult => {
  if (!firstName) {
    return { isValid: false, error: "First name is required" };
  }

  if (firstName.length < 2) {
    return {
      isValid: false,
      error: "First name must be at least 2 characters",
    };
  }

  return { isValid: true };
};

/**
 * Validates last name
 */
export const validateLastName = (lastName: string): ValidationResult => {
  if (!lastName) {
    return { isValid: false, error: "Last name is required" };
  }

  if (lastName.length < 2) {
    return { isValid: false, error: "Last name must be at least 2 characters" };
  }

  return { isValid: true };
};

/**
 * Validates phone number
 */
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber) {
    return { isValid: false, error: "Phone number is required" };
  }

  const phonePattern = /^[0-9]{6,15}$/;
  if (!phonePattern.test(phoneNumber)) {
    return { isValid: false, error: "Invalid phone number" };
  }

  return { isValid: true };
};

/**
 * Validates confirm password matches password
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }

  return { isValid: true };
};
