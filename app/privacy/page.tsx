import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto prose prose-lg space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Profile information including photos and service descriptions</li>
                  <li>Messages and communications sent through our platform</li>
                  <li>Reviews and ratings</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Verify vendor credentials and conduct background checks</li>
                  <li>Prevent fraud and ensure platform safety</li>
                  <li>Analyze usage patterns and improve user experience</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                <p className="text-muted-foreground">
                  We share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>With other users:</strong> When you book a service or send a quote request, relevant contact information is shared with the vendor.</li>
                  <li><strong>Service providers:</strong> We share information with third-party service providers who help us operate our platform (payment processing, email services, analytics).</li>
                  <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                  <li><strong>Business transfers:</strong> Information may be transferred if we are involved in a merger, acquisition, or sale of assets.</li>
                </ul>
                <p className="text-muted-foreground">
                  We never sell your personal information to third parties.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We use industry-standard security measures to protect your information, including encryption, secure servers, and access controls. Payment information is processed through Stripe and never stored on our servers.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Your Rights and Choices</h2>
                <p className="text-muted-foreground">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your personal information through your account settings</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to collect information about your browsing activities. This helps us improve our platform and provide personalized experiences. You can control cookies through your browser settings.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your information for as long as your account is active or as needed to provide services. Even after account deletion, we may retain certain information for legal compliance, dispute resolution, and platform safety.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Children&apos;s Privacy</h2>
                <p className="text-muted-foreground">
                  Our platform is not intended for users under 18 years of age. We do not knowingly collect information from children.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">9. International Users</h2>
                <p className="text-muted-foreground">
                  Our services are operated in the United States. If you are located outside the US, your information will be transferred to and processed in the United States.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;last updated&quot; date.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <p className="text-muted-foreground">
                  Email: privacy@nantucketpros.com<br />
                  Address: Nantucket, MA
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
