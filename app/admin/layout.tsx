import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Panel - NantucketPros",
  description: "Manage platform, verify vendors, and handle disputes",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Admin Header */}
      <header className="bg-ocean-900 border-b border-ocean-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Image
                src="/nantucketpros-logo.svg"
                alt="NantucketPros"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-xl font-semibold text-white border-l border-ocean-600 pl-3">Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className="text-ocean-100 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/vendors" className="text-ocean-100 hover:text-white transition-colors">
                Vendors
              </Link>
              <Link href="/admin/bookings" className="text-ocean-100 hover:text-white transition-colors">
                Bookings
              </Link>
              <Link href="/admin/users" className="text-ocean-100 hover:text-white transition-colors">
                Users
              </Link>
              <Link href="/admin/settings" className="text-ocean-100 hover:text-white transition-colors">
                Settings
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" className="text-white hover:bg-ocean-800" type="submit">
                  Log Out
                </Button>
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
