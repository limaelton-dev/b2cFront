import { get, post } from "../../http";
import { saveToken, removeToken, getAuthHeader, isAuthenticated } from "../../../utils/auth";
import { LoginRequest, LoginResponse } from "../types/Login";
import { RegisterRequest } from "../types/Register";
import { AuthUser, ProfileType } from "../types/AuthUser";

/**
 * Normaliza nome de exibição do usuário a partir do perfil.
 */
function computeDisplayName(user: AuthUser): string {
  if (user.profileType === ProfileType.PF) {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    if (user.profile?.fullName) {
      return user.profile.fullName;
    }
    return user.email.split("@")[0];
  }
  
  return user.profile?.companyName || user.email.split("@")[0];
}

/**
 * Normaliza dados de registro PF extraindo firstName/lastName do fullName se necessário.
 */
function normalizeRegisterData(req: RegisterRequest): any {
  const baseData = {
    email: req.email,
    password: req.password,
    profileType: req.profileType,
    profile: {},
  };

  if (req.profileType === ProfileType.PJ) {
    baseData.profile = {
      companyName: req.companyName || "",
      cnpj: req.cnpj || "",
      tradingName: req.tradingName || "",
      stateRegistration: req.stateRegistration || "",
      municipalRegistration: req.municipalRegistration || "",
    };
  } else {
    const firstName = 
      (req as any).firstName ?? 
      (req as any).name ?? 
      (req as any).fullName?.trim().split(" ")[0] ?? "";
    
    const lastName =
      (req as any).lastName ??
      (req as any).lastname ??
      (req as any).fullName?.trim().split(" ").slice(1).join(" ") ?? "";
    
    baseData.profile = {
      firstName,
      lastName,
      cpf: (req as any).cpf || "",
      birthDate: (req as any).birthDate || new Date().toISOString().split("T")[0],
      gender: (req as any).gender ?? null,
    };
  }

  return baseData;
}

/**
 * Realiza login e salva o token.
 */
export async function login(payload: LoginRequest): Promise<AuthUser> {
  const data = await post<LoginResponse>("/auth/signin", payload);
  
  if (data?.access_token) {
    saveToken(data.access_token);
  }
  
  return { ...data.user, name: computeDisplayName(data.user) };
}

/**
 * Remove token e limpa estado de autenticação.
 */
export function logout(): void {
  removeToken();
}

/**
 * Registra novo usuário e salva o token.
 */
export async function register(req: RegisterRequest): Promise<AuthUser> {
  const requestData = normalizeRegisterData(req);
  const data = await post<LoginResponse>("/auth/signup", requestData);
  
  if (data?.access_token) {
    saveToken(data.access_token);
  }
  
  return { ...data.user, name: computeDisplayName(data.user) };
}

/**
 * Verifica se o usuário está autenticado no client-side.
 * Reutiliza a lógica centralizada de utils/auth.ts
 */
export function isClientAuthenticated(): boolean {
  return isAuthenticated();
}

/**
 * Busca o perfil completo do usuário autenticado.
 */
export async function getUserProfile(): Promise<AuthUser | null> {
  const headers = getAuthHeader();
  if (!headers.Authorization) return null;
  
  const data = await get<AuthUser>("/user/profile/details", { headers });
  return { ...data, name: computeDisplayName(data) };
}
