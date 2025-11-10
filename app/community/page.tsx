"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { formatDistanceToNow } from "date-fns";

export default function CommunityFeedPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchCommunityRequests();

    // Set up realtime subscription
    const channel = supabase
      .channel("community-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_requests",
        },
        () => {
          fetchCommunityRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const fetchCommunityRequests = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("community_requests")
        .select(`
          *,
          homeowner:users!community_requests_homeowner_id_fkey(full_name),
          responses:community_request_responses(count)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("category", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching community requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      Plumbing: "bg-blue-100 text-blue-800",
      Electrical: "bg-yellow-100 text-yellow-800",
      HVAC: "bg-cyan-100 text-cyan-800",
      Landscaping: "bg-green-100 text-green-800",
      Cleaning: "bg-purple-100 text-purple-800",
      Carpentry: "bg-orange-100 text-orange-800",
      Painting: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getBudgetDisplay = (request: any) => {
    if (request.budget_min && request.budget_max) {
      return `$${request.budget_min} - $${request.budget_max}`;
    } else if (request.budget_min) {
      return `$${request.budget_min}+`;
    } else if (request.budget_max) {
      return `Up to $${request.budget_max}`;
    }
    return "Budget not specified";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Community Service Feed</h1>
            <p className="text-muted-foreground mt-2">
              Browse service requests from homeowners across Nantucket
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            {profile?.role === "homeowner" && (
              <Link href="/community/new">
                <Button>Post Service Request</Button>
              </Link>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              {["Plumbing", "Electrical", "HVAC", "Landscaping", "Cleaning", "Carpentry", "Painting"].map(
                (cat) => (
                  <Button
                    key={cat}
                    variant={filter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mt-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No service requests found. {filter !== "all" && "Try a different category."}
                </p>
                {profile?.role === "homeowner" && (
                  <Link href="/community/new">
                    <Button>Post the First Request</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Link key={request.id} href={`/community/${request.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getCategoryBadgeColor(request.category)}>
                              {request.category}
                            </Badge>
                            {request.urgency === "urgent" && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                            {request.responses?.[0]?.count > 0 && (
                              <Badge variant="outline">
                                {request.responses[0].count}{" "}
                                {request.responses[0].count === 1 ? "Response" : "Responses"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</p>
                          <p className="font-medium text-foreground mt-1">
                            {getBudgetDisplay(request)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{request.description}</p>
                      <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                        {request.location && (
                          <span className="flex items-center gap-1">
                            📍 {request.location}
                          </span>
                        )}
                        {request.preferred_date && (
                          <span className="flex items-center gap-1">
                            📅 {new Date(request.preferred_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
