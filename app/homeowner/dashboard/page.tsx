"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export default function HomeownerDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);

      const { data: requestsData } = await supabase
        .from("community_requests")
        .select(`
          *,
          responses:community_request_responses(
            id,
            message,
            proposed_price,
            created_at,
            vendor:vendors(id, business_name, is_verified)
          )
        `)
        .eq("homeowner_id", user!.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(5);

      setMyRequests(requestsData || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">Manage your properties and service professionals</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-2">🏠</div>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>Manage your properties and vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/homeowner/properties">
              <Button className="w-full">View Properties</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-2">🔍</div>
            <CardTitle>Find Businesses</CardTitle>
            <CardDescription>Browse verified local professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vendors">
              <Button variant="outline" className="w-full">Browse Businesses</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-2">📅</div>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>View and manage service requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/homeowner/bookings">
              <Button variant="outline" className="w-full">View Bookings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="text-4xl mb-2">💬</div>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Chat with service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/homeowner/messages">
              <Button variant="outline" className="w-full">View Messages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My Service Requests with Responses */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : myRequests.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Service Requests</CardTitle>
                <CardDescription>
                  Recent requests and vendor responses
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href="/community/new">
                  <Button size="sm">New Request</Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myRequests.map((request) => (
              <Link key={request.id} href={`/community/${request.id}`}>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{request.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{request.category}</Badge>
                        {request.urgency === "urgent" && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        {request.responses && request.responses.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {request.responses.length} {request.responses.length === 1 ? "Response" : "Responses"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {request.responses && request.responses.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Latest response:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {request.responses[0].vendor?.business_name}
                        </span>
                        {request.responses[0].vendor?.is_verified && (
                          <Badge variant="secondary" className="text-xs">✓ Verified</Badge>
                        )}
                        {request.responses[0].proposed_price && (
                          <span className="text-sm font-semibold text-foreground ml-auto">
                            ${request.responses[0].proposed_price}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/20 border-2 border-dashed">
          <CardHeader>
            <CardTitle>Post a Service Request</CardTitle>
            <CardDescription>
              Let local vendors know what you need and receive quotes directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/community/new">
              <Button>Post Your First Request</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Guide */}
      <Card className="bg-muted/20 border-2 border-dashed">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Follow these steps to make the most of NantucketPros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-foreground text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <p className="font-medium">Add your properties</p>
                <p className="text-sm text-muted-foreground">Create property profiles for all locations you manage</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-foreground text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <p className="font-medium">Browse service professionals</p>
                <p className="text-sm text-muted-foreground">Find verified businesses for your property needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-foreground text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <p className="font-medium">Save your favorites</p>
                <p className="text-sm text-muted-foreground">Add businesses to your property profiles for easy access</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
