import { createContext, useContext, useState, type ReactNode } from 'react';
import { apiService } from '../services/apiService';

export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  indexNumber?: string;
  academicTitle?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (loginInput: string, password: string) => Promise<boolean>;
  demoLogin: (role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (loginInput: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiService.login(loginInput, password);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Blad logowania w AuthContext:', err);
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Blad logowania';
      throw new Error(errorMessage);
    }
  };

  const demoLogin = async (role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiService.demoLogin(role);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, demoLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
