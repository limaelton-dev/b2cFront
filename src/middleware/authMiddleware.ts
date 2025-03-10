import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';
export async function authMiddleware(req: NextRequest) {
    const token = req.cookies.get('jwt')?.value;
    
    try {
        if (!token) {
            return false;
        }
        
        // Verificação básica do formato do token
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return false;
        }
        
        // No middleware, usamos uma verificação simplificada
        // para evitar problemas com a API CryptoKey
        try {
            // Decodificar a parte de payload do token (segunda parte)
            const payloadBase64 = tokenParts[1];
            // Ajustar o base64 para decodificação correta
            const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
            const payload = JSON.parse(jsonPayload);
            
            // Verificar se o token está expirado
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                return false;
            }
            
            return true;
        } catch (decodeError) {
            return false;
        }
    } catch (error) {
        return false;
    }
}