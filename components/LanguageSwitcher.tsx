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
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 w-fit shadow-sm">
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
                                ? "bg-white text-[#0B0E17] shadow-sm transform scale-100"
                                : "text-white/50 hover:text-white hover:bg-white/10 transform scale-95"
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
