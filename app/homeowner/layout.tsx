import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Homeowner Dashboard - NantucketPros",
  description: "Manage your bookings and find local service professionals",
};

export default function HomeownerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/homeowner/dashboard" className="flex items-center">
              <Image
                src="/nantucketpros-logo.svg"
                alt="NantucketPros"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/homeowner/dashboard" className="text-sand-700 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/homeowner/properties" className="text-sand-700 hover:text-foreground transition-colors">
                Properties
              </Link>
              <Link href="/vendors" className="text-sand-700 hover:text-foreground transition-colors">
                Find Vendors
              </Link>
              <Link href="/community" className="text-sand-700 hover:text-foreground transition-colors">
                Community Feed
              </Link>
              <Link href="/homeowner/bookings" className="text-sand-700 hover:text-foreground transition-colors">
                My Bookings
              </Link>
              <Link href="/homeowner/messages" className="text-sand-700 hover:text-foreground transition-colors">
                Messages
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/homeowner/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">Log Out</Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
