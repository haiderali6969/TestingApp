import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SecureStorage } from '../services/keychain';
// Import SecureStorage to clear credentials on logout

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
  signup: (user: any) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const login = (user: any) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  const signup = (user: any) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  /**
   * Logs the user out by:
   * 1. Clearing the in-memory state (user and isAuthenticated).
   * 2. (We now skip) Asynchronously removing credentials from SecureStorage.
   */
  const logout = async () => {
    try {
      // --- ✅ THIS IS THE FIX (PART 2) ---
      // We are NOT removing credentials on logout.
      // Your Login screen depends on these credentials
      // existing in SecureStorage to validate the user.
      // Removing them here makes it impossible to log back in.
      //
      // await SecureStorage.removeUserCredentials();
      //
      // --- END OF FIX (PART 2) ---

      console.log('User logged out, but credentials remain in keychain for next login.');
    } catch (error) {
      console.error('Failed to remove credentials on logout:', error);
    }
    // Clear the in-memory context state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, signup, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};