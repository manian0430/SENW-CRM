import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type Property } from "@/lib/utils/property-data"
import { formatCurrency } from "@/lib/utils/format"
import Image from "next/image"
import { Home } from "lucide-react"

interface PropertyDetailsProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DetailSectionProps {
  title: string
  children: React.ReactNode
}

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-primary pl-3">
        <h3 className="font-semibold text-lg text-primary">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm px-1">{children}</div>
    </div>
  )
}

interface DetailItemProps {
  label: string
  value: string | number | undefined | null | boolean
}

function DetailItem({ label, value }: DetailItemProps) {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'boolean') return (
    <div className="p-2 rounded-lg hover:bg-gray-50">
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium">{value ? 'Yes' : 'No'}</span>
    </div>
  )
  return (
    <div className="p-2 rounded-lg hover:bg-gray-50">
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function PropertyDetailsDialog({ property, open, onOpenChange }: PropertyDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-8 pb-6">
            {/* Property Image Placeholder */}
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Home className="w-16 h-16 mb-2" />
                <span className="text-sm">Property image coming soon</span>
              </div>
            </div>

            {/* Basic Information */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{property.address}</h2>
              <Badge variant={property.status.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                {property.status}
              </Badge>
            </div>

            <div className="text-3xl font-bold text-primary">
              {formatCurrency(property.price)}
            </div>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Property Details */}
            <DetailSection title="Property Details">
              <DetailItem label="Bedrooms" value={property.beds} />
              <DetailItem label="Bathrooms" value={property.baths} />
              <DetailItem label="Living Area" value={`${property.livingAreaSqft.toLocaleString()} sqft`} />
              <DetailItem label="Year Built" value={property.yearBuilt} />
              <DetailItem label="Universal Land Use" value={property.universalLandUse} />
              <DetailItem label="Parking Spaces" value={property.parkingSpaces} />
              <DetailItem label="Parking Type" value={property.parkingType} />
              <DetailItem label="Total Building Area" value={`${property.totalBuildingArea} sqft`} />
              <DetailItem label="Basement SQFT" value={property.basementSqft > 0 ? `${property.basementSqft} sqft` : 0} />
              <DetailItem label="Garage SQFT" value={property.garageSqft > 0 ? `${property.garageSqft} sqft` : 0} />
              <DetailItem label="Basement" value={property.basement} />
              <DetailItem label="Stories" value={property.stories} />
              <DetailItem label="Style" value={property.style} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Features & Characteristics */}
            <DetailSection title="Features & Characteristics">
              <DetailItem label="Air Conditioning" value={property.airConditioning || 'None'} />
              <DetailItem label="Heat Type" value={property.heatType || 'None'} />
              <DetailItem label="Fireplace" value={property.fireplaceIndicator || 'No'} />
              <DetailItem label="Construction Type" value={property.constructionType || 'Not Specified'} />
              <DetailItem label="Exterior Wall" value={property.exteriorWall || 'Not Specified'} />
              <DetailItem label="Roof Material" value={property.roofMaterialType || 'Not Specified'} />
              <DetailItem label="Porch Type" value={property.porchType || 'None'} />
              <DetailItem label="Pool" value={property.hasPool || 'No'} />
              <DetailItem label="Flooring" value={property.flooringCover || 'Not Specified'} />
              <DetailItem label="New Construction" value={property.newConstruction || 'No'} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Location & Address */}
            <DetailSection title="Location & Address">
              <DetailItem label="Property Address" value={property.address} />
              <DetailItem label="House Number" value={property.houseNumber} />
              <DetailItem label="Street" value={property.street} />
              <DetailItem label="City" value={property.city} />
              <DetailItem label="State" value={property.state} />
              <DetailItem label="ZIP" value={`${property.zip5}${property.zip4 ? '-' + property.zip4 : ''}`} />
              <DetailItem label="Township" value={property.townshipName} />
              <DetailItem label="Subdivision" value={property.subdivision} />
              <DetailItem label="Census Tract" value={property.censusTract} />
              <DetailItem label="FIPS" value={property.fips} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Owner Information */}
            <DetailSection title="Owner Information">
              <DetailItem label="Owner 1" value={property.owner1FullName} />
              <DetailItem label="Owner 1 Email" value={property.owner1EmailAddresses} />
              <DetailItem label="Owner 1 Phone" value={property.owner1PhoneNumbers} />
              <DetailItem label="Owner 2" value={property.owner2FullName} />
              <DetailItem label="Owner 2 Email" value={property.owner2EmailAddresses} />
              <DetailItem label="Owner 2 Phone" value={property.owner2PhoneNumbers} />
              <DetailItem label="Mailing Address" value={property.mailingAddress} />
              <DetailItem label="Absentee Status" value={property.absenteeStatus} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Mortgage & Financial */}
            <DetailSection title="Mortgage & Financial">
              <DetailItem label="Number of Mortgages" value={property.numberOfMortgages} />
              <DetailItem label="Mortgage Balance" value={formatCurrency(property.mortgageLoanBalance)} />
              <DetailItem label="Equity" value={formatCurrency(property.equity)} />
              <DetailItem label="Equity Percentage" value={`${property.equityPercentage}%`} />
              
              {/* Mortgage 1 */}
              <DetailItem label="Mortgage 1 Lender" value={property.mortgage1LenderName} />
              <DetailItem label="Mortgage 1 Type" value={property.mortgage1LoanType} />
              <DetailItem label="Mortgage 1 Amount" value={formatCurrency(property.mortgage1Amount)} />
              <DetailItem label="Mortgage 1 Date" value={property.mortgage1LoanDate} />
              <DetailItem label="Mortgage 1 Rate" value={`${property.mortgage1Rate}%`} />
              
              {/* Mortgage 2 */}
              <DetailItem label="Mortgage 2 Lender" value={property.mortgage2LenderName} />
              <DetailItem label="Mortgage 2 Type" value={property.mortgage2LoanType} />
              <DetailItem label="Mortgage 2 Amount" value={formatCurrency(property.mortgage2Amount)} />
              <DetailItem label="Mortgage 2 Date" value={property.mortgage2LoanDate} />
              <DetailItem label="Mortgage 2 Rate" value={`${property.mortgage2Rate}%`} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Tax & Assessment */}
            <DetailSection title="Tax & Assessment">
              <DetailItem label="Current Year Tax" value={formatCurrency(property.currentYearTax)} />
              <DetailItem label="Tax Amount" value={formatCurrency(property.taxAmount)} />
              <DetailItem label="Tax Rate Code Area" value={property.taxRateCodeArea} />
              <DetailItem label="Current Year Assessment" value={formatCurrency(property.currentYearAssessment)} />
              <DetailItem label="Total Assessed Value" value={formatCurrency(property.totalAssessedValue)} />
              <DetailItem label="Assessed Land" value={formatCurrency(property.assessedLand)} />
              <DetailItem label="Assessed Improvement" value={formatCurrency(property.assessedImprovement)} />
              <DetailItem label="Total Market Value" value={formatCurrency(property.totalMarketValue)} />
              <DetailItem label="Market Value Land" value={formatCurrency(property.marketValueLand)} />
              <DetailItem label="Market Value Improvement" value={formatCurrency(property.marketValueImprovement)} />
              <DetailItem label="Estimated Value" value={formatCurrency(property.estimatedValue)} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Property Identifiers */}
            <DetailSection title="Property Identifiers">
              <DetailItem label="APN/PIN/Tax 1" value={property.apn} />
              <DetailItem label="APN/PIN/Tax 2" value={property.apn2} />
              <DetailItem label="APN/PIN/Tax 3" value={property.apn3} />
              <DetailItem label="MLS ID" value={property.mlsId} />
              <DetailItem label="Block #" value={property.blockNumber} />
              <DetailItem label="Lot #" value={property.lotNumber} />
              <DetailItem label="Section #" value={property.sectionNumber} />
              <DetailItem label="Plat Map Reference" value={property.platMapReference} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Exemptions */}
            <DetailSection title="Exemptions">
              <DetailItem label="Veterans" value={property.exemptionVeterans ? 'Yes' : 'No'} />
              <DetailItem label="Disabled" value={property.exemptionDisabled ? 'Yes' : 'No'} />
              <DetailItem label="Senior" value={property.exemptionSenior ? 'Yes' : 'No'} />
              <DetailItem label="Widow" value={property.exemptionWidow ? 'Yes' : 'No'} />
              <DetailItem label="Homestead" value={property.exemptionHomestead ? 'Yes' : 'No'} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Transaction History */}
            <DetailSection title="Transaction History">
              <DetailItem label="Listing Type" value={property.listingType} />
              <DetailItem label="Days on Market" value={property.daysOnMarket} />
              <DetailItem label="Contract Status Change Date" value={property.contractStatusChangeDate} />
              <DetailItem label="Recording Date" value={property.recordingDate} />
              <DetailItem label="Document Type" value={property.documentType} />
              <DetailItem label="Sales Price" value={formatCurrency(property.salesPrice)} />
              <DetailItem label="Distressed Indicator" value={property.distressedIndicator} />
              <DetailItem label="Distressed Recording Date" value={property.distressedRecordingDate} />
              <DetailItem label="Distressed Case Number" value={property.distressedCaseNumber} />
              <DetailItem label="Auction Date" value={property.auctionDate} />
              <DetailItem label="Default Date" value={property.defaultDate} />
            </DetailSection>

            <div className="bg-gradient-to-r from-primary/10 via-gray-100 to-transparent h-px w-full" />

            {/* Land Information */}
            <DetailSection title="Land Information">
              <DetailItem label="Lot Acres" value={property.lotAcres} />
              <DetailItem label="Lot SQFT" value={property.lotSqft} />
              <DetailItem label="County Use Code" value={property.countyUseCode} />
              <DetailItem label="Universal Land Use" value={property.universalLandUse} />
              <DetailItem label="State Land Use Code" value={property.stateLandUseCode} />
              <DetailItem label="Zoning" value={property.zoning} />
            </DetailSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 