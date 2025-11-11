"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyOnboarding();
  }, []);

  const verifyOnboarding = async () => {
    try {
      const response = await fetch("/api/stripe/account-status");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify onboarding status");
      }

      setStatus(data);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600 mx-auto mb-4"></div>
            <p className="text-sand-600">Verifying your Stripe account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Verification Error</CardTitle>
            <CardDescription>There was a problem verifying your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-sand-600">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/vendor/onboarding")} className="flex-1">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/vendor/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <CardTitle className="text-2xl">
            {status?.onboardingComplete
              ? "Onboarding Complete!"
              : "Almost There!"}
          </CardTitle>
          <CardDescription>
            {status?.onboardingComplete
              ? "Your payment account is set up and ready to receive payments"
              : "Your account is being reviewed by Stripe"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status?.onboardingComplete ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-green-900">Account Verified</p>
                    <p className="text-green-700">You can now receive booking payments</p>
                  </div>
                </div>

                {status?.chargesEnabled && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-green-900">Payments Enabled</p>
                      <p className="text-green-700">You can accept customer payments</p>
                    </div>
                  </div>
                )}

                {status?.payoutsEnabled && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-green-900">Payouts Enabled</p>
                      <p className="text-green-700">Funds will be transferred to your bank</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm text-ocean-900 mb-3">Next Steps:</h4>
                <ul className="space-y-2 text-sm text-sand-600">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean-600 mt-0.5">•</span>
                    <span>Your profile is now visible to Nantucket homeowners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean-600 mt-0.5">•</span>
                    <span>You&apos;ll receive email notifications for new booking requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean-600 mt-0.5">•</span>
                    <span>Payments are transferred within 2-7 business days after service completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean-600 mt-0.5">•</span>
                    <span>Platform fee: 10% per booking</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Your account information is being verified by Stripe. This usually takes a few
                minutes, but can take up to 24 hours. We&apos;ll send you an email when your
                account is ready.
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Link href="/vendor/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/vendor/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
