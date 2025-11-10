import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function BecomeVendorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Grow Your Business on Nantucket
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Join the trusted marketplace connecting island professionals with homeowners who need quality work.
                  </p>
                  <div className="pt-4">
                    <Link href="/signup?type=vendor">
                      <Button size="lg">Get Started →</Button>
                    </Link>
                  </div>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/16067.jpg"
                    alt="Professional at Work"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Why Join NantucketPros?</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="text-3xl">🎯</div>
                  <h3 className="text-xl font-semibold">Quality Leads</h3>
                  <p className="text-muted-foreground">
                    Get matched with homeowners actively looking for your services. No more cold calling or expensive ads.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl">💰</div>
                  <h3 className="text-xl font-semibold">Fast Payments</h3>
                  <p className="text-muted-foreground">
                    Receive secure payments within days of job completion. No more chasing invoices or waiting 30-60 days.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl">📱</div>
                  <h3 className="text-xl font-semibold">Simple Management</h3>
                  <p className="text-muted-foreground">
                    Manage quotes, bookings, and customer communication all from one easy-to-use dashboard.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl">⭐</div>
                  <h3 className="text-xl font-semibold">Build Your Reputation</h3>
                  <p className="text-muted-foreground">
                    Earn reviews and showcase your work. Become the go-to professional in your category.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl">📊</div>
                  <h3 className="text-xl font-semibold">Grow Your Business</h3>
                  <p className="text-muted-foreground">
                    Access analytics and insights to understand your customers and optimize your services.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl">🤝</div>
                  <h3 className="text-xl font-semibold">Island Community</h3>
                  <p className="text-muted-foreground">
                    Join a network of trusted professionals serving the Nantucket community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                <p className="text-lg text-muted-foreground">
                  No monthly fees. No hidden charges. Just pay when you get paid.
                </p>
              </div>

              <div className="bg-muted/20 border border-border/40 rounded-lg p-8 md:p-12 text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold">5%</div>
                  <p className="text-xl text-muted-foreground">Commission per completed job</p>
                </div>
                <div className="border-t border-border/40 pt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span>✓</span>
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span>✓</span>
                    <span>No monthly subscription</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span>✓</span>
                    <span>Only pay for completed jobs</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span>✓</span>
                    <span>Free profile and messaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Vendor Requirements</h2>
                <p className="text-lg text-muted-foreground">
                  We maintain high standards to ensure quality for our homeowners.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Valid Business License</h3>
                    <p className="text-muted-foreground">
                      Must have all required state and local licenses for your trade.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Insurance Coverage</h3>
                    <p className="text-muted-foreground">
                      General liability insurance required. Workers' comp if you have employees.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Clean Background Check</h3>
                    <p className="text-muted-foreground">
                      Pass a basic background screening to ensure community safety.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Quality Work</h3>
                    <p className="text-muted-foreground">
                      Maintain high standards and positive customer reviews to stay on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Get Started */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Getting Started is Easy</h2>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and tell us about your business, services, and rates. Add photos of your best work.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Submit Verification</h3>
                    <p className="text-muted-foreground">
                      Upload your license, insurance, and business documents. We'll review within 48 hours.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Start Getting Leads</h3>
                    <p className="text-muted-foreground">
                      Once approved, your profile goes live. Start receiving quote requests from homeowners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <Link href="/signup?type=vendor">
                  <Button size="lg">Join NantucketPros Today →</Button>
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
