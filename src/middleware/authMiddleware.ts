import { NextRequest } from 'next/server';

/**
 * Verifica se o usuário está autenticado através do JWT no cookie.
 * Valida formato do token e expiração.
 */
export function isUserAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get('jwt')?.value;
  
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decodifica o payload
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(jsonPayload);
    
    // Verifica a expiração
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    
    return true;
  } catch {
    return false;
  }
}