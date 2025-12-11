import { ProfilePF, ProfilePJ, ProfileType, UserWithProfile } from "../user/types";

// =============================================================================
// AUTH TYPES
// =============================================================================

// -----------------------------------------------------------------------------
// Login
// -----------------------------------------------------------------------------
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserWithProfile;
}

// -----------------------------------------------------------------------------
// Register
// -----------------------------------------------------------------------------
export interface RegisterRequestBase {
  email: string;
  password: string;
}

export interface RegisterRequestPF extends RegisterRequestBase {
  profileType: "PF";
  profile: Omit<ProfilePF, "id">;
}

export interface RegisterRequestPJ extends RegisterRequestBase {
  profileType: "PJ";
  profile: Omit<ProfilePJ, "id">;
}

export interface RegisterRequestSimple extends RegisterRequestBase {
  profileType?: never;
  profile?: never;
}

export type RegisterRequest =
  | RegisterRequestSimple
  | RegisterRequestPF
  | RegisterRequestPJ;

// -----------------------------------------------------------------------------
// AuthUser (usuário autenticado com nome de exibição)
// -----------------------------------------------------------------------------
export interface AuthUser extends UserWithProfile {
  name: string;
}

export type { ProfileType } from "../user/types";

