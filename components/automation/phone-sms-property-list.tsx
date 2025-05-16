import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PhoneSmsPropertyListProps {
  properties: any[];
  loading: boolean;
  error: string | null;
}

export function PhoneSmsPropertyList({ properties, loading, error }: PhoneSmsPropertyListProps) {
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
          No properties selected for Phone/SMS automation.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Properties for Phone/SMS Automation</CardTitle>
        <CardDescription>{`Applying actions to ${properties.length} properties.`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="list-disc list-inside">
          {properties.map((property) => (
            <li key={property.id}>{property.address} ({property.city}, {property.state})</li>
          ))}
        </ul>
        <p className="mt-4">Phone/SMS automation content and actions for these properties go here.</p>
      </CardContent>
    </Card>
  );
}