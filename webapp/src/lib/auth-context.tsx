"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    institution?: string;
  }) => Promise<{ email: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "cespar_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      setToken(stored);
      try {
        const res = await api.get<{ user: AuthUser }>("/auth/me", stored);
        setUser(res.user);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    void restoreSession().then(() => setLoading(false));
  }, []);

  const applyAuth = useCallback((newToken: string, newUser: AuthUser) => {
    window.localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/login",
        { email, password }
      );
      applyAuth(res.token, res.user);
    },
    [applyAuth]
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      institution?: string;
    }) => {
      const res = await api.post<{ message: string; email: string }>(
        "/auth/register",
        data
      );
      return { email: res.email };
    },
    []
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/verify-email",
        { email, code }
      );
      applyAuth(res.token, res.user);
    },
    [applyAuth]
  );

  const resendOtp = useCallback(async (email: string) => {
    await api.post("/auth/resend-otp", { email });
  }, []);

  const updateProfile = useCallback(
    async (data: FormData) => {
      const res = await api.patchForm<{ user: AuthUser }>("/auth/me", data, token);
      setUser(res.user);
    },
    [token]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await api.post("/auth/change-password", { currentPassword, newPassword }, token);
    },
    [token]
  );

  const forgotPassword = useCallback(async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  }, []);

  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/reset-password",
        { email, code, newPassword }
      );
      applyAuth(res.token, res.user);
    },
    [applyAuth]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyEmail,
        resendOtp,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
