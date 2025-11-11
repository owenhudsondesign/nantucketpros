"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingStatus } from "@/lib/types";
import { BookingCardSkeleton } from "@/components/shared/loading-skeletons";

export default function VendorBookingsPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [processingBooking, setProcessingBooking] = useState<string | null>(null);

  // For accept modal
  const [acceptingBooking, setAcceptingBooking] = useState<any | null>(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (user) {
      fetchVendorProfile();
    }
  }, [user]);

  useEffect(() => {
    if (vendorId) {
      fetchBookings();
    }
  }, [vendorId]);

  const fetchVendorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      const vendorData = data as any;
      setVendorId(vendorData.id);
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          customer:users!bookings_customer_id_fkey(id, full_name, email)
        `)
        .eq("vendor_id", vendorId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, "default" | "warning" | "success" | "destructive"> = {
      pending: "warning",
      confirmed: "default",
      completed: "success",
      cancelled: "destructive",
    };

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const handleAcceptBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptingBooking || !price) return;

    setProcessingBooking(acceptingBooking.id);

    try {
      const priceAmount = parseFloat(price);
      if (isNaN(priceAmount) || priceAmount <= 0) {
        alert("Please enter a valid price");
        setProcessingBooking(null);
        return;
      }

      // Optimistic UI update - immediately show booking as confirmed
      const previousBookings = [...bookings];
      setBookings(bookings.map(booking =>
        booking.id === acceptingBooking.id
          ? { ...booking, status: 'confirmed', price: priceAmount }
          : booking
      ));
      setAcceptingBooking(null);
      setPrice("");

      // Call API to accept booking and create payment intent
      const response = await fetch("/api/bookings/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: acceptingBooking.id,
          price: priceAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Rollback on failure
        setBookings(previousBookings);
        throw new Error(data.error || "Failed to accept booking");
      }

      alert("Booking accepted! Customer will be notified to complete payment.");
      // Refetch to ensure we have the latest server state
      fetchBookings();
    } catch (error: any) {
      console.error("Error accepting booking:", error);
      alert(error.message || "Failed to accept booking. Please try again.");
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to decline this booking request?")) {
      return;
    }

    setProcessingBooking(bookingId);

    try {
      const query = supabase.from("bookings");
      const { error } = await query
        // @ts-expect-error - Supabase type inference issue with update
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: "Declined by vendor",
        })
        .eq("id", bookingId)
        .eq("vendor_id", vendorId!)
        .eq("status", "pending");

      if (error) throw error;

      alert("Booking declined.");
      fetchBookings();
    } catch (error) {
      console.error("Error declining booking:", error);
      alert("Failed to decline booking. Please try again.");
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (!confirm("Mark this booking as completed? This will trigger the payment release.")) {
      return;
    }

    setProcessingBooking(bookingId);

    try {
      const response = await fetch("/api/bookings/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete booking");
      }

      alert("Booking marked as completed! Payment will be transferred within 2-7 business days.");
      fetchBookings();
    } catch (error: any) {
      console.error("Error completing booking:", error);
      alert(error.message || "Failed to complete booking. Please try again.");
    } finally {
      setProcessingBooking(null);
    }
  };

  if (!user || profile?.role !== "vendor") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Only vendors can view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ocean-900">My Bookings</h1>
        <p className="text-sand-600 mt-2">Manage booking requests and track service completion</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-sand-600">No booking requests yet.</p>
            <p className="text-sm text-sand-500">
              Complete your profile and Stripe onboarding to start receiving bookings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      {booking.customer?.full_name || "Customer"}
                    </CardTitle>
                    <CardDescription>
                      {getStatusBadge(booking.status)}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-sand-600">
                    <p>Requested: {new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-900 mb-1">
                      Service Type
                    </h4>
                    <p className="text-sand-700">{booking.service_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-900 mb-1">
                      Preferred Date
                    </h4>
                    <p className="text-sand-700">
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ocean-900 mb-1">
                    Description
                  </h4>
                  <p className="text-sand-700 text-sm whitespace-pre-line">{booking.description}</p>
                </div>

                {booking.price && (
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-900 mb-1">Price</h4>
                    <p className="text-2xl font-bold text-ocean-600">
                      ${booking.price.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  {booking.status === "pending" && (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setAcceptingBooking(booking)}
                        disabled={processingBooking === booking.id}
                        className="flex-1"
                      >
                        Accept & Set Price
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeclineBooking(booking.id)}
                        disabled={processingBooking === booking.id}
                      >
                        Decline
                      </Button>
                    </div>
                  )}

                  {booking.status === "confirmed" && !booking.stripe_payment_intent_id && (
                    <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
                      Waiting for customer payment...
                    </p>
                  )}

                  {booking.status === "confirmed" && booking.stripe_payment_intent_id && (
                    <div className="space-y-3">
                      <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                        Payment received! Complete the service and mark as done.
                      </p>
                      <Button
                        onClick={() => handleCompleteBooking(booking.id)}
                        disabled={processingBooking === booking.id}
                        className="w-full"
                      >
                        Mark as Completed
                      </Button>
                    </div>
                  )}

                  {booking.status === "completed" && (
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                      ✓ Service completed. Payment will be transferred to your account within 2-7 business days.
                    </p>
                  )}

                  {booking.status === "cancelled" && (
                    <p className="text-sm text-sand-600 bg-sand-50 p-3 rounded-md">
                      Booking cancelled
                      {booking.cancellation_reason && `: ${booking.cancellation_reason}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Accept Booking Modal */}
      {acceptingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Accept Booking & Set Price</CardTitle>
              <CardDescription>
                Set your price for this service. The customer will be charged this amount.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAcceptBooking} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sand-600">$</span>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-7"
                      min="0"
                      step="0.01"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="text-xs text-sand-600 bg-sand-50 p-3 rounded-md">
                  <p className="font-semibold mb-1">Platform fee: 10%</p>
                  {price && !isNaN(parseFloat(price)) && (
                    <p>
                      You will receive: ${(parseFloat(price) * 0.90).toFixed(2)} (after platform fee)
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={!price || processingBooking === acceptingBooking.id} className="flex-1">
                    {processingBooking === acceptingBooking.id ? "Processing..." : "Accept Booking"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAcceptingBooking(null);
                      setPrice("");
                    }}
                    disabled={processingBooking === acceptingBooking.id}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
