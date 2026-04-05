// to ensure someone doesnt directly open localhost:3000 and open webpages unauthenticated

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy (request: NextRequest){
    // check if user has session cookie
    const authCookie = request.cookies.get('sb-access-token');
    const { pathname } = request.nextUrl;
    // will add other pages too later

    if (pathname.startsWith('/focus') && !authCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/focus/:path*'],
}
