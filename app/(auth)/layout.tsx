import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - NantucketPros",
  description: "Sign in to your NantucketPros account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
