import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { getMe } from '../services/api.service'; 
interface User {
  id: number;
  name: string;
  email: string;
  role: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);

      const fetchUser = async () => {
        try {
          const userData = await getMe(savedToken); 
          setUser(userData); 
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout(); 
        }
      };

      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};