import { fr } from "date-fns/locale/fr";
import { enUS } from "date-fns/locale/en-US";
import type { Locale } from "date-fns";

/**
 * Returns the date-fns locale object for the given app locale string.
 * Used to pass to date-fns format() calls for locale-aware date display.
 *
 * Usage (server component):
 *   import { getDateLocale } from "@/utils/date-locale";
 *   import { cookies } from "next/headers";
 *   const cookieStore = await cookies();
 *   const locale = cookieStore.get("NEXT_LOCALE")?.value || "fr";
 *   format(date, "PPP", { locale: getDateLocale(locale) })
 *
 * Usage (client component):
 *   import { useLocale } from "next-intl";
 *   import { getDateLocale } from "@/utils/date-locale";
 *   const locale = useLocale();
 *   format(date, "PPP", { locale: getDateLocale(locale) })
 */
export function getDateLocale(locale: string): Locale {
    switch (locale) {
        case "fr":
            return fr;
        case "en":
            return enUS;
        default:
            return fr; // Default to French, matching i18n/request.ts
    }
}
