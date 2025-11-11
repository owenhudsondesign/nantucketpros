"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VendorWithUser {
  id: string;
  business_name: string;
  category: string;
  description: string;
  services: string[];
  hourly_rate: number;
  service_areas: string[];
  license_number: string | null;
  insurance_provider: string | null;
  is_verified: boolean;
  stripe_onboarding_complete: boolean;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  average_rating?: number;
  total_reviews?: number;
}

export default function AdminVendorsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [vendors, setVendors] = useState<VendorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchVendors();
    }
  }, [user, filterStatus]);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("vendors")
        .select(`
          *,
          user:users!vendors_user_id_fkey(id, full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (filterStatus === "pending") {
        query = query.eq("is_verified", false);
      } else if (filterStatus === "verified") {
        query = query.eq("is_verified", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch ratings for each vendor
      const vendorsWithRatings = await Promise.all(
        (data || []).map(async (vendor: any) => {
          // @ts-expect-error - Supabase RPC type inference issue
          const { data: reviewStats } = await supabase.rpc("get_vendor_rating", {
            vendor_id: vendor.id,
          });

          return {
            ...vendor,
            average_rating: (reviewStats as any)?.average_rating || 0,
            total_reviews: (reviewStats as any)?.total_reviews || 0,
          };
        })
      );

      setVendors(vendorsWithRatings);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setMessage({
        type: "error",
        text: "Failed to load vendors",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationToggle = async (vendorId: string, currentStatus: boolean) => {
    try {
      setProcessingId(vendorId);
      setMessage(null);

      const query = supabase.from("vendors");
      // @ts-expect-error - Supabase type inference issue with update
      const { error } = await query.update({ is_verified: !currentStatus }).eq("id", vendorId);

      if (error) throw error;

      setMessage({
        type: "success",
        text: currentStatus
          ? "Business verification removed"
          : "Business approved and verified successfully! They can now receive bookings.",
      });

      // Refresh the list
      await fetchVendors();
    } catch (error: any) {
      console.error("Error updating verification:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update verification status",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sand-600">Loading vendors...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Application Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve business applications to join NantucketPros
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          onClick={() => setFilterStatus("pending")}
        >
          Pending ({vendors.filter((v) => !v.is_verified).length})
        </Button>
        <Button
          variant={filterStatus === "verified" ? "default" : "outline"}
          onClick={() => setFilterStatus("verified")}
        >
          Verified ({vendors.filter((v) => v.is_verified).length})
        </Button>
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
        >
          All ({vendors.length})
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

      {vendors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No businesses found for this filter
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {vendor.business_name}
                      {vendor.is_verified && (
                        <Badge variant="default" className="bg-green-600">
                          Verified
                        </Badge>
                      )}
                      {!vendor.stripe_onboarding_complete && (
                        <Badge variant="destructive">
                          Stripe Incomplete
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {vendor.category} • Applied {new Date(vendor.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {vendor.is_verified ? (
                      <Button
                        variant="outline"
                        onClick={() => handleVerificationToggle(vendor.id, true)}
                        disabled={processingId === vendor.id}
                        size="sm"
                      >
                        {processingId === vendor.id ? "Processing..." : "Revoke Verification"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleVerificationToggle(vendor.id, false)}
                        disabled={processingId === vendor.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === vendor.id ? "Processing..." : "✓ Approve Application"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-sand-600">Owner:</span>{" "}
                      <span className="font-medium">{vendor.user.full_name}</span>
                    </div>
                    <div>
                      <span className="text-sand-600">Email:</span>{" "}
                      <span className="font-medium">{vendor.user.email}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Business Details */}
                <div>
                  <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                    Business Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-sand-600">Description:</span>
                      <p className="mt-1">{vendor.description}</p>
                    </div>
                    <div>
                      <span className="text-sand-600">Services:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.services.map((service, idx) => (
                          <Badge key={idx} variant="outline">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-sand-600">Hourly Rate:</span>{" "}
                        <span className="font-medium">
                          ${vendor.hourly_rate}/hr
                        </span>
                      </div>
                      <div>
                        <span className="text-sand-600">Service Areas:</span>{" "}
                        <span className="font-medium">
                          {vendor.service_areas.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Credentials */}
                <div>
                  <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                    Credentials
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-sand-600">License Number:</span>{" "}
                      <span className="font-medium">
                        {vendor.license_number || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sand-600">Insurance Provider:</span>{" "}
                      <span className="font-medium">
                        {vendor.insurance_provider || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {(vendor.total_reviews || 0) > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-ocean-900 mb-2">
                        Performance
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-sand-600">Average Rating:</span>{" "}
                          <span className="font-medium">
                            {(vendor.average_rating || 0).toFixed(1)} ★
                          </span>
                        </div>
                        <div>
                          <span className="text-sand-600">Total Reviews:</span>{" "}
                          <span className="font-medium">{vendor.total_reviews || 0}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
