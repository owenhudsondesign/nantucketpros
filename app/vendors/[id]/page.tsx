"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchVendorProfile();
      fetchReviews();
    }
  }, [params.id]);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      const vendorData = data as any;

      if (!vendorData) {
        setError("Vendor not found");
        return;
      }

      // Only show verified vendors to public (RLS handles this too)
      if (!vendorData.is_verified && (!user || user.id !== vendorData.user_id)) {
        setError("This vendor profile is not yet verified");
        return;
      }

      setVendor(vendorData);
    } catch (err: any) {
      console.error("Error fetching vendor:", err);
      setError(err.message || "Failed to load vendor profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select(`
          *,
          customer:users!reviews_customer_id_fkey(full_name)
        `)
        .eq("vendor_id", params.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviews = reviewsData as any;
      setReviews(reviews || []);

      // Calculate average rating
      if (reviews && reviews.length > 0) {
        const avg =
          reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleRequestBooking = () => {
    if (!user) {
      // Redirect to login
      router.push("/login?redirect=/vendors/" + params.id);
      return;
    }

    if (profile?.role !== "homeowner") {
      alert("Only homeowners can request bookings");
      return;
    }

    // TODO: Open booking request modal or navigate to booking page
    router.push(`/homeowner/bookings/new?vendor_id=${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-sand-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Header Skeleton */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-10 w-64 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>

              {/* Details Skeleton */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              </div>

              {/* Reviews Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600">{error || "Vendor not found"}</p>
            <Link href="/vendors">
              <Button variant="outline">Back to Vendors</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-sand-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl flex items-center gap-3">
                      {vendor.business_name}
                      {vendor.is_verified && (
                        <Badge variant="success">✓ Verified</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      <Badge variant="outline" className="mr-2">
                        {vendor.category}
                      </Badge>
                      {reviews.length > 0 && (
                        <span className="text-sand-600">
                          ⭐ {averageRating} ({reviews.length} review
                          {reviews.length !== 1 ? "s" : ""})
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button onClick={handleRequestBooking} size="lg">
                    Request Booking
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-ocean-900 mb-2">
                    About
                  </h3>
                  <p className="text-sand-700 whitespace-pre-line">{vendor.description}</p>
                </div>

                <Separator />

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-ocean-900 mb-3">
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.services.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ocean-900 mb-3">
                      Pricing
                    </h3>
                    {vendor.hourly_rate ? (
                      <p className="text-2xl font-bold text-ocean-600">
                        ${vendor.hourly_rate}/hour
                      </p>
                    ) : (
                      <p className="text-sand-600">Quotes provided per project</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-ocean-900 mb-3">
                      Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {vendor.service_area.map((area: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* License & Insurance */}
                {(vendor.license_number || vendor.insurance_info) && (
                  <>
                    <Separator />
                    <div className="grid md:grid-cols-2 gap-6">
                      {vendor.license_number && (
                        <div>
                          <h3 className="text-sm font-semibold text-ocean-900 mb-1">
                            License Number
                          </h3>
                          <p className="text-sand-700">{vendor.license_number}</p>
                        </div>
                      )}
                      {vendor.insurance_info && (
                        <div>
                          <h3 className="text-sm font-semibold text-ocean-900 mb-1">
                            Insurance
                          </h3>
                          <p className="text-sand-700">{vendor.insurance_info}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {reviews.length > 0
                    ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""} from verified customers`
                    : "No reviews yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-center text-sand-500 py-8">
                    This vendor hasn&apos;t received any reviews yet. Be the first to book and
                    leave a review!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-ocean-900">
                              {review.customer?.full_name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={
                                      i < review.rating
                                        ? "text-yellow-500"
                                        : "text-sand-300"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-sand-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sand-700 mt-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center py-8">
              <Button onClick={handleRequestBooking} size="lg">
                Request a Booking
              </Button>
              <p className="text-sm text-sand-600 mt-4">
                No payment required until service is confirmed
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
