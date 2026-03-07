"use client";

import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
];

export function LanguageSwitcher() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentLocale, setCurrentLocale] = useState("en");

    useEffect(() => {
        const match = document.cookie.match(/NEXT_LOCALE=(\w+)/);
        if (match) setCurrentLocale(match[1]);
    }, []);

    function switchLocale(locale: string) {
        if (locale === currentLocale || isPending) return;
        setCurrentLocale(locale);
        document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <div className="flex items-center bg-muted rounded-full p-1 w-fit shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]">
            {languages.map((lang) => {
                const isActive = currentLocale === lang.code;
                return (
                    <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        disabled={isPending}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-black tracking-widest transition-all duration-200",
                            isActive
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                        )}
                        aria-pressed={isActive}
                        aria-label={`Switch to ${lang.code}`}
                    >
                        {lang.label}
                    </button>
                );
            })}
        </div>
    );
}
