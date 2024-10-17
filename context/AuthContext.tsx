'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, validateToken } from '@/lib/api';

interface User {
  id: string;
  username: string;
  identifier: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado y validarlo
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Aquí deberías hacer una llamada a tu API para validar el token
          const responseUserData = await validateToken()
          if (responseUserData) {
            setUser(responseUserData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error validating token:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const data = await authApi({ identifier, password });
      const { user, jwt } = data;
      localStorage.setItem('token', jwt);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
