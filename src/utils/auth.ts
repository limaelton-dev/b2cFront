import type { IncomingMessage, ServerResponse } from "http";
import { getCookie, setCookie, deleteCookie, CookieValueTypes } from "cookies-next";
import type { AxiosRequestConfig } from "axios";

export type CookieCtx = { req?: IncomingMessage; res?: ServerResponse };

export type CookieOptions = {
  req?: IncomingMessage;
  res?: ServerResponse;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

export const JWT_COOKIE_NAME = "jwt";

/**
 * Lê o token JWT do cookie (client ou SSR se ctx fornecido).
 */
export function getToken(ctx?: CookieCtx): string | null {
  const raw: CookieValueTypes = getCookie(JWT_COOKIE_NAME, {
    req: ctx?.req,
    res: ctx?.res,
  });
  if (!raw || typeof raw !== "string") return null;
  return raw;
}

/**
 * Retorna o header Authorization se houver token.
 */
export function getAuthHeader(ctx?: CookieCtx): Record<string, string> {
  const token = getToken(ctx);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Decodifica o payload de um JWT sem verificar a assinatura.
 * Útil para verificações básicas no client-side.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Verifica se o token JWT está expirado.
 */
function isTokenExpired(payload: Record<string, any>): boolean {
  if (!payload.exp || typeof payload.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

/**
 * Verifica se há um JWT válido (formato correto e não expirado).
 * Esta é a função central de validação de autenticação.
 */
export function isAuthenticated(ctx?: CookieCtx): boolean {
  const token = getToken(ctx);
  if (!token) return false;
  
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  
  return !isTokenExpired(payload);
}

/**
 * Salva o token em cookie.
 */
export function saveToken(
  token: string,
  options?: CookieOptions,
  ctx?: CookieCtx
): void {
  const secure = process.env.NODE_ENV === "production";
  setCookie(
    JWT_COOKIE_NAME,
    token,
    {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
      sameSite: "lax",
      secure,
      ...options,
      req: ctx?.req,
      res: ctx?.res,
    }
  );
}

/**
 * Remove o token do cookie.
 */
export function removeToken(options?: CookieOptions, ctx?: CookieCtx): void {
  deleteCookie(
    JWT_COOKIE_NAME,
    {
      path: "/",
      ...options,
      req: ctx?.req,
      res: ctx?.res,
    }
  );
}

/**
 * Injeta Authorization header em um AxiosRequestConfig.
 */
export function withAuthHeader<T = any>(
  config: AxiosRequestConfig<T> = {},
  ctx?: CookieCtx
): AxiosRequestConfig<T> {
  const hdr = getAuthHeader(ctx);
  return {
    ...config,
    headers: { ...(config.headers || {}), ...hdr },
  };
}
