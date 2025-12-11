// src/context/auth.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthContextType } from "./interfaces/AuthContextType";
import type { AuthUser, RegisterRequest, LoginRequest } from "../api/auth";
import {
  login as svcLogin,
  logout as svcLogout,
  register as svcRegister,
  getUserProfile,
  isClientAuthenticated,
} from "../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const isAuthenticated = !!user && isClientAuthenticated();

  const refreshProfile = useCallback(async () => {
    setError(undefined);
    try {
      const u = await getUserProfile();
      setUser(u);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar perfil");
      setUser(null);
    }
  }, []);

  const doLogin = useCallback(async (payload: LoginRequest) => {
    setLoading(true);
    setError(undefined);
    try {
      const u = await svcLogin(payload);
      setUser(u);
    } catch (e: any) {
      setError(e?.message ?? "Falha no login");
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const doRegister = useCallback(async (payload: RegisterRequest) => {
    setLoading(true);
    setError(undefined);
    try {
      const u = await svcRegister(payload);
      setUser(u);
    } catch (e: any) {
      setError(e?.message ?? "Falha no cadastro");
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const doLogout = useCallback(() => {
    svcLogout();
    setUser(null);
    setError(undefined);
  }, []);

  // boot inicial
  useEffect(() => {
    (async () => {
      if (isClientAuthenticated()) {
        await refreshProfile();
      }
      setLoading(false);
    })();
  }, [refreshProfile]);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
