import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || '';
export async function authMiddleware(req: NextRequest) {
    const token = req.cookies.get('jwt')?.value;
    
    try {
        if (!token) {
            return false;
        }
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        return true;
    } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('cart')
        return false;
    }
}