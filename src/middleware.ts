import { authMiddleware } from './middleware/authMiddleware';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.pathname;
    const stateDev = process.env.NEXT_PUBLIC_STATE_DEV || '';
    
    if(stateDev == 'debug')
        return NextResponse.next();

    if (url.startsWith('/') || url.startsWith('/login')) { // Colocar a rota específica para esse middleware aqui
        const authResponse = await authMiddleware(req);
        if(!authResponse) {
            if(!url.startsWith('/login')) {
                return NextResponse.redirect(new URL('/login', req.url))
            }
        }
        else {
            if(url.startsWith('/login')) {
                return NextResponse.redirect(new URL('/', req.url))
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login'],
};