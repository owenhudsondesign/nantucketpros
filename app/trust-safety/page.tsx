import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Trust & Safety
              </h1>
              <p className="text-xl text-muted-foreground">
                Your peace of mind is our priority
              </p>
            </div>
          </div>
        </section>

        {/* Vendor Verification */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="text-5xl">✓</div>
                <h2 className="text-3xl md:text-4xl font-bold">Vendor Verification</h2>
                <p className="text-lg text-muted-foreground">
                  Every vendor on NantucketPros goes through a rigorous screening process before they can accept jobs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">License Verification</h3>
                  <p className="text-muted-foreground">
                    We verify all required professional licenses are current and valid for the services offered.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Insurance Requirements</h3>
                  <p className="text-muted-foreground">
                    All vendors must carry general liability insurance and workers' compensation where applicable.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Background Checks</h3>
                  <p className="text-muted-foreground">
                    We conduct background screenings to ensure vendors meet our community standards.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Business Verification</h3>
                  <p className="text-muted-foreground">
                    We confirm business registration and tax identification to ensure legitimacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Secure Payments */}
        <section className="border-t border-border/40 py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="text-5xl">💳</div>
                <h2 className="text-3xl md:text-4xl font-bold">Secure Payments</h2>
                <p className="text-lg text-muted-foreground">
                  Your financial information is protected with bank-level security.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Escrow Protection</h3>
                  <p className="text-muted-foreground">
                    When you book a service, your payment is held securely in escrow. Vendors are paid only after you confirm the work is complete to your satisfaction.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Encrypted Transactions</h3>
                  <p className="text-muted-foreground">
                    All payments are processed through Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Dispute Resolution</h3>
                  <p className="text-muted-foreground">
                    If issues arise, our team mediates disputes to ensure fair outcomes for both homeowners and vendors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Ratings */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="text-5xl">⭐</div>
                <h2 className="text-3xl md:text-4xl font-bold">Verified Reviews</h2>
                <p className="text-lg text-muted-foreground">
                  Only customers who have completed bookings can leave reviews.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Authentic Feedback</h3>
                  <p className="text-muted-foreground">
                    All reviews are from verified customers who actually hired the vendor through our platform.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">No Fake Reviews</h3>
                  <p className="text-muted-foreground">
                    We monitor for suspicious activity and remove any reviews that violate our authenticity standards.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Two-Way Accountability</h3>
                  <p className="text-muted-foreground">
                    Vendors can also rate homeowners, promoting respectful interactions on both sides.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Data */}
        <section className="border-t border-border/40 py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="text-5xl">🔒</div>
                <h2 className="text-3xl md:text-4xl font-bold">Privacy & Data Security</h2>
                <p className="text-lg text-muted-foreground">
                  We take your privacy seriously and protect your personal information.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Data Protection</h3>
                  <p className="text-muted-foreground">
                    Your personal information is encrypted and stored securely. We never sell your data to third parties.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Controlled Sharing</h3>
                  <p className="text-muted-foreground">
                    Your contact information is only shared with vendors when you initiate a booking or quote request.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">GDPR Compliant</h3>
                  <p className="text-muted-foreground">
                    We follow international best practices for data privacy and give you control over your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="text-5xl">💬</div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Questions or Concerns?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our support team is here to help. Contact us anytime if you have questions about trust and safety on our platform.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
