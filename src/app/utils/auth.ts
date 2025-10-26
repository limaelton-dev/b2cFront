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

/** Lê o token JWT do cookie (client ou SSR se ctx fornecido). */
export function getToken(ctx?: CookieCtx): string | null {
  const raw: CookieValueTypes = getCookie(JWT_COOKIE_NAME, {
    req: ctx?.req,
    res: ctx?.res,
  });
  if (!raw || typeof raw !== "string") return null;
  return raw;
}

/** Retorna o header Authorization se houver token. */
export function getAuthHeader(ctx?: CookieCtx): Record<string, string> {
  const token = getToken(ctx);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Verifica se há um JWT com formato válido (3 partes). */
export function isAuthenticated(ctx?: CookieCtx): boolean {
  const token = getToken(ctx);
  if (!token) return false;
  try {
    const parts = token.split(".");
    return parts.length === 3;
  } catch {
    return false;
  }
}

/** Salva o token em cookie (não httpOnly). */
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

/** Remove o token do cookie. */
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

/** Opcional: injeta Authorization num AxiosRequestConfig. */
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
