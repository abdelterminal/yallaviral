import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
    const t = await getTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-foreground">
            <h1 className="text-3xl font-bold mb-8">{t('privacyTitle')}</h1>
            <p className="text-muted-foreground mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p>

            <div className="space-y-6 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacyIntroTitle')}</h2>
                    <p>{t('privacyIntroDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacyDataTitle')}</h2>
                    <p>{t('privacyDataDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacyUseTitle')}</h2>
                    <p>{t('privacyUseDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacySecurityTitle')}</h2>
                    <p>{t('privacySecurityDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacyLawTitle')}</h2>
                    <p>{t('privacyLawDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('privacyContactTitle')}</h2>
                    <p>{t('privacyContactDesc')}</p>
                </section>
            </div>
        </div>
    );
}
