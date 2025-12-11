// src/context/interfaces/AuthContextType.ts
import type { AuthUser, RegisterRequest, LoginRequest } from "../../api/auth";

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error?: string;

  isAuthenticated: boolean;

  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;

  refreshProfile: () => Promise<void>;
}
