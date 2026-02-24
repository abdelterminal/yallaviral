export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-white">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-gray-300">
                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
                    <p>Yalla Viral respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">2. Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Technical Data, and Usage Data.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: To perform the contract we are about to enter into or have entered into with you.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">5. Compliance with Moroccan Law 09-08</h2>
                    <p>In accordance with Law No. 09-08 regarding the protection of individuals with respect to the processing of personal data, you have the right to access, rectify, and oppose the processing of your personal data.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-2">6. Contact Details</h2>
                    <p>For any questions regarding this privacy policy or our privacy practices, please contact us at privacy@yallaviral.ma.</p>
                </section>
            </div>
        </div>
    );
}
