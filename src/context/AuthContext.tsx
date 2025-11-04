import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
  signup: (user: any) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const AUTH_SESSION_KEY = "@auth_session";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await AsyncStorage.getItem(AUTH_SESSION_KEY);
        if (sessionData) {
          const { user: storedUser } = JSON.parse(sessionData);
          setUser(storedUser);
          setIsAuthenticated(true);
          console.log("Session restored from storage");
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = async (user: any) => {
    try {
      await AsyncStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user, timestamp: Date.now() })
      );
      setIsAuthenticated(true);
      setUser(user);
      console.log("Login successful: Session saved to storage");
    } catch (error) {
      console.error("Failed to save session:", error);
      setIsAuthenticated(true);
      setUser(user);
    }
  };

  const signup = async (user: any) => {
    try {
      await AsyncStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user, timestamp: Date.now() })
      );
      setIsAuthenticated(true);
      setUser(user);
      console.log("Signup successful: Session saved to storage");
    } catch (error) {
      console.error("Failed to save session:", error);
      setIsAuthenticated(true);
      setUser(user);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_SESSION_KEY);
      console.log("User logged out: Session cleared from storage");
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, signup, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
