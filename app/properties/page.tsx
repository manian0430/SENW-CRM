"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, DollarSign, Plus, LayoutGrid, List, Loader2, UploadCloud, X } from "lucide-react"
import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { PropertyCard } from "@/components/ui/property-card"
import { PropertyListItem } from "@/components/ui/property-list-item"
import { PropertyDetailsDialog } from "@/components/ui/property-details-dialog"
import { transformCSVToProperties, type Property } from "@/lib/utils/property-data"
import { toast } from "@/components/ui/use-toast"
import { useProperties } from "@/contexts/property-context"

// Add this interface for the form
interface AddPropertyForm {
  address: string
  city: string
  state: string
  zipCode: string
  price: string
  status: string
  beds: string
  baths: string
  livingAreaSqft: string
  yearBuilt: string
  parkingSpaces: string
  parkingType: string
  universalLandUse: string
  images: File[]
}

export default function PropertiesPage() {
  const { properties, loading, error, fetchProperties } = useProperties()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [location, setLocation] = useState("all")
  const [propertyType, setPropertyType] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addPropertyOpen, setAddPropertyOpen] = useState(false)
  const [formData, setFormData] = useState<AddPropertyForm>({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    status: "",
    beds: "",
    baths: "",
    livingAreaSqft: "",
    yearBuilt: "",
    parkingSpaces: "",
    parkingType: "",
    universalLandUse: "",
    images: [],
  })

  // Add this new code to get unique property types
  const uniquePropertyTypes = [...new Set(properties
    .map(property => property.universalLandUse)
    .filter(type => type) // Remove null/undefined values
  )].sort()

  const filteredProperties = properties.filter((property) => {
    const priceMin = minPrice ? Number.parseInt(minPrice) : 0
    const priceMax = maxPrice ? Number.parseInt(maxPrice) : Infinity
    const locationFilter = location.trim()

    const matchesMinPrice = !minPrice || (property.price >= priceMin)
    const matchesMaxPrice = !maxPrice || (property.price <= priceMax)
    const matchesLocation = locationFilter === "all" || 
      property.state === locationFilter
    const matchesType = !propertyType || propertyType === "all" || 
      (property.universalLandUse && property.universalLandUse === propertyType)

    return matchesMinPrice && matchesMaxPrice && matchesLocation && matchesType
  })

  const handleViewDetails = (apn: string) => {
    const property = properties.find(p => p.apn === apn)
    if (property) {
      setSelectedProperty(property)
      setDetailsOpen(true)
    }
  }

  const handleInputChange = (field: keyof AddPropertyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleAddProperty = async () => {
    // Basic validation
    if (!formData.address || !formData.price || !formData.universalLandUse) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    // Upload images and get URLs
    const imageUrls: string[] = []
    for (const image of formData.images) {
      // In a real application, you would upload these to your storage service
      // For now, we'll create object URLs as a placeholder
      const imageUrl = URL.createObjectURL(image)
      imageUrls.push(imageUrl)
    }

    // Create new property object
    const newProperty: Property = {
      apn: Date.now().toString(), // Generate a unique ID
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip5: formData.zipCode,
      zip4: "",
      price: Number(formData.price),
      status: formData.status || "Active",
      beds: Number(formData.beds) || 0,
      baths: Number(formData.baths) || 0,
      livingAreaSqft: Number(formData.livingAreaSqft) || 0,
      yearBuilt: Number(formData.yearBuilt) || 0,
      parkingSpaces: Number(formData.parkingSpaces) || 0,
      parkingType: formData.parkingType || "",
      universalLandUse: formData.universalLandUse,
      // Add other required fields with default values
      apn2: "",
      apn3: "",
      fips: "",
      censusTract: "",
      houseNumber: "",
      preDirection: "",
      street: "",
      streetSuffix: "",
      postDirection: "",
      unitType: "",
      unitNumber: "",
      mailingAddress: "",
      mailingHouseNumber: "",
      mailingPreDirection: "",
      mailingStreet: "",
      mailingStreetSuffix: "",
      mailingPostDirection: "",
      mailingUnitType: "",
      mailingUnitNumber: "",
      mailingCity: "",
      mailingState: "",
      mailingZip5: "",
      mailingZip4: "",
      mlsId: "",
      listingType: "",
      daysOnMarket: 0,
      contractStatusChangeDate: "",
      townshipName: "",
      subdivisionCode: "",
      subdivision: "",
      currentYearTax: 0,
      taxAmount: 0,
      taxRateCodeArea: "",
      currentYearAssessment: 0,
      totalAssessedValue: 0,
      assessedLand: 0,
      assessedImprovement: 0,
      totalMarketValue: 0,
      marketValueLand: 0,
      marketValueImprovement: 0,
      estimatedValue: 0,
      absenteeStatus: "",
      exemptionVeterans: false,
      exemptionDisabled: false,
      exemptionSenior: false,
      exemptionWidow: false,
      exemptionHomestead: false,
      blockNumber: "",
      lotNumber: "",
      sectionNumber: "",
      countyUseCode: "",
      stateLandUseCode: "",
      zoning: "",
      platMapReference: "",
      lotAcres: 0,
      lotSqft: 0,
      newConstruction: "",
      totalBuildingArea: 0,
      grossAreaSqft: 0,
      basementSqft: 0,
      garageSqft: 0,
      basement: "",
      flooringCover: "",
      stories: 0,
      style: "",
      airConditioning: "",
      heatType: "",
      fireplaceIndicator: "",
      constructionType: "",
      exteriorWall: "",
      roofMaterialType: "",
      porchType: "",
      hasPool: "No",
      totalUnits: 1,
      sellScore: "",
      distressedIndicator: "",
      distressedRecordingDate: "",
      distressedCaseNumber: "",
      auctionDate: "",
      defaultDate: "",
      recordingDate: "",
      documentType: "",
      salesPrice: 0,
      equity: 0,
      equityPercentage: 0,
      numberOfMortgages: 0,
      mortgageLoanBalance: 0,
      mortgage1LenderName: "",
      mortgage1LoanType: "",
      mortgage1Amount: 0,
      mortgage1LoanDate: "",
      mortgage1Rate: "",
      mortgage1Age: "",
      mortgage2LenderName: "",
      mortgage2LoanType: "",
      mortgage2Amount: 0,
      mortgage2LoanDate: "",
      mortgage2Rate: "",
      mortgage2Age: "",
      mortgage3LenderName: "",
      mortgage3LoanType: "",
      mortgage3Amount: 0,
      mortgage3LoanDate: "",
      mortgage3Rate: "",
      mortgage3Age: "",
      mortgage4LenderName: "",
      mortgage4LoanType: "",
      mortgage4Amount: 0,
      mortgage4LoanDate: "",
      mortgage4Rate: "",
      mortgage4Age: "",
      owner1FirstName: "",
      owner1MiddleName: "",
      owner1LastName: "",
      owner1FullName: "",
      owner1EmailAddresses: "",
      owner1PhoneNumbers: "",
      owner2FirstName: "",
      owner2MiddleName: "",
      owner2LastName: "",
      owner2FullName: "",
      owner2EmailAddresses: "",
      owner2PhoneNumbers: "",
      images: imageUrls,
    }

    // Add to properties array (Now we need to update the context)
    // setProperties(prev => [...prev, newProperty])
    // Consider how to update context - for now, refetching is simplest
    await fetchProperties()
    
    // Reset form
    setFormData({
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: "",
      status: "",
      beds: "",
      baths: "",
      livingAreaSqft: "",
      yearBuilt: "",
      parkingSpaces: "",
      parkingType: "",
      universalLandUse: "",
      images: [],
    })
    setAddPropertyOpen(false)
    
    toast({
      title: "Success",
      description: "Property added successfully"
    })
  }

  // Update the AddPropertyDialogContent
  const AddPropertyDialogContent = (
    <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Property Images</label>
            <div className="grid gap-4">
              {/* Image preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Property image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload button */}
              <label className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, WEBP up to 10MB each
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="address">Address*</label>
              <Input
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="city">City</label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="state">State</label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="zipCode">Zip Code</label>
              <Input
                id="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="price">Price*</label>
              <Input
                id="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
              <Input
                id="status"
                placeholder="Status (e.g., Active)"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="beds">Beds</label>
              <Input
                id="beds"
                type="number"
                placeholder="Beds"
                value={formData.beds}
                onChange={(e) => handleInputChange("beds", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="baths">Baths</label>
              <Input
                id="baths"
                type="number"
                placeholder="Baths"
                value={formData.baths}
                onChange={(e) => handleInputChange("baths", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="livingAreaSqft">Living Area (sqft)</label>
              <Input
                id="livingAreaSqft"
                type="number"
                placeholder="Living Area"
                value={formData.livingAreaSqft}
                onChange={(e) => handleInputChange("livingAreaSqft", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="yearBuilt">Year Built</label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="Year Built"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="parkingSpaces">Parking Spaces</label>
              <Input
                id="parkingSpaces"
                type="number"
                placeholder="Parking Spaces"
                value={formData.parkingSpaces}
                onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="parkingType">Parking Type</label>
              <Input
                id="parkingType"
                placeholder="Parking Type"
                value={formData.parkingType}
                onChange={(e) => handleInputChange("parkingType", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="propertyType">Property Type*</label>
            <Select value={formData.universalLandUse} onValueChange={(value) => handleInputChange("universalLandUse", value)}>
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {uniquePropertyTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAddPropertyOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddProperty}>
            Add Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Listings"
        description="Manage your property listings"
        action={{
          label: "Add Property",
          icon: Plus,
          onClick: () => setAddPropertyOpen(true),
        }}
      />

      {/* Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Min Price</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Min"
                  className="pl-8"
                  value={minPrice}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || Number(value) >= 0) {
                      setMinPrice(value)
                    }
                  }}
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Price</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Max"
                  className="pl-8"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || (Number(value) >= 0 && (!minPrice || Number(value) >= Number(minPrice)))) {
                      setMaxPrice(value)
                    }
                  }}
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Arizona">Arizona</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                  <SelectItem value="Illinois">Illinois</SelectItem>
                  <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniquePropertyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full"
                onClick={() => {
                  // Reset filters
                  setMinPrice("")
                  setMaxPrice("")
                  setLocation("all")
                  setPropertyType("")
                }}
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grid
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Property Display */}
      {!loading && !error && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.apn}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y">
              {filteredProperties.map((property) => (
                <PropertyListItem
                  key={property.apn}
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </CardContent>
          </Card>
        )
      )}

      {/* Property Details Dialog */}
      {selectedProperty && (
        <PropertyDetailsDialog
          property={selectedProperty}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}

      {/* No Results Message */}
      {!loading && !error && filteredProperties.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No properties found matching your criteria
          </CardContent>
        </Card>
      )}

      {/* Add this near the end of the component */}
      {AddPropertyDialogContent}
    </div>
  )
}
