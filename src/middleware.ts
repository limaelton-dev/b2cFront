import { NextRequest, NextResponse } from 'next/server';
import { isUserAuthenticated } from './middleware/authMiddleware';
import { 
  isProtectedRoute, 
  isAuthOnlyRoute, 
  DEFAULT_AUTH_REDIRECT, 
  DEFAULT_UNAUTH_REDIRECT 
} from './config/routes';

/**
 * Middleware principal de autenticação.
 * Protege rotas privadas e redireciona usuários autenticados de rotas de auth.
 */
export async function middleware(req: NextRequest) {
  // Bypass em modo debug
  if (process.env.NEXT_PUBLIC_STATE_DEV === 'debug') {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;
  const authenticated = isUserAuthenticated(req);

  // Rotas que requerem autenticação
  if (isProtectedRoute(pathname)) {
    if (!authenticated) {
      const loginUrl = new URL(DEFAULT_UNAUTH_REDIRECT, req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rotas apenas para não autenticados (login, cadastro)
  if (isAuthOnlyRoute(pathname)) {
    if (authenticated) {
      const redirectTo = req.nextUrl.searchParams.get('redirect') || DEFAULT_AUTH_REDIRECT;
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/cadastro', 
    '/minhaconta/:path*',
    '/pedidos/:path*',
    '/checkout/:path*',
  ],
};