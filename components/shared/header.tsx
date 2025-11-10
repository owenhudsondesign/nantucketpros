import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/nantucketpros-logo.svg"
              alt="NantucketPros Logo"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/vendors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Browse Businesses
            </Link>
            <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Community Feed
            </Link>
            <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/become-vendor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Businesses
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
