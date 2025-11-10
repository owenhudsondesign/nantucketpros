import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-ibm-plex-sans',
});

export const metadata: Metadata = {
  title: "NantucketPros - Nantucket&apos;s Trusted Service Marketplace",
  description: "Connect with verified local tradespeople and service vendors on Nantucket. Find reliable professionals for your home projects.",
  keywords: ["Nantucket", "services", "vendors", "tradespeople", "home services", "contractors"],
  icons: {
    icon: "/nantucketpros-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.className}>{children}</body>
    </html>
  );
}
