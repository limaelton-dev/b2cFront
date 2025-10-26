import { get, post } from "../../http";
import { saveToken, removeToken, getToken, getAuthHeader } from "../../../utils/auth";

import { LoginRequest } from "../types/Login";
import { LoginResponse } from "../types/Login";
import { RegisterRequest } from "../types/Register";
import { AuthUser, ProfileType } from "../types/AuthUser";



/** Util: normaliza nome "name" do usuário a partir do payload do backend */
function computeDisplayName(u: AuthUser): string {
  if (u.profileType === ProfileType.PF) {
    if (u.profile?.firstName && u.profile?.lastName) {
      return `${u.profile.firstName} ${u.profile.lastName}`;
    }
    if (u.profile?.fullName) return u.profile.fullName;
    return u.email.split("@")[0];
  }
  return u.profile?.companyName || u.email.split("@")[0];
}

/** Login: salva token e retorna usuário */
export async function login(payload: LoginRequest): Promise<AuthUser> {
  const data = await post<LoginResponse>("/auth/signin", payload);
  if (data?.access_token) saveToken(data.access_token);
  const user: AuthUser = { ...data.user, name: computeDisplayName(data.user) };
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
}

export function logout(): void {
  removeToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

/** Registro: monta request compatível e salva token se vier */
export async function register(req: RegisterRequest): Promise<AuthUser> {
  // Normalização mínima de PF fullName -> first/last
  let requestData: any = { email: req.email, password: req.password, profileType: req.profileType, profile: {} };

  if (req.profileType === ProfileType.PJ) {
    requestData.profile = {
      companyName: req.companyName || "",
      cnpj: req.cnpj || "",
      tradingName: req.tradingName || "",
      stateRegistration: req.stateRegistration || "",
      municipalRegistration: req.municipalRegistration || ""
    };
  } else {
    const firstName = (req as any).firstName ?? (req as any).name ?? ((req as any).fullName?.trim().split(" ")[0] ?? "");
    const lastName =
      (req as any).lastName ??
      (req as any).lastname ??
      ((req as any).fullName ? (req as any).fullName.trim().split(" ").slice(1).join(" ") : "");
    requestData.profile = {
      firstName,
      lastName,
      cpf: (req as any).cpf || "",
      birthDate: (req as any).birthDate || new Date().toISOString().split("T")[0],
      gender: (req as any).gender ?? null
    };
  }

  const data = await post<LoginResponse>("/auth/signup", requestData);
  if (data?.access_token) saveToken(data.access_token);
  const user: AuthUser = { ...data.user, name: computeDisplayName(data.user) };
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
}

/** Checagem leve de auth no cliente: existem token e (opcional) exp válido */
export function isClientAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const json = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof json?.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      if (json.exp <= now) return false;
    }
    return true;
  } catch {
    return true; // se não conseguir decodificar, deixa o backend decidir
  }
}

/** Perfil do usuário (autenticado) */
export async function getUserProfile(): Promise<AuthUser | null> {
  const headers = getAuthHeader();
  if (!headers.Authorization) return null;
  const data = await get<AuthUser>("/user/profile/details", { headers });
  const user: AuthUser = { ...data, name: computeDisplayName(data) };
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
}
