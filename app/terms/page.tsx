export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 max-w-4xl mx-auto font-sans">
            <h1 className="text-4xl font-bold mb-8 text-neon-blue">Terms of Service</h1>
            <p className="text-white/50 mb-8">Last Updated: January 2026</p>

            <div className="space-y-6 text-white/80 leading-relaxed">
                <h2 className="text-xl font-bold text-white mt-8">1. Agreement to Terms</h2>
                <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and TapOS 360 concerning your access to and use of the TapOS 360 website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>

                <h2 className="text-xl font-bold text-white mt-8">2. Intellectual Property Rights</h2>
                <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>

                <h2 className="text-xl font-bold text-white mt-8">3. User Representations</h2>
                <p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>

                <h2 className="text-xl font-bold text-white mt-8">4. Prohibited Activities</h2>
                <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
            </div>

            <a href="/" className="inline-block mt-12 text-neon-blue hover:text-white transition">← Return to Home</a>
        </div>
    );
}
