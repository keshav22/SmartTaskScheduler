// frontend/src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) { // Added 'default'
    const token = request.cookies.get('sb-access-token')?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ['/focus', '/tasks', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        // Redirecting to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    console.log("Path:", pathname, "Has Token:", !!token);
    console.log("Token: ", token);

    return NextResponse.next();
}

export const config = {
    matcher: ['/focus/:path*', '/tasks/:path*', '/settings/:path*','/focus',   // Add base paths explicitly
        '/tasks', 
        '/settings'],
};