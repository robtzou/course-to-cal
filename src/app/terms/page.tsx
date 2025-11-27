export default function TermsOfService() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start px-8 pt-24 pb-8 md:p-24 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="prose prose-invert w-full space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using Course to Calendar, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                    <p>
                        Course to Calendar provides a tool to parse course schedules from images and sync them to Google Calendar.
                        We reserve the right to modify, suspend, or discontinue the service at any time.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
                        You agree to use the service only for lawful purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">4. Disclaimer of Warranties</h2>
                    <p>
                        The service is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted,
                        error-free, or free of viruses or other harmful components. We are not responsible for any inaccuracies in the parsed schedule data.
                        Please verify all events in your calendar.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                    <p>
                        In no event shall Course to Calendar be liable for any direct, indirect, incidental, special, or consequential damages
                        arising out of or in connection with the use of the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to Terms</h2>
                    <p>
                        We reserve the right to update these Terms of Service at any time. Your continued use of the service after any such changes
                        constitutes your acceptance of the new Terms of Service.
                    </p>
                </section>
            </div>
        </main>
    );
}
