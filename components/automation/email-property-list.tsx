import { PropertyListItem } from "@/components/ui/property-list-item";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EmailPropertyListProps {
  properties: any[];
  loading: boolean;
  error: string | null;
  onPropertyClick: (property: any) => void;
}

export function EmailPropertyList({ properties, loading, error, onPropertyClick }: EmailPropertyListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          Error loading properties: {error}
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No properties selected for email automation.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Properties for Email Automation</CardTitle>
        <CardDescription>{`Applying actions to ${properties.length} properties.`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {properties.map((property) => (
            <PropertyListItem key={property.id} property={property} onClick={() => onPropertyClick(property)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 