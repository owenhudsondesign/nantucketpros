"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const supabase = createClient();

  const [booking, setBooking] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (user) {
      fetchBookingDetails();
    }
  }, [params.id, user]);

  useEffect(() => {
    if (paymentStatus === "success") {
      setMessage({ type: "success", text: "Payment successful! Your booking is now confirmed." });
    } else if (paymentStatus === "cancelled") {
      setMessage({ type: "error", text: "Payment was cancelled. You can try again below." });
    }
  }, [paymentStatus]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);

      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(
            id,
            business_name,
            category,
            is_verified,
            stripe_account_id
          )
        `)
        .eq("id", params.id)
        .single();

      if (bookingError) throw bookingError;

      if (bookingData.customer_id !== user!.id) {
        throw new Error("Unauthorized");
      }

      setBooking(bookingData);
      setVendor(bookingData.vendor);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      setMessage({ type: "error", text: "Failed to load booking details" });
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking?.price || !vendor?.stripe_account_id) {
      setMessage({ type: "error", text: "Payment information is not available" });
      return;
    }

    setPaymentLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: params.id,
          vendorStripeAccountId: vendor.stripe_account_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setMessage({ type: "error", text: error.message || "Failed to initiate payment" });
      setPaymentLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", params.id)
        .eq("customer_id", user!.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Booking cancelled successfully" });
      setTimeout(() => router.push("/homeowner/bookings"), 1500);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      setMessage({ type: "error", text: "Failed to cancel booking" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Booking not found</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      completed: { variant: "secondary", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };

    const info = statusMap[status] || statusMap.pending;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Payment Pending" },
      paid: { className: "bg-green-100 text-green-800 border-green-200", label: "Paid" },
      failed: { className: "bg-red-100 text-red-800 border-red-200", label: "Payment Failed" },
      refunded: { className: "bg-gray-100 text-gray-800 border-gray-200", label: "Refunded" },
    };

    const info = statusMap[status] || statusMap.pending;
    return <Badge variant="secondary" className={info.className}>{info.label}</Badge>;
  };

  const needsPayment = booking.status === "confirmed" && booking.payment_status === "pending" && booking.price;
  const canCancel = booking.status === "pending" || (booking.status === "confirmed" && booking.payment_status === "pending");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
          <p className="text-muted-foreground mt-2">Manage your service booking</p>
        </div>
        <Link href="/homeowner/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(booking.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getPaymentStatusBadge(booking.payment_status || "pending")}
          </CardContent>
        </Card>
      </div>

      {/* Vendor Information */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/vendors/${vendor?.id}`} className="text-lg font-semibold hover:underline">
                  {vendor?.business_name}
                </Link>
                {vendor?.is_verified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <Badge variant="outline">{vendor?.category}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-1">Service Type</h4>
            <p className="text-muted-foreground">{booking.service_type}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{booking.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">Preferred Date</h4>
              <p className="text-muted-foreground">
                📅 {new Date(booking.preferred_date).toLocaleDateString()}
              </p>
            </div>

            {booking.price && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Price</h4>
                <p className="text-2xl font-bold text-foreground">${booking.price.toFixed(2)}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground pt-4 border-t">
            <p>Booking created {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      {needsPayment && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Payment Required</CardTitle>
            <CardDescription className="text-blue-700">
              The vendor has confirmed your booking. Please complete payment to secure your service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-900">${booking.price.toFixed(2)}</span>
                <span className="text-sm text-blue-700">+ processing fees</span>
              </div>

              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Payment held securely until service completion</li>
                <li>Full refund available if service is not delivered</li>
                <li>5% platform fee supports verified vendors</li>
              </ul>

              <Button
                onClick={handlePayment}
                disabled={paymentLoading}
                size="lg"
                className="w-full"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  "Pay Now with Stripe"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {canCancel && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
