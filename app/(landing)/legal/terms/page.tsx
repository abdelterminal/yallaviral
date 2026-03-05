import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
    const t = await getTranslations('Legal');

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-foreground">
            <h1 className="text-3xl font-bold mb-8">{t('termsTitle')}</h1>
            <p className="text-muted-foreground mb-4">{t('lastUpdated', { date: new Date().toLocaleDateString() })}</p>

            <div className="space-y-6 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsAgreementTitle')}</h2>
                    <p>{t('termsAgreementDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsServicesTitle')}</h2>
                    <p>{t('termsServicesDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsAccountsTitle')}</h2>
                    <p>{t('termsAccountsDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsPaymentsTitle')}</h2>
                    <p>{t('termsPaymentsDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsIPTitle')}</h2>
                    <p>{t('termsIPDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsLawTitle')}</h2>
                    <p>{t('termsLawDesc')}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-2">{t('termsContactTitle')}</h2>
                    <p>{t('termsContactDesc')}</p>
                </section>
            </div>
        </div>
    );
}
