import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import type { ProfilePatch, UserProfile } from '../types/user';

interface AuthContextValue {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  completeSignup: (email: string, code: string) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getSession());

  const login = useCallback(async (email: string, password: string) => {
    setUser(await authService.login(email, password));
  }, []);

  const completeSignup = useCallback(async (email: string, code: string) => {
    setUser(await authService.verifySignup(email, code));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      if (!user) return;
      setUser(await authService.updateProfile(user.id, patch));
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, login, completeSignup, logout, updateProfile }),
    [user, login, completeSignup, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}