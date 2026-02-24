"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function GlowProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [shouldGlow, setShouldGlow] = useState(false);

    useEffect(() => {
        if (!pathname) return;

        // Define the paths where the glow effect should be active
        const allowedPrefixes = [
            "/dashboard",
            "/requests", // Campaigns
            "/campaign", // Discover
            "/studio",   // Studios
            "/analytics" // Analytics
        ];

        const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));
        setShouldGlow(isAllowed);
    }, [pathname]);

    return (
        <div
            className="contents"
            style={{
                // @ts-ignore - CSS custom properties are valid but TS complains sometimes
                "--card-glow-opacity": shouldGlow ? "1" : "0"
            } as React.CSSProperties}
        >
            {children}
        </div>
    );
}
