import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Property } from "@/types/supabase"
import { formatCurrency } from "@/lib/utils/format"
import Image from "next/image"
import { Home } from "lucide-react"

interface PropertyDetailsProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DetailItemProps {
  label: string
  value: string | number | null | undefined
  format?: (value: any) => string
}

const DetailItem = ({ label, value, format }: DetailItemProps) => {
  if (value === null || value === undefined || value === '') return null
  
  return (
    <div className="grid grid-cols-2 gap-2 py-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm font-medium">
        {format ? format(value) : value}
      </div>
    </div>
  )
}

interface DetailSectionProps {
  title: string
  children: React.ReactNode
}

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-lg">{title}</h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
)

export function PropertyDetailsDialog({ property, open, onOpenChange }: PropertyDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          {/* Property Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {property.images && property.images.length > 0 ? (
              property.images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <div className="flex h-full items-center justify-center">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <DetailSection title="Basic Information">
              <DetailItem label="Address" value={property.property_address} />
              <DetailItem label="City" value={property.city} />
              <DetailItem label="State" value={property.state} />
              <DetailItem label="ZIP" value={property.zip_5} />
              <DetailItem label="Status" value={property.status} />
              <DetailItem label="List Price" value={property.list_price} format={formatCurrency} />
              <DetailItem label="Property Type" value={property.universal_land_use} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Property Details */}
            <DetailSection title="Property Details">
              <DetailItem label="Beds" value={property.beds} />
              <DetailItem label="Baths" value={property.baths} />
              <DetailItem label="Living Area" value={property.living_area_sqft} format={v => `${v.toLocaleString()} sqft`} />
              <DetailItem label="Year Built" value={property.year_built} />
              <DetailItem label="Parking Spaces" value={property.parking_spaces} />
              <DetailItem label="Parking Type" value={property.parking_type} />
              <DetailItem label="Total Units" value={property.total_units} />
              <DetailItem label="Lot Acres" value={property.lot_acres} format={v => `${v} acres`} />
              <DetailItem label="Lot SQFT" value={property.lot_sqft} format={v => `${v.toLocaleString()} sqft`} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Financial Information */}
            <DetailSection title="Financial Information">
              <DetailItem label="Current Year Tax" value={property.current_year_tax} format={formatCurrency} />
              <DetailItem label="Tax Amount" value={property.tax_amount} format={formatCurrency} />
              <DetailItem label="Total Assessed Value" value={property.total_assessed_value} format={formatCurrency} />
              <DetailItem label="Assessed Land" value={property.assessed_land} format={formatCurrency} />
              <DetailItem label="Assessed Improvement" value={property.assessed_improvement} format={formatCurrency} />
              <DetailItem label="Total Market Value" value={property.total_market_value} format={formatCurrency} />
              <DetailItem label="Market Value Land" value={property.market_value_land} format={formatCurrency} />
              <DetailItem label="Market Value Improvement" value={property.market_value_improvement} format={formatCurrency} />
              <DetailItem label="Estimated Value" value={property.estimated_value} format={formatCurrency} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Mortgage Information */}
            <DetailSection title="Mortgage Information">
              <DetailItem label="Number of Mortgages" value={property.number_of_mortgages} />
              <DetailItem label="Mortgage Balance" value={property.mortgage_loan_balance} format={formatCurrency} />
              <DetailItem label="Equity" value={property.equity} format={formatCurrency} />
              <DetailItem label="Equity Percentage" value={property.equity_percentage} format={v => `${v}%`} />
              
              {/* Mortgage 1 */}
              {property.mortgage_1_lender_name && (
                <>
                  <DetailItem label="Mortgage 1 Lender" value={property.mortgage_1_lender_name} />
                  <DetailItem label="Mortgage 1 Type" value={property.mortgage_1_loan_type} />
                  <DetailItem label="Mortgage 1 Amount" value={property.mortgage_1_amount} format={formatCurrency} />
                  <DetailItem label="Mortgage 1 Date" value={property.mortgage_1_loan_date} />
                  <DetailItem label="Mortgage 1 Rate" value={property.mortgage_1_rate} format={v => `${v}%`} />
                </>
              )}
              
              {/* Mortgage 2 */}
              {property.mortgage_2_lender_name && (
                <>
                  <DetailItem label="Mortgage 2 Lender" value={property.mortgage_2_lender_name} />
                  <DetailItem label="Mortgage 2 Type" value={property.mortgage_2_loan_type} />
                  <DetailItem label="Mortgage 2 Amount" value={property.mortgage_2_amount} format={formatCurrency} />
                  <DetailItem label="Mortgage 2 Date" value={property.mortgage_2_loan_date} />
                  <DetailItem label="Mortgage 2 Rate" value={property.mortgage_2_rate} format={v => `${v}%`} />
                </>
              )}
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Owner Information */}
            <DetailSection title="Owner Information">
              {/* Owner 1 */}
              <DetailItem label="Owner 1 Name" value={property.owner_1_full_name} />
              <DetailItem label="Owner 1 Email" value={property.owner_1_email} />
              <DetailItem label="Owner 1 Phone" value={property.owner_1_phone_numbers?.map(p => p.number).join(', ')} />
              
              {/* Owner 2 */}
              <DetailItem label="Owner 2 Name" value={property.owner_2_full_name} />
              <DetailItem label="Owner 2 Email" value={property.owner_2_email} />
              <DetailItem label="Owner 2 Phone" value={property.owner_2_phone_numbers?.map(p => p.number).join(', ')} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Additional Information */}
            <DetailSection title="Additional Information">
              <DetailItem label="County Use Code" value={property.county_use_code} />
              <DetailItem label="State Land Use Code" value={property.state_land_use_code} />
              <DetailItem label="Zoning" value={property.zoning} />
              <DetailItem label="Construction Type" value={property.construction_type} />
              <DetailItem label="Exterior Wall" value={property.exterior_wall} />
              <DetailItem label="Roof Material" value={property.roof_material_type} />
              <DetailItem label="Has Pool" value={property.has_pool ? 'Yes' : 'No'} />
            </DetailSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 