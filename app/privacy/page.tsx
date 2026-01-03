export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 max-w-4xl mx-auto font-sans">
            <h1 className="text-4xl font-bold mb-8 text-neon-blue">Privacy Policy</h1>
            <p className="text-white/50 mb-8">Last Updated: January 2026</p>

            <div className="space-y-6 text-white/80 leading-relaxed">
                <p>Welcome to TapOS 360 ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy.</p>

                <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the web application, express an interest in obtaining information about us or our products and services, when you participate in activities on the web application (such as by posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.</p>

                <h2 className="text-xl font-bold text-white mt-8">2. How We Use Your Information</h2>
                <p>We use personal information collected via our web application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>

                <h2 className="text-xl font-bold text-white mt-8">3. Sharing Your Information</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

                <h2 className="text-xl font-bold text-white mt-8">4. Contact Us</h2>
                <p>If you have questions or comments about this policy, you may email us at support@tapos360.com</p>
            </div>

            <a href="/" className="inline-block mt-12 text-neon-blue hover:text-white transition">← Return to Home</a>
        </div>
    );
}
