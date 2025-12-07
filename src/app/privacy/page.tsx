export default function PrivacyPolicy() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start px-8 pt-24 pb-8 md:p-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="prose prose-invert w-full space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                    <p>
                        Welcome to Course to Calendar ("we," "our," or "us"). We are committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use our
                        application to sync your course schedule to Google Calendar.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Google Account Information:</strong> When you sign in with Google, we collect your email address
                            and basic profile information to authenticate you.
                        </li>
                        <li>
                            <strong>Calendar Data:</strong> We request access to your Google Calendar to add events. We do not read,
                            modify, or delete existing events unless explicitly related to the schedules you create with us.
                        </li>
                        <li>
                            <strong>Uploaded Content:</strong> We process the course schedule images you upload to extract course details.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                    <p>We use the information we collect solely to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Authenticate your identity.</li>
                        <li>Parse your course schedule from uploaded images.</li>
                        <li>Create corresponding events in your Google Calendar.</li>
                    </ul>
                    <p className="mt-4">
                        We do not sell, trade, or rent your personal identification information to others.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Disclosure</h2>
                    <p>
                        We take your privacy seriously. We do not sell, trade, or transfer your Google user data to outside parties.
                        We do not share your personal information with third parties except as described in this policy:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>
                            <strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us
                            in operating our application (e.g., cloud hosting), so long as those parties agree to keep this information confidential.
                        </li>
                        <li>
                            <strong>Legal Compliance:</strong> We may disclose your information when we believe release is appropriate to comply
                            with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
                        </li>
                    </ul>
                    <p className="mt-2 text-sm italic">
                        We explicitly affirm that we do not share or transfer your Google user data to any third-party tools for the purposes
                        of AI model training or surveillance.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention and Deletion</h2>
                    <p>
                        We retain your data only for as long as necessary to fulfill the purposes outlined in this policy.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>
                            <strong>Temporary Processing:</strong> Course schedule images uploaded for processing are held in memory only
                            for the duration of the parsing session and are deleted immediately after the calendar events are generated.
                        </li>
                        <li>
                            <strong>User Account Data:</strong> We may retain basic profile information associated with your account
                            for as long as your account is active.
                        </li>
                        <li>
                            <strong>Deletion Request:</strong> You have the right to request the deletion of your data. To request deletion
                            of your data, please contact us at the email provided below. We will ensure your data is removed from our
                            records within 30 days of your request.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">6. Data Storage and Security</h2>
                    <p>
                        We prioritize your data security. The images you upload are processed temporarily to extract data and are
                        not permanently stored on our servers. Authentication tokens are handled securely via standard OAuth 2.0 protocols.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">7. Third-Party Services</h2>
                    <p>
                        Our service integrates with Google APIs. Please review <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> to understand how they handle your data.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us.
                    </p>
                </section>
            </div>
        </main>
    );
}
