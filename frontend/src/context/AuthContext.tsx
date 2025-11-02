// frontend/src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
// --- (AuthUser, AuthContextType, AuthContext, parseJwt... no changes here) ---

interface AuthUser {
  username: string;
  role: 'admin' | 'user';
}
interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): AuthUser {
  // ... (this function is correct, no changes)
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  const { username, role } = JSON.parse(jsonPayload);
  return { username, role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // --- 2. Wrap login in useCallback ---
  const login = useCallback((newToken: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    const decodedUser = parseJwt(newToken);
    setToken(newToken);
    setUser(decodedUser);
  }, []); // Empty dependency array means it never changes

  // --- 3. Wrap logout in useCallback ---
  const logout = useCallback(() => {
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []); // Empty dependency array means it never changes

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}