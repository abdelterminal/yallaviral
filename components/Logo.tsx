"use client";

import { cn } from "@/lib/utils";

export function YallaLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-8 w-8", className)}
        >
            <path
                d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/50"
            />
            <path
                d="M12 22V12M12 12L20 7M12 12L4 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
            />
            <path
                d="M8 10L12 12L16 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
            />
            <circle
                cx="12"
                cy="12"
                r="2"
                fill="currentColor"
                className="text-primary animate-pulse"
            />
        </svg>
    );
}
