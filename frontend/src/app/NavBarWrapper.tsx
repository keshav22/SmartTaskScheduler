"use client";

import { usePathname } from "next/navigation";
import { LeftPanel } from "@/components/Navbar/left_panel";
import path from "path";

export default function NavWrapper({ children}: { children: React.ReactNode}){
    const pathname = usePathname();

    // where the navbar/left panel shouldnt be visible
    const authRoutes = ["/login", "/signup"];
    const isAuthPage = authRoutes.some(route => pathname.startsWith(route));

    if (isAuthPage) {
        return <div className="min-h-screen w-full">{children}</div>;
    }
    
    return (
        <div className="flex min-h-screen">
            <LeftPanel />
            <div className="flex-1 pl-66">
                {children}
            </div>
        </div>
    );
}
