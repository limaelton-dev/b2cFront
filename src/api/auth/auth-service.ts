import { get, post } from "../http";
import { saveToken, removeToken, isAuthenticated } from "../../utils/auth";
import { ProfilePF, ProfilePJ, UserWithProfile } from "../user/types";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthUser,
} from "./types";

function computeDisplayName(user: UserWithProfile): string {
  if (!user.profile) {
    return user.email.split("@")[0];
  }

  if (user.profileType === "PF") {
    const pf = user.profile as ProfilePF;
    if (pf.firstName && pf.lastName) {
      return `${pf.firstName} ${pf.lastName}`;
    }
    if (pf.firstName) {
      return pf.firstName;
    }
  }

  if (user.profileType === "PJ") {
    const pj = user.profile as ProfilePJ;
    if (pj.tradingName) {
      return pj.tradingName;
    }
    if (pj.companyName) {
      return pj.companyName;
    }
  }

  return user.email.split("@")[0];
}

function toAuthUser(user: UserWithProfile): AuthUser {
  return {
    ...user,
    name: computeDisplayName(user),
  };
}

export async function login(payload: LoginRequest): Promise<AuthUser> {
  const data = await post<LoginResponse>("/auth/signin", payload);

  if (data?.access_token) {
    saveToken(data.access_token);
  }

  return toAuthUser(data.user);
}

export function logout(): void {
  removeToken();
}

export async function register(req: RegisterRequest): Promise<AuthUser> {
  const data = await post<LoginResponse>("/auth/signup", req);

  if (data?.access_token) {
    saveToken(data.access_token);
  }

  return toAuthUser(data.user);
}

export function isClientAuthenticated(): boolean {
  return isAuthenticated();
}

export async function getUserProfile(): Promise<AuthUser | null> {
  try {
    const data = await get<UserWithProfile>("/user/profile/details");
    return toAuthUser(data);
  } catch {
    return null;
  }
}
