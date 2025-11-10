"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorOnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const isRefresh = searchParams.get("refresh") === "true";

  useEffect(() => {
    if (user && !authLoading) {
      checkAccountStatus();
    }
  }, [user, authLoading]);

  const checkAccountStatus = async () => {
    try {
      const response = await fetch("/api/stripe/account-status");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check account status");
      }

      setAccountStatus(data);

      // If onboarding is complete, redirect to dashboard
      if (data.onboardingComplete) {
        router.push("/vendor/dashboard");
      }
    } catch (err: any) {
      console.error("Account status error:", err);
      setError(err.message);
    }
  };

  const handleStartOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create or get Stripe account
      const createResponse = await fetch("/api/stripe/create-account", {
        method: "POST",
      });
      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create Stripe account");
      }

      // Step 2: Create account link
      const linkResponse = await fetch("/api/stripe/account-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: createData.accountId }),
      });
      const linkData = await linkResponse.json();

      if (!linkResponse.ok) {
        throw new Error(linkData.error || "Failed to create onboarding link");
      }

      // Step 3: Redirect to Stripe onboarding
      window.location.href = linkData.url;
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sand-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">You must be logged in to access this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Setup</h1>
        <p className="text-muted-foreground mt-2">
          Complete your payment setup to start receiving bookings and getting paid
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Account Setup</CardTitle>
          <CardDescription>
            We use Stripe Connect to securely process payments and transfer funds to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isRefresh && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              Your onboarding session expired. Click below to continue where you left off.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold">Create your Stripe account</h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be redirected to Stripe to set up your payment account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold">Provide business information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your business details, tax information, and bank account for payouts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold">Start accepting bookings</h3>
                <p className="text-sm text-muted-foreground">
                  Once verified, you can receive booking requests and get paid directly
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-sm mb-2">What you&apos;ll need:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Social Security Number or EIN</li>
              <li>Date of birth</li>
              <li>Bank account details for payouts</li>
              <li>Business address</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleStartOnboarding}
              disabled={loading || accountStatus?.onboardingComplete}
              className="flex-1"
            >
              {loading
                ? "Redirecting to Stripe..."
                : accountStatus?.onboardingComplete
                ? "Onboarding Complete"
                : isRefresh
                ? "Continue Onboarding"
                : "Start Stripe Onboarding"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/vendor/dashboard")}
              disabled={loading}
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to Stripe&apos;s{" "}
            <a
              href="https://stripe.com/connect-account/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Connected Account Agreement
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
