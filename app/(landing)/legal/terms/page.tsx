export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-white">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">1. Agreement to Terms</h2>
                    <p>By accessing or using Yalla Viral, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access the service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">2. Services Description</h2>
                    <p>Yalla Viral creates UGC (User Generated Content) campaigns connecting brands with creators. We act as a platform to facilitate these connections and manage campaign workflows.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">3. User Accounts</h2>
                    <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">4. Payments</h2>
                    <p>Services are billed as per the agreed quotation or subscription plan. For Moroccan entities, payments can be processed via bank transfer (Virement Bancaire) upon issuance of a valid invoice (Facture).</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">5. Intellectual Property</h2>
                    <p>The service and its original content, features, and functionality are and will remain the exclusive property of Yalla Viral and its licensors.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">6. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of Morocco, without regard to its conflict of law provisions.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">7. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us via WhatsApp or email at support@yallaviral.ma.</p>
                </section>
            </div>
        </div>
    );
}
