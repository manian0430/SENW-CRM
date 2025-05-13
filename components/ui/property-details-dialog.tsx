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
import { Home, User, Phone, Mail, MapPin } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

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
          {/* Property Images at the very top */}
          <div className="mb-4">
            {property.images && property.images.length > 0 ? (
              <div className="relative aspect-video rounded-lg overflow-hidden w-full">
                <Image
                  src={property.images[0]}
                  alt={property.property_address || 'Property image'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 w-full flex items-center justify-center">
                <Home className="h-12 w-12 text-gray-400" />
                <span className="absolute inset-0 flex items-center justify-center text-gray-400">Property image coming soon</span>
              </div>
            )}
          </div>

          {/* Address and Price */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold">{property.property_address}</h2>
            <div className="text-3xl font-bold text-senw-gold mb-2">
              {property.list_price ? formatCurrency(property.list_price) : 'Price not listed'}
            </div>
          </div>

          {/* Broker's Golden Details */}
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 shadow">
            <div className="font-semibold text-blue-900 mb-2">Broker's Golden Details</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="text-xs text-gray-500">CAP RATE</div>
                <div className="text-lg font-bold text-blue-900">{(property as any).cap_rate ?? (property as any).capRate ?? '-'}</div>
              </div>
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="text-xs text-gray-500">CASH FLOW</div>
                <div className="text-lg font-bold text-blue-900">{(property as any).cash_flow ? `$${(property as any).cash_flow}/mo` : (property as any).cashFlow ? `$${(property as any).cashFlow}/mo` : '-'}</div>
              </div>
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="text-xs text-gray-500">ROI</div>
                <div className="text-lg font-bold text-blue-900">{(property as any).roi ? `${(property as any).roi}%` : (property as any).ROI ? `${(property as any).ROI}%` : '-'}</div>
              </div>
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="text-xs text-gray-500">$/SQFT</div>
                <div className="text-lg font-bold text-blue-900">{(property as any).price_per_sqft ? `$${(property as any).price_per_sqft}` : (property as any).pricePerSqft ? `$${(property as any).pricePerSqft}` : '-'}</div>
              </div>
              <div className="bg-white rounded shadow p-2 text-center">
                <div className="text-xs text-gray-500">COMP VALUE</div>
                <div className="text-lg font-bold text-blue-900">{(property as any).comp_value ? formatCurrency((property as any).comp_value) : (property as any).compValue ? formatCurrency((property as any).compValue) : '-'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Property Identification */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2 mb-2">
                <span><Home className="h-5 w-5 text-senw-gold" /></span>
                <span className="font-semibold text-senw-gold text-lg">Property Identification</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="APN/Tax 1" value={property.apn_tax_1 || '—'} />
                <DetailItem label="APN/Tax 2" value={property.apn_tax_2 || '—'} />
                <DetailItem label="APN/Tax 3" value={property.apn_tax_3 || '—'} />
                <DetailItem label="FIPS" value={property.fips || '—'} />
                <DetailItem label="Census Tract" value={property.census_tract || '—'} />
              </div>
            </div>

            {/* Property Address */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-senw-gold" />
                <span className="font-semibold text-senw-gold text-lg">Property Address</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="House Number" value={property.house_number || '—'} />
                <DetailItem label="Pre Direction" value={property.pre_direction || '—'} />
                <DetailItem label="Street" value={property.street || '—'} />
                <DetailItem label="Street Suffix" value={property.street_suffix || '—'} />
                <DetailItem label="Post Direction" value={property.post_direction || '—'} />
                <DetailItem label="Unit Type" value={property.unit_type || '—'} />
                <DetailItem label="Unit Number" value={property.unit_number || '—'} />
                <DetailItem label="City" value={property.city || '—'} />
                <DetailItem label="State" value={property.state || '—'} />
                <DetailItem label="ZIP 5" value={property.zip_5 || '—'} />
                <DetailItem label="ZIP 4" value={property.zip_4 || '—'} />
              </div>
            </div>

            {/* Mailing Address */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-senw-gold" />
                <span className="font-semibold text-senw-gold text-lg">Mailing Address</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Mailing Address" value={property.mailing_address || '—'} />
                <DetailItem label="Mailing House Number" value={property.mailing_house_number || '—'} />
                <DetailItem label="Mailing Pre Direction" value={property.mailing_pre_direction || '—'} />
                <DetailItem label="Mailing Street" value={property.mailing_street || '—'} />
                <DetailItem label="Mailing Street Suffix" value={property.mailing_street_suffix || '—'} />
                <DetailItem label="Mailing Post Direction" value={property.mailing_post_direction || '—'} />
                <DetailItem label="Mailing Unit Type" value={property.mailing_unit_type || '—'} />
                <DetailItem label="Mailing Unit Number" value={property.mailing_unit_number || '—'} />
                <DetailItem label="Mailing City" value={property.mailing_city || '—'} />
                <DetailItem label="Mailing State" value={property.mailing_state || '—'} />
                <DetailItem label="Mailing ZIP 5" value={property.mailing_zip_5 || '—'} />
                <DetailItem label="Mailing ZIP 4" value={property.mailing_zip_4 || '—'} />
              </div>
            </div>

            {/* Listing Information */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Listing Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="MLS ID" value={property.mls_id || '—'} />
                <DetailItem label="Listing Type" value={property.listing_type || '—'} />
                <DetailItem label="Status" value={property.status || '—'} />
                <DetailItem label="List Price" value={property.list_price !== undefined ? formatCurrency(property.list_price) : '—'} />
                <DetailItem label="Days on Market" value={property.days_on_market || '—'} />
                <DetailItem label="Contract Status Change Date" value={property.contract_status_change_date || '—'} />
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Property Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Township Name" value={property.township_name || '—'} />
                <DetailItem label="Subdivision Code" value={property.subdivision_code || '—'} />
                <DetailItem label="Subdivision" value={property.subdivision || '—'} />
                <DetailItem label="Current Year Tax" value={property.current_year_tax !== undefined ? formatCurrency(property.current_year_tax) : '—'} />
                <DetailItem label="Tax Amount" value={property.tax_amount !== undefined ? formatCurrency(property.tax_amount) : '—'} />
                <DetailItem label="Tax Rate Code Area" value={property.tax_rate_code_area || '—'} />
                <DetailItem label="Current Year Assessment" value={property.current_year_assessment || '—'} />
                <DetailItem label="Total Assessed Value" value={property.total_assessed_value !== undefined ? formatCurrency(property.total_assessed_value) : '—'} />
                <DetailItem label="Assessed Land" value={property.assessed_land !== undefined ? formatCurrency(property.assessed_land) : '—'} />
                <DetailItem label="Assessed Improvement" value={property.assessed_improvement !== undefined ? formatCurrency(property.assessed_improvement) : '—'} />
                <DetailItem label="Total Market Value" value={property.total_market_value !== undefined ? formatCurrency(property.total_market_value) : '—'} />
                <DetailItem label="Market Value Land" value={property.market_value_land !== undefined ? formatCurrency(property.market_value_land) : '—'} />
                <DetailItem label="Market Value Improvement" value={property.market_value_improvement !== undefined ? formatCurrency(property.market_value_improvement) : '—'} />
                <DetailItem label="Estimated Value" value={property.estimated_value !== undefined ? formatCurrency(property.estimated_value) : '—'} />
                <DetailItem label="Block Number" value={property.block_number || '—'} />
                <DetailItem label="Lot Number" value={property.lot_number || '—'} />
                <DetailItem label="Section Number" value={property.section_number || '—'} />
                <DetailItem label="County Use Code" value={property.county_use_code || '—'} />
                <DetailItem label="Universal Land Use" value={property.universal_land_use || '—'} />
                <DetailItem label="State Land Use Code" value={property.state_land_use_code || '—'} />
                <DetailItem label="Zoning" value={property.zoning || '—'} />
                <DetailItem label="Plat Map Reference" value={property.plat_map_reference || '—'} />
                <DetailItem label="Lot Acres" value={property.lot_acres !== undefined ? property.lot_acres : '—'} />
                <DetailItem label="Lot SQFT" value={property.lot_sqft !== undefined ? property.lot_sqft : '—'} />
                <DetailItem label="New Construction" value={property.new_construction || '—'} />
                <DetailItem label="Beds" value={property.beds !== undefined ? property.beds : '—'} />
                <DetailItem label="Baths" value={property.baths !== undefined ? property.baths : '—'} />
                <DetailItem label="Total Building Area" value={property.total_building_area !== undefined ? property.total_building_area : '—'} />
                <DetailItem label="Living Area SQFT" value={property.living_area_sqft !== undefined ? property.living_area_sqft : '—'} />
                <DetailItem label="Gross Area SQFT" value={property.gross_area_sqft !== undefined ? property.gross_area_sqft : '—'} />
                <DetailItem label="Basement SQFT" value={property.basement_sqft !== undefined ? property.basement_sqft : '—'} />
                <DetailItem label="Garage SQFT" value={property.garage_sqft !== undefined ? property.garage_sqft : '—'} />
                <DetailItem label="Basement" value={property.basement || '—'} />
                <DetailItem label="Flooring Cover" value={property.flooring_cover || '—'} />
                <DetailItem label="Stories" value={property.stories !== undefined ? property.stories : '—'} />
                <DetailItem label="Style" value={property.style || '—'} />
                <DetailItem label="Year Built" value={property.year_built !== undefined ? property.year_built : '—'} />
                <DetailItem label="Air Conditioning" value={property.air_conditioning || '—'} />
                <DetailItem label="Heat Type" value={property.heat_type || '—'} />
                <DetailItem label="Fireplace Indicator" value={property.fireplace_indicator || '—'} />
                <DetailItem label="Construction Type" value={property.construction_type || '—'} />
                <DetailItem label="Exterior Wall" value={property.exterior_wall || '—'} />
                <DetailItem label="Roof Material Type" value={property.roof_material_type || '—'} />
                <DetailItem label="Porch Type" value={property.porch_type || '—'} />
                <DetailItem label="Has Pool" value={property.has_pool !== undefined ? String(property.has_pool) : '—'} />
                <DetailItem label="Parking Spaces" value={property.parking_spaces !== undefined ? property.parking_spaces : '—'} />
                <DetailItem label="Parking Type" value={property.parking_type || '—'} />
                <DetailItem label="Total Units" value={property.total_units !== undefined ? property.total_units : '—'} />
              </div>
            </div>

            {/* Owner Information */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-senw-gold" />
                <span className="font-semibold text-senw-gold text-lg">Owner Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Owner 1 First Name" value={property.owner_1_first_name || '—'} />
                <DetailItem label="Owner 1 Middle Name" value={property.owner_1_middle_name || '—'} />
                <DetailItem label="Owner 1 Last Name" value={property.owner_1_last_name || '—'} />
                <DetailItem label="Owner 1 Full Name" value={property.owner_1_full_name || '—'} />
                <DetailItem label="Owner 1 Email" value={property.owner_1_email || '—'} />
                <DetailItem label="Owner 1 Phone Numbers" value={Array.isArray(property.owner_1_phone_numbers) ? property.owner_1_phone_numbers.map((p: any) => p.number ?? p).join(', ') : property.owner_1_phone_numbers || '—'} />
                <DetailItem label="Owner 2 First Name" value={property.owner_2_first_name || '—'} />
                <DetailItem label="Owner 2 Middle Name" value={property.owner_2_middle_name || '—'} />
                <DetailItem label="Owner 2 Last Name" value={property.owner_2_last_name || '—'} />
                <DetailItem label="Owner 2 Full Name" value={property.owner_2_full_name || '—'} />
                <DetailItem label="Owner 2 Email" value={property.owner_2_email || '—'} />
                <DetailItem label="Owner 2 Phone Numbers" value={Array.isArray(property.owner_2_phone_numbers) ? property.owner_2_phone_numbers.map((p: any) => p.number ?? p).join(', ') : property.owner_2_phone_numbers || '—'} />
              </div>
            </div>

            {/* Financial Information */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Financial Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Equity" value={property.equity !== undefined ? formatCurrency(property.equity) : '—'} />
                <DetailItem label="Equity Percentage" value={property.equity_percentage !== undefined ? `${property.equity_percentage}%` : '—'} />
                <DetailItem label="Number of Mortgages" value={property.number_of_mortgages !== undefined ? property.number_of_mortgages : '—'} />
                <DetailItem label="Mortgage Loan Balance" value={property.mortgage_loan_balance !== undefined ? formatCurrency(property.mortgage_loan_balance) : '—'} />
              </div>
            </div>

            {/* Mortgage 1 */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Mortgage 1</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Lender Name" value={property.mortgage_1_lender_name || '—'} />
                <DetailItem label="Loan Type" value={property.mortgage_1_loan_type || '—'} />
                <DetailItem label="Amount" value={property.mortgage_1_amount !== undefined ? formatCurrency(property.mortgage_1_amount) : '—'} />
                <DetailItem label="Loan Date" value={property.mortgage_1_loan_date || '—'} />
                <DetailItem label="Rate" value={property.mortgage_1_rate !== undefined ? `${property.mortgage_1_rate}%` : '—'} />
                <DetailItem label="Age" value={property.mortgage_1_age !== undefined ? property.mortgage_1_age : '—'} />
              </div>
            </div>

            {/* Mortgage 2 */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Mortgage 2</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Lender Name" value={property.mortgage_2_lender_name || '—'} />
                <DetailItem label="Loan Type" value={property.mortgage_2_loan_type || '—'} />
                <DetailItem label="Amount" value={property.mortgage_2_amount !== undefined ? formatCurrency(property.mortgage_2_amount) : '—'} />
                <DetailItem label="Loan Date" value={property.mortgage_2_loan_date || '—'} />
                <DetailItem label="Rate" value={property.mortgage_2_rate !== undefined ? `${property.mortgage_2_rate}%` : '—'} />
                <DetailItem label="Age" value={property.mortgage_2_age !== undefined ? property.mortgage_2_age : '—'} />
              </div>
            </div>

            {/* Status and Exemptions */}
            <div className="mb-4 p-4 rounded-lg bg-gray-50 border">
              <div className="font-semibold text-senw-gold text-lg mb-2">Status and Exemptions</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DetailItem label="Absentee Status" value={property.absentee_status !== undefined ? String(property.absentee_status) : '—'} />
                <DetailItem label="Exemption Veterans" value={property.exemption_veterans !== undefined ? String(property.exemption_veterans) : '—'} />
                <DetailItem label="Exemption Disabled" value={property.exemption_disabled !== undefined ? String(property.exemption_disabled) : '—'} />
                <DetailItem label="Exemption Senior" value={property.exemption_senior !== undefined ? String(property.exemption_senior) : '—'} />
                <DetailItem label="Exemption Widow" value={property.exemption_widow !== undefined ? String(property.exemption_widow) : '—'} />
                <DetailItem label="Exemption Homestead" value={property.exemption_homestead !== undefined ? String(property.exemption_homestead) : '—'} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 