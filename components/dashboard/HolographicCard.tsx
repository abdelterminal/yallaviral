"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export function HolographicCard({ children, className, glowColor = "124, 58, 237" }: HolographicCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden rounded-xl",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(${glowColor}, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative flex h-full w-full flex-col">{children}</div>
        </div>
    );
}
