"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface BookingWithDetails {
  id: string;
  service_type: string;
  description: string;
  preferred_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number | null;
  payment_intent_id: string | null;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  customer: {
    id: string;
    full_name: string;
    email: string;
  };
  vendor: {
    id: string;
    business_name: string;
    category: string;
  };
  unread_messages?: number;
}

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("bookings")
        .select(`
          *,
          customer:users!bookings_customer_id_fkey(id, full_name, email),
          vendor:vendors(id, business_name, category)
        `)
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch unread message counts for each booking
      const bookingsWithMessages = await Promise.all(
        (data || []).map(async (booking: any) => {
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("booking_id", booking.id);

          return {
            ...booking,
            unread_messages: count || 0,
          } as BookingWithDetails;
        })
      );

      setBookings(bookingsWithMessages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({
        type: "error",
        text: "Failed to load bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      setMessage({
        type: "error",
        text: "Please provide a cancellation reason",
      });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);

      const query = supabase.from("bookings");
      // @ts-expect-error - Supabase generated types issue with update operation
      const { error } = await query.update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: `[Admin] ${cancellationReason.trim()}`,
      }).eq("id", selectedBooking.id);

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Booking cancelled successfully",
      });

      setShowCancelModal(false);
      setCancellationReason("");
      setSelectedBooking(null);
      await fetchBookings();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to cancel booking",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "confirmed":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-sand-600";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sand-600">Loading bookings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ocean-900">Booking Oversight</h1>
        <p className="text-sand-600 mt-2">
          Monitor and manage all platform bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
        >
          All ({bookings.length})
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === "confirmed" ? "default" : "outline"}
          onClick={() => setFilterStatus("confirmed")}
        >
          Confirmed
        </Button>
        <Button
          variant={filterStatus === "completed" ? "default" : "outline"}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filterStatus === "cancelled" ? "default" : "outline"}
          onClick={() => setFilterStatus("cancelled")}
        >
          Cancelled
        </Button>
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

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl">{bookings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl text-ocean-600">
              {formatCurrency(
                bookings
                  .filter((b) => b.status === "completed" && b.price)
                  .reduce((sum, b) => sum + (b.price || 0), 0)
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sand-600">No bookings found for this filter</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {booking.service_type}
                      <Badge
                        variant={getStatusBadgeVariant(booking.status)}
                        className={getStatusColor(booking.status)}
                      >
                        {booking.status}
                      </Badge>
                      {(booking.unread_messages || 0) > 0 && (
                        <Badge variant="destructive">
                          {booking.unread_messages} messages
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Booking #{booking.id.slice(0, 8)} • Created{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Parties Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                      Customer
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-sand-600">Name:</span>{" "}
                        <span className="font-medium">
                          {booking.customer.full_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-sand-600">Email:</span>{" "}
                        <span className="font-medium">{booking.customer.email}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                      Vendor
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-sand-600">Business:</span>{" "}
                        <span className="font-medium">
                          {booking.vendor.business_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-sand-600">Category:</span>{" "}
                        <span className="font-medium">{booking.vendor.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Booking Details */}
                <div>
                  <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-sand-600">Description:</span>
                      <p className="mt-1">{booking.description}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-sand-600">Preferred Date:</span>{" "}
                        <span className="font-medium">
                          {new Date(booking.preferred_date).toLocaleDateString()}
                        </span>
                      </div>
                      {booking.price && (
                        <div>
                          <span className="text-sand-600">Price:</span>{" "}
                          <span className="font-medium">
                            {formatCurrency(booking.price)}
                          </span>
                        </div>
                      )}
                    </div>
                    {booking.payment_intent_id && (
                      <div>
                        <span className="text-sand-600">Payment Intent:</span>{" "}
                        <span className="font-mono text-xs">
                          {booking.payment_intent_id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion/Cancellation Info */}
                {booking.completed_at && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <span className="text-sand-600">Completed:</span>{" "}
                      <span className="font-medium">
                        {new Date(booking.completed_at).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {booking.cancelled_at && (
                  <>
                    <Separator />
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-sand-600">Cancelled:</span>{" "}
                        <span className="font-medium">
                          {new Date(booking.cancelled_at).toLocaleString()}
                        </span>
                      </div>
                      {booking.cancellation_reason && (
                        <div>
                          <span className="text-sand-600">Reason:</span>{" "}
                          <span className="font-medium">
                            {booking.cancellation_reason}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Cancel Booking</CardTitle>
              <CardDescription>
                This action will cancel the booking and notify both parties.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-sand-600 mb-2">
                  Booking: <span className="font-medium">{selectedBooking.service_type}</span>
                </p>
                <p className="text-sm text-sand-600">
                  Between{" "}
                  <span className="font-medium">{selectedBooking.customer.full_name}</span>{" "}
                  and{" "}
                  <span className="font-medium">
                    {selectedBooking.vendor.business_name}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellation-reason">
                  Cancellation Reason *
                </Label>
                <Textarea
                  id="cancellation-reason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Explain why this booking is being cancelled..."
                  rows={4}
                  disabled={processing}
                />
                <p className="text-xs text-sand-500">
                  This reason will be visible to both the customer and vendor.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  onClick={handleCancelBooking}
                  disabled={processing || !cancellationReason.trim()}
                  className="flex-1"
                >
                  {processing ? "Cancelling..." : "Confirm Cancellation"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                    setCancellationReason("");
                  }}
                  disabled={processing}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
