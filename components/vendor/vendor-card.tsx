import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VendorCardProps {
  vendor: {
    id: string;
    business_name: string;
    category: string;
    description: string;
    services: string[];
    hourly_rate: number | null;
    service_area: string[];
    is_verified: boolean;
  };
  averageRating?: number;
  reviewCount?: number;
}

export function VendorCard({ vendor, averageRating, reviewCount }: VendorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {vendor.business_name}
              {vendor.is_verified && (
                <Badge variant="success" className="text-xs">
                  ✓ Verified
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-2">
                {vendor.category}
              </Badge>
              {averageRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
                <span className="text-xs text-sand-600">
                  ⭐ {averageRating.toFixed(1)} ({reviewCount} reviews)
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-sand-700 line-clamp-2">{vendor.description}</p>

        <div>
          <h4 className="text-xs font-semibold text-sand-900 mb-2">Services:</h4>
          <div className="flex flex-wrap gap-1">
            {vendor.services.slice(0, 3).map((service, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {vendor.services.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{vendor.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-sand-600">
            {vendor.hourly_rate ? (
              <span className="font-semibold text-ocean-900">
                ${vendor.hourly_rate}/hr
              </span>
            ) : (
              <span className="text-xs">Quote per project</span>
            )}
          </div>
          <Link href={`/vendors/${vendor.id}`}>
            <Button size="sm">View Profile</Button>
          </Link>
        </div>

        {vendor.service_area.length > 0 && (
          <div className="text-xs text-sand-500">
            Serves: {vendor.service_area.join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
