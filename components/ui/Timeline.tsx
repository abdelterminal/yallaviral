"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
    id: string;
    title: string;
    description: string;
}

interface TimelineProps {
    steps: TimelineStep[];
    currentStep: number;
}

export function Timeline({ steps, currentStep }: TimelineProps) {
    return (
        <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-[1.2rem] before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-primary/50 before:via-muted before:to-transparent">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <div key={step.id} className="relative flex items-start gap-4">
                        {/* Circle Indicator */}
                        <div
                            className={cn(
                                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500",
                                isCompleted
                                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                                    : isActive
                                        ? "border-primary bg-background text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)] ring-4 ring-primary/10"
                                        : "border-muted bg-muted/20 text-muted-foreground"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="h-5 w-5 animate-in zoom-in spin-in-90" />
                            ) : (
                                <span className={cn("text-sm font-bold", isActive && "scale-110")}>
                                    {index + 1}
                                </span>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className={cn("pt-1 transition-all duration-300", isActive ? "opacity-100 translate-x-1" : "opacity-60")}>
                            <h3 className={cn("text-base font-bold leading-none", isActive && "text-primary")}>
                                {step.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 max-w-[180px]">
                                {step.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
