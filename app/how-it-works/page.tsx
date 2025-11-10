import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                How It Works
              </h1>
              <p className="text-xl text-muted-foreground">
                Getting help for your island home has never been easier
              </p>
            </div>
          </div>
        </section>

        {/* For Homeowners & Caretakers */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="text-5xl">🏠</div>
                <h2 className="text-3xl md:text-4xl font-bold">For Homeowners & Caretakers</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Whether you manage your own property or oversee multiple homes, finding quality service professionals is simple.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Browse Businesses</h3>
                    <p className="text-muted-foreground">
                      Search our directory of verified professionals by service category. Read reviews, compare prices, and view portfolios.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Request a Quote</h3>
                    <p className="text-muted-foreground">
                      Message professionals directly to discuss your project. Get detailed quotes and ask questions before committing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Book & Pay</h3>
                    <p className="text-muted-foreground">
                      Accept a quote and pay securely through our platform. Your payment is held until the work is complete.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Leave a Review</h3>
                    <p className="text-muted-foreground">
                      Once the job is done, rate your experience. Your feedback helps the community make better decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <Link href="/signup">
                  <Button size="lg">Get Started →</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Businesses */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="text-5xl">🔨</div>
                <h2 className="text-3xl md:text-4xl font-bold">For Service Businesses</h2>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and complete your business profile. Add your services, rates, portfolio photos, and business credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Get Verified</h3>
                    <p className="text-muted-foreground">
                      Submit your license and insurance documents. We verify all credentials to maintain trust in our marketplace.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Receive Requests</h3>
                    <p className="text-muted-foreground">
                      Get notified when property owners and caretakers request quotes for your services. Respond with custom proposals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Complete Jobs & Get Paid</h3>
                    <p className="text-muted-foreground">
                      Do the work, mark jobs complete, and receive payment automatically. Build your reputation with reviews.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <Link href="/become-vendor">
                  <Button size="lg">List Your Business →</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
