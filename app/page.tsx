import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
          <FloatingBubbles />

          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                  <Image
                    src="/nantucketpros-favicon.svg"
                    alt="NantucketPros Icon"
                    width={140}
                    height={140}
                    priority
                    className="relative"
                  />
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  Nantucket&apos;s<br />
                  Service<br />
                  Marketplace
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect property owners and caretakers with Nantucket&apos;s most trusted service professionals
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    Get Started →
                  </Button>
                </Link>
                <Link href="/vendors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-7 rounded-2xl border-2 hover:bg-muted/50 transition-all">
                    Browse Businesses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="border-t border-border/40 py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Browse Services by Category
                </h2>
                <p className="text-xl text-muted-foreground">
                  Find the perfect professional for your project
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <Link href="/vendors?category=Plumbing" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🔧</div>
                    <h3 className="relative font-semibold text-lg">Plumbing</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Electrical" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">⚡</div>
                    <h3 className="relative font-semibold text-lg">Electrical</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=HVAC" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">❄️</div>
                    <h3 className="relative font-semibold text-lg">HVAC</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Carpentry" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🪚</div>
                    <h3 className="relative font-semibold text-lg">Carpentry</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Painting" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🎨</div>
                    <h3 className="relative font-semibold text-lg">Painting</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Landscaping" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🌳</div>
                    <h3 className="relative font-semibold text-lg">Landscaping</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Roofing" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🏠</div>
                    <h3 className="relative font-semibold text-lg">Roofing</h3>
                  </div>
                </Link>

                <Link href="/vendors?category=Cleaning" className="group">
                  <div className="relative bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative text-5xl mb-4">🧹</div>
                    <h3 className="relative font-semibold text-lg">Cleaning</h3>
                  </div>
                </Link>
              </div>

              <div className="text-center mt-12">
                <Link href="/vendors">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-muted/50 transition-all">
                    View All Categories →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Homeowners */}
        <section className="border-t border-border/40 py-20 md:py-28 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <div className="text-6xl">🏠</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground">For Homeowners</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Your island home deserves the best. Find trusted local professionals who understand Nantucket.
                  </p>
                </div>
                <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                  <Image
                    src="/andrew-wolff-6HFdIyUjeL4-unsplash.jpg"
                    alt="Nantucket Harbor"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every vendor is screened, licensed, and insured. No guesswork, just quality work.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold mb-3">Direct Communication</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Message vendors directly, get quotes, and manage everything in one place.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pay with confidence. Funds are held securely until work is complete.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold mb-3">Real Reviews</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Read reviews from other islanders who&apos;ve worked with vendors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Caretakers */}
        <section className="border-t border-border/40 py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 order-2 md:order-1">
                  <Image
                    src="/autumn-hassett-sysHdscCMqE-unsplash (1).jpg"
                    alt="Nantucket Aerial View"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div className="text-6xl">🔑</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground">For Caretakers</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Managing multiple properties? Coordinate services seamlessly for all your clients.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-3">Multi-Property Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Oversee service requests across all properties you manage from one dashboard.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold mb-3">Trusted Network</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Build relationships with reliable vendors you can count on season after season.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-3">Clear Documentation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Keep records of all services, communications, and payments in one place.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">⏱️</div>
                  <h3 className="text-xl font-semibold mb-3">Save Time</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Stop making endless phone calls. Request quotes and book services instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Businesses */}
        <section className="border-t border-border/40 py-20 md:py-28 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <div className="text-6xl">🔨</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground">For Businesses</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Grow your business on Nantucket. Connect with homeowners who need your expertise.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
                    <Image
                      src="/fraem-gmbh-rBY5Ek86oOI-unsplash.jpg"
                      alt="Landscaping Services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
                    <Image
                      src="/4182.jpg"
                      alt="Plumbing Services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
                    <Image
                      src="/16067.jpg"
                      alt="Construction Services"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
                    <Image
                      src="/7996.jpg"
                      alt="Cleaning Services"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-3">Find Quality Leads</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get matched with homeowners actively looking for your services.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-3">Get Paid Faster</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Secure payments processed automatically when jobs are complete.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-3">Manage Everything Online</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Handle bookings, quotes, and communication all from your phone or computer.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl p-8 shadow-sm">
                  <div className="text-3xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold mb-3">Build Your Reputation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Earn reviews and grow your profile as the go-to expert in your field.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/become-vendor">
                  <Button size="lg" className="text-lg px-8 py-7 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    List Your Business →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/40 py-24 md:py-32 bg-muted/30">
          <div className="container mx-auto px-8 md:px-12">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground px-4">
                Ready to get started?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed px-6">
                Join the community of homeowners, caretakers, and service professionals making island living easier.
              </p>
              <div className="pt-6">
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-10 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                    Create Your Account →
                  </Button>
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
