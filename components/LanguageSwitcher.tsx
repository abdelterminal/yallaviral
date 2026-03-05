"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function LanguageSwitcher() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function switchLocale(locale: string) {
        // Set cookie and refresh
        document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                    disabled={isPending}
                >
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-40 bg-card border-border  text-foreground"
            >
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className="focus:bg-muted cursor-pointer gap-2"
                    >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
