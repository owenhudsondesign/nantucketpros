import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">NantucketPros</h3>
            <p className="text-sm text-muted-foreground">
              Nantucket&apos;s trusted marketplace for homeowners and service professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Property Owners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/vendors" className="hover:text-foreground transition-colors">
                  Find Businesses
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/trust-safety" className="hover:text-foreground transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">For Businesses</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/become-vendor" className="hover:text-foreground transition-colors">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/become-vendor#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#vendors" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NantucketPros. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
