"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, AuthContextType, SignupData } from "@/types";
import { loginUser, signupUser, logoutUser } from "@/services/authService";
import { saveToken, getToken, removeToken, saveUser, getSavedUser } from "@/utils/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getSavedUser<User>();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await loginUser(email, password);
        // Backend has a typo: uses `succes` not `success` on login
        const ok = res.success || res.succes;
        if (!ok || !res.user || !res.token) {
          return { success: false, message: res.message || "Invalid credentials" };
        }
        saveToken(res.token);
        saveUser(res.user);
        setToken(res.token);
        setUser(res.user);
        return { success: true, message: "Logged in!" };
      } catch (err: unknown) {
        const error = err as { message?: string };
        return { success: false, message: error?.message || "Server error" };
      }
    },
    []
  );

  const signup = useCallback(async (data: SignupData) => {
    try {
      const res = await signupUser(data);
      if (!res.success) {
        return { success: false, message: res.message || "Signup failed" };
      }
      return { success: true, message: "Account created! Please log in." };
    } catch (err: unknown) {
      const error = err as { message?: string };
      return { success: false, message: error?.message || "Server error" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // ignore server errors on logout
    } finally {
      removeToken();
      setUser(null);
      setToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside <AuthProvider>");
  return ctx;
};
