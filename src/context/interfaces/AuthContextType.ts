// src/context/interfaces/AuthContextType.ts
import { AuthUser } from "../../api/auth/types/AuthUser";
import { RegisterRequest } from "../../api/auth/types/Register";
import { LoginRequest } from "../../api/auth/types/Login";

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
