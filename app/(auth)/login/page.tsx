"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  // Check for error parameters in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        'auth_failed': 'Authentication failed. Please try again.',
        'no_user': 'Unable to authenticate. Please request a new magic link.',
        'profile_creation_failed': 'Failed to create user profile. Please contact support.',
        'no_code': 'Invalid authentication link. Please request a new magic link.',
      };
      setMessage({
        type: 'error',
        text: errorMessages[error] || 'An error occurred during sign in. Please try again.',
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for the magic link to sign in!",
        });
        setEmail("");
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
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Enter your email to receive a magic link to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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
            {isLoading ? "Sending magic link..." : "Send Magic Link"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-foreground hover:underline font-medium">
              Sign up
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
  );
}

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold text-foreground">NantucketPros</h1>
        </Link>
        <p className="mt-2 text-muted-foreground">Nantucket&apos;s Trusted Service Marketplace</p>
      </div>

      <Suspense fallback={<Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">Loading...</p></CardContent></Card>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
