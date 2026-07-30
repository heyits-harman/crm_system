import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '../types/crm';
import { parseJwt } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('crm_token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      const parsedUser = parseJwt(token);
      if (parsedUser) {
        setUser(parsedUser);
      } else {
        localStorage.removeItem('crm_token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('crm_token', newToken);
    setToken(newToken);
    const parsedUser = parseJwt(newToken);
    if (parsedUser) {
      setUser(parsedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
