// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd verify the token here
      setUser({ id: '1', email: 'admin@example.com', name: 'Admin' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you'd call your API here
    if (email === 'admin@example.com' && password === 'password') {
      const user = { id: '1', email, name: 'Admin' };
      setUser(user);
      localStorage.setItem('token', 'dummy-jwt-token');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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