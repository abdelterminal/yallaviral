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
            className={cn("group relative border border-border bg-card shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]",
                className
            )}
        >
            <div className="relative flex h-full w-full flex-col">{children}</div>
        </div>
    );
}
