"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [booking, setBooking] = useState<any>(null);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (user && params.id) {
      fetchBookingAndReview();
    }
  }, [user, params.id]);

  const fetchBookingAndReview = async () => {
    try {
      setLoading(true);

      // Fetch booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(id, business_name, category)
        `)
        .eq("id", params.id)
        .eq("customer_id", user!.id)
        .single();

      if (bookingError) throw bookingError;

      if (!bookingData) {
        throw new Error("Booking not found");
      }

      if (bookingData.status !== "completed") {
        throw new Error("Can only review completed bookings");
      }

      setBooking(bookingData);

      // Check for existing review
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("booking_id", params.id)
        .single();

      if (reviewData) {
        setExistingReview(reviewData);
        setRating(reviewData.rating);
        setComment(reviewData.comment || "");
      }
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to load booking information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (rating === 0) {
        throw new Error("Please select a rating");
      }

      if (comment.length > 500) {
        throw new Error("Comment must not exceed 500 characters");
      }

      const reviewData = {
        booking_id: params.id as string,
        vendor_id: booking.vendor.id,
        customer_id: user!.id,
        rating,
        comment: comment.trim() || null,
      };

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            comment: comment.trim() || null,
          })
          .eq("id", existingReview.id);

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Review updated successfully!",
        });
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert(reviewData);

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Review submitted successfully! Thank you for your feedback.",
        });
      }

      // Redirect to bookings after a delay
      setTimeout(() => {
        router.push("/homeowner/bookings");
      }, 2000);
    } catch (error: any) {
      console.error("Review submission error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Unable to load booking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/homeowner/bookings")}>
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {existingReview ? "Edit Review" : "Leave a Review"}
        </h1>
        <p className="text-muted-foreground mt-2">Share your experience with {booking.vendor.business_name}</p>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vendor</span>
            <span className="font-semibold">{booking.vendor.business_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold">{booking.service_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed</span>
            <span className="font-semibold">
              {new Date(booking.completed_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
          <CardDescription>
            Help other homeowners by sharing your honest feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-4xl focus:outline-none transition-transform hover:scale-110"
                  >
                    <span
                      className={
                        star <= (hoverRating || rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {rating === 0
                  ? "Click to rate"
                  : rating === 1
                  ? "Poor"
                  : rating === 2
                  ? "Fair"
                  : rating === 3
                  ? "Good"
                  : rating === 4
                  ? "Very Good"
                  : "Excellent"}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Comments (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your experience, quality of work, professionalism, communication, etc."
                rows={6}
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">{comment.length}/500 characters</p>
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

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting || rating === 0} className="flex-1">
                {submitting
                  ? "Submitting..."
                  : existingReview
                  ? "Update Review"
                  : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/homeowner/bookings")}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
