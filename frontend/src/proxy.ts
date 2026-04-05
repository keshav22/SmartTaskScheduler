import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest){
    const token = request.cookies.get('sb-access-token');
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/focus', '/tasks', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtectedRoute && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    // routes we want to protect
    matcher: ['/focus/:path*', '/tasks/:path*', '/settings/:path*'],
}