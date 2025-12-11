/**
 * Configuração centralizada de rotas públicas e privadas.
 * Define quais rotas requerem autenticação.
 */

/** Rotas que apenas usuários NÃO autenticados podem acessar */
export const AUTH_ONLY_ROUTES = [
  '/login',
  '/cadastro',
] as const;

/** Rotas que requerem autenticação */
export const PROTECTED_ROUTES = [
  '/minhaconta',
  '/pedidos',
  '/checkout',
] as const;

/** Rota padrão para redirect após login */
export const DEFAULT_AUTH_REDIRECT = '/';

/** Rota padrão para redirect quando não autenticado */
export const DEFAULT_UNAUTH_REDIRECT = '/login';

/**
 * Verifica se a rota requer autenticação
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Verifica se a rota é apenas para usuários não autenticados
 */
export function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

