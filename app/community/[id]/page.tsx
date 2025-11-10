"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CommunityRequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [request, setRequest] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Response form state
  const [responseMessage, setResponseMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  useEffect(() => {
    fetchRequestDetails();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`community-request-${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_request_responses",
          filter: `request_id=eq.${params.id}`,
        },
        () => {
          fetchResponses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id, user]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);

      // Fetch request
      const { data: requestData, error: requestError } = await supabase
        .from("community_requests")
        .select(`
          *,
          homeowner:users!community_requests_homeowner_id_fkey(full_name)
        `)
        .eq("id", params.id)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      // Fetch responses
      await fetchResponses();

      // If user is a vendor, fetch their vendor profile
      if (user && profile?.role === "vendor") {
        const { data: vendorData } = await supabase
          .from("vendors")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setVendor(vendorData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    const { data: responsesData } = await supabase
      .from("community_request_responses")
      .select(`
        *,
        vendor:vendors(id, business_name, category, is_verified, user_id)
      `)
      .eq("request_id", params.id)
      .order("created_at", { ascending: false });

    setResponses(responsesData || []);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (!user || !vendor) {
        throw new Error("You must be logged in as a vendor");
      }

      if (!responseMessage.trim()) {
        throw new Error("Please enter a message");
      }

      const { error } = await supabase.from("community_request_responses").insert({
        request_id: params.id,
        vendor_id: vendor.id,
        message: responseMessage.trim(),
        proposed_price: proposedPrice ? parseInt(proposedPrice) : null,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Response sent successfully!",
      });

      // Clear form
      setResponseMessage("");
      setProposedPrice("");

      // Refresh responses
      await fetchResponses();
    } catch (error: any) {
      console.error("Error submitting response:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to send response",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseRequest = async () => {
    if (!confirm("Are you sure you want to close this request?")) return;

    try {
      const { error } = await supabase
        .from("community_requests")
        .update({ status: "closed" })
        .eq("id", params.id)
        .eq("homeowner_id", user!.id);

      if (error) throw error;

      router.push("/community");
    } catch (error: any) {
      console.error("Error closing request:", error);
      alert("Failed to close request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Request not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === request.homeowner_id;
  const canRespond = profile?.role === "vendor" && vendor && !isOwner;
  const hasAlreadyResponded = responses.some((r) => r.vendor?.user_id === user?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Request Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{request.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{request.category}</Badge>
                {request.urgency === "urgent" && <Badge variant="destructive">Urgent</Badge>}
                <Badge variant={request.status === "open" ? "default" : "secondary"}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Posted by {request.homeowner?.full_name || "Anonymous"} •{" "}
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </p>
            </div>
            {isOwner && request.status === "open" && (
              <Button variant="outline" size="sm" onClick={handleCloseRequest}>
                Close Request
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{request.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            {request.location && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Location</h4>
                <p className="text-muted-foreground">📍 {request.location}</p>
              </div>
            )}
            {request.preferred_date && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Preferred Date</h4>
                <p className="text-muted-foreground">
                  📅 {new Date(request.preferred_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {(request.budget_min || request.budget_max) && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Budget Range</h4>
                <p className="text-muted-foreground">
                  💰{" "}
                  {request.budget_min && request.budget_max
                    ? `$${request.budget_min} - $${request.budget_max}`
                    : request.budget_min
                    ? `$${request.budget_min}+`
                    : `Up to $${request.budget_max}`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vendor Response Form */}
      {canRespond && request.status === "open" && !hasAlreadyResponded && (
        <Card>
          <CardHeader>
            <CardTitle>Respond to This Request</CardTitle>
            <CardDescription>
              Introduce yourself and let the homeowner know how you can help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">
                  Your Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Introduce yourself, explain your experience with this type of work, and how you can help..."
                  required
                  disabled={submitting}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Proposed Price (Optional)</Label>
                <Input
                  id="price"
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="Enter estimated price"
                  min="0"
                  step="50"
                  disabled={submitting}
                />
                <p className="text-xs text-muted-foreground">
                  You can provide an estimate or leave blank to discuss details first
                </p>
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

              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Response"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {hasAlreadyResponded && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              You've already responded to this request. The homeowner can see your response below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Responses */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Responses ({responses.length})
        </h2>

        {responses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No responses yet. {canRespond && "Be the first to respond!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          responses.map((response) => (
            <Card key={response.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Link
                        href={`/vendors/${response.vendor?.id}`}
                        className="hover:underline"
                      >
                        {response.vendor?.business_name}
                      </Link>
                      {response.vendor?.is_verified && (
                        <Badge variant="success" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {response.vendor?.category} •{" "}
                      {formatDistanceToNow(new Date(response.created_at), {
                        addSuffix: true,
                      })}
                    </CardDescription>
                  </div>
                  {response.proposed_price && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Proposed Price</p>
                      <p className="text-lg font-bold">${response.proposed_price}</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {response.message}
                </p>
                <div className="flex gap-3 mt-4">
                  <Link href={`/vendors/${response.vendor?.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                  {isOwner && (
                    <Link href={`/homeowner/bookings/new?vendor_id=${response.vendor?.id}`}>
                      <Button size="sm">Book This Vendor</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
