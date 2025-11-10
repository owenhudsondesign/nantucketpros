"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/lib/types";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("homeowner");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Send magic link for signup
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the magic link to complete your signup!",
        });
        setEmail("");
        setFullName("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold text-foreground">NantucketPros</h1>
        </Link>
        <p className="mt-2 text-muted-foreground">Nantucket&apos;s Trusted Service Marketplace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Get started with NantucketPros in just a few seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                required
              >
                <option value="homeowner">Property owner or caretaker</option>
                <option value="vendor">Service business professional</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {role === "vendor"
                  ? "Create a business profile, receive booking requests, and grow your business"
                  : "Find and manage service professionals for your properties"}
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-foreground hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-foreground hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-foreground hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
