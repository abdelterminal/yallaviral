"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export function HolographicCard({ children, className }: HolographicCardProps) {
    return (
        <div
            className={cn("group relative bg-card shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)] overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            <div className="relative flex h-full w-full flex-col">{children}</div>
        </div>
    );
}
