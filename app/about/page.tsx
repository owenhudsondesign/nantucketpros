import Image from "next/image";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                About NantucketPros
              </h1>
              <p className="text-xl text-muted-foreground">
                Building a trusted community for island living
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                  <p className="text-lg text-muted-foreground">
                    NantucketPros was born from a simple observation: finding reliable service professionals on the island was unnecessarily difficult.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Homeowners struggled to find trusted vendors. Caretakers juggled phone calls and spreadsheets. Quality professionals had no easy way to connect with clients who needed their expertise.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    We built NantucketPros to solve these problems—creating a platform that brings transparency, trust, and simplicity to island services.
                  </p>
                </div>
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="/andrew-wolff-3qqcab2FmeE-unsplash.jpg"
                    alt="Nantucket Beach"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="border-t border-border/40 py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  To make island living easier by connecting homeowners, caretakers, and service professionals in one trusted platform.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="space-y-3 text-center">
                  <div className="text-4xl">🤝</div>
                  <h3 className="text-xl font-semibold">Trust</h3>
                  <p className="text-muted-foreground">
                    Every vendor is verified, licensed, and insured. We vet professionals so you don't have to.
                  </p>
                </div>
                <div className="space-y-3 text-center">
                  <div className="text-4xl">💡</div>
                  <h3 className="text-xl font-semibold">Simplicity</h3>
                  <p className="text-muted-foreground">
                    One platform for all your service needs. No more juggling contacts, quotes, and payments.
                  </p>
                </div>
                <div className="space-y-3 text-center">
                  <div className="text-4xl">🌊</div>
                  <h3 className="text-xl font-semibold">Community</h3>
                  <p className="text-muted-foreground">
                    Built for Nantucket, by people who understand island living and its unique challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Island Roots</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're a small team with deep ties to Nantucket. We understand the seasonal rhythms, the unique challenges of island logistics, and the importance of trusted relationships in this community.
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our goal is simple: make it easier for everyone who loves this island to maintain and improve their piece of it.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
