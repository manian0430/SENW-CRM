import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface PropertiesReceivedCardProps {
  propertyIds: string | null;
  onApplyActions: (actionTypes: string[]) => void; // Updated prop to accept an array
}

export function PropertiesReceivedCard({ propertyIds, onApplyActions }: PropertiesReceivedCardProps) {
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([]);

  if (!propertyIds) {
    return null;
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedActionTypes([...selectedActionTypes, value]);
    } else {
      setSelectedActionTypes(selectedActionTypes.filter(type => type !== value));
    }
  };

  const handleApplyClick = () => {
    if (selectedActionTypes.length > 0) {
      onApplyActions(selectedActionTypes);
    }
  };

  const actionOptions = [
    { value: "marketing", label: "Marketing" },
    { value: "phone-sms", label: "Phone/SMS" },
    { value: "email-templates", label: "Email" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply Actions to Properties</CardTitle>
        <CardDescription>
          {`You have selected ${propertyIds.split(',').length} properties. Choose actions to apply:`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="action-type">Action Type</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedActionTypes.length > 0
                  ? selectedActionTypes
                      .map(value => actionOptions.find(option => option.value === value)?.label)
                      .join(", ")
                  : "Select action type(s)"}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <div className="flex flex-col space-y-2 p-4">
                {actionOptions.map((option) => (
                  <Label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedActionTypes.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.value, checked as boolean)
                      }
                    />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleApplyClick}
            disabled={selectedActionTypes.length === 0}
            className="bg-senw-gold hover:bg-senw-gold/90 text-white"
          >
            Apply Selected Actions
          </Button>
        </div>

         <p className="text-sm text-muted-foreground">
          Note: Selecting and applying actions is a placeholder UI. The actual execution of these actions will require backend implementation.
        </p>
      </CardContent>
    </Card>
  );
}