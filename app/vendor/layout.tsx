import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vendor Dashboard - NantucketPros",
  description: "Manage your vendor profile, bookings, and earnings",
};

export default function VendorLayout({
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
            <Link href="/vendor/dashboard" className="flex items-center">
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
              <Link href="/vendor/dashboard" className="text-sand-700 hover:text-ocean-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/community" className="text-sand-700 hover:text-ocean-600 transition-colors">
                Community Feed
              </Link>
              <Link href="/vendor/bookings" className="text-sand-700 hover:text-ocean-600 transition-colors">
                Bookings
              </Link>
              <Link href="/vendor/messages" className="text-sand-700 hover:text-ocean-600 transition-colors">
                Messages
              </Link>
              <Link href="/vendor/profile" className="text-sand-700 hover:text-ocean-600 transition-colors">
                My Profile
              </Link>
              <Link href="/vendor/earnings" className="text-sand-700 hover:text-ocean-600 transition-colors">
                Earnings
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/vendor/settings">
                <Button variant="outline" size="sm">Settings</Button>
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
