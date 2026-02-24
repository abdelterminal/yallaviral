import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
    // 1. Try cookie
    const cookieStore = await cookies();
    let locale = cookieStore.get('NEXT_LOCALE')?.value;

    // 2. Fallback to Accept-Language header
    if (!locale) {
        const headerStore = await headers();
        const acceptLang = headerStore.get('accept-language') || '';
        if (acceptLang.toLowerCase().includes('fr')) {
            locale = 'fr';
        }
    }

    // 3. Default to French
    if (!locale || !['en', 'fr'].includes(locale)) {
        locale = 'fr';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
