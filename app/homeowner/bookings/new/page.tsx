"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const supabase = createClient();

  const vendorId = searchParams.get("vendor_id");

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId)
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      setMessage({ type: "error", text: "Failed to load vendor information" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to request a booking");
      }

      if (profile?.role !== "homeowner") {
        throw new Error("Only homeowners can request bookings");
      }

      if (!vendorId) {
        throw new Error("Vendor ID is required");
      }

      // Validate inputs
      if (!serviceType || !description || !preferredDate) {
        throw new Error("Please fill in all required fields");
      }

      if (description.length < 20) {
        throw new Error("Please provide a more detailed description (at least 20 characters)");
      }

      // Check if preferred date is in the future
      const selectedDate = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error("Preferred date must be today or in the future");
      }

      // Create booking request
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          customer_id: user.id,
          vendor_id: vendorId,
          service_type: serviceType,
          description,
          preferred_date: preferredDate,
          status: "pending",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setMessage({
        type: "success",
        text: "Booking request sent successfully! The vendor will review and respond soon.",
      });

      // Redirect to bookings page after a delay
      setTimeout(() => {
        router.push("/homeowner/bookings");
      }, 2000);
    } catch (error: any) {
      console.error("Booking request error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit booking request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || profile?.role !== "homeowner") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Only homeowners can request bookings.</p>
        </CardContent>
      </Card>
    );
  }

  if (!vendorId || !vendor) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sand-600">Loading vendor information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ocean-900">Request a Booking</h1>
        <p className="text-sand-600 mt-2">
          Send a booking request to {vendor.business_name}
        </p>
      </div>

      {/* Vendor Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {vendor.business_name}
            {vendor.is_verified && <Badge variant="success">✓ Verified</Badge>}
          </CardTitle>
          <CardDescription>
            <Badge variant="outline">{vendor.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-sand-700">
            <p><strong>Services:</strong> {vendor.services.join(", ")}</p>
            {vendor.hourly_rate && (
              <p><strong>Rate:</strong> ${vendor.hourly_rate}/hour</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Booking Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Provide details about the service you need. No payment is required until the vendor confirms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={loading}
              >
                <option value="">Select a service</option>
                {vendor.services.map((service: string, index: number) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description of Work Needed <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the work you need done in detail. Include any specific requirements, location details, or preferences. (Minimum 20 characters)"
                rows={6}
                required
                disabled={loading}
              />
              <p className="text-xs text-sand-500">
                {description.length}/1000 characters (minimum 20)
              </p>
            </div>

            {/* Preferred Date */}
            <div className="space-y-2">
              <Label htmlFor="preferredDate">
                Preferred Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                disabled={loading}
              />
              <p className="text-xs text-sand-500">
                This is your preferred start date. The vendor may suggest an alternative.
              </p>
            </div>

            {/* Important Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
              <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
              <ul className="space-y-1 text-blue-800 list-disc list-inside">
                <li>No payment is required at this stage</li>
                <li>The vendor will review your request and may reach out with questions</li>
                <li>Once the vendor confirms, you&apos;ll receive a payment request</li>
                <li>Payment is held securely until service completion</li>
                <li>You can cancel pending requests at any time</li>
              </ul>
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
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Sending Request..." : "Send Booking Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
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
