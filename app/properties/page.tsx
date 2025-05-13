"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, DollarSign, Plus, LayoutGrid, List, Loader2, UploadCloud, X } from "lucide-react"
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
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
import { toast } from "@/components/ui/use-toast"
import { useProperties } from "@/contexts/property-context"
import { Pagination } from "@/components/ui/pagination"
import type { Property } from "@/types/supabase"
import { createBrowserClient } from '@supabase/ssr'

// Add this interface for the form
interface AddPropertyForm {
  property_address: string
  city: string
  state: string
  zip_5: string
  list_price: string
  status: string
  beds: string
  baths: string
  living_area_sqft: string
  year_built: string
  parking_spaces: string
  parking_type: string
  universal_land_use: string
  images: File[]
}

// Add this function at the top of the file after imports
function transformCSVToProperties(csvData: any[]): Property[] {
  return csvData.map((record: any) => {
    const property: Property = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      property_address: record['Property Address'] || '',
      city: record['City'] || '',
      state: record['State'] || '',
      zip_5: record['ZIP 5'] || '',
      list_price: Number(record['List Price']) || undefined,
      status: record['Status'] || 'Active',
      beds: Number(record['Beds']) || undefined,
      baths: Number(record['Baths']) || undefined,
      living_area_sqft: Number(record['Living Area SQFT']) || undefined,
      year_built: Number(record['Year Built']) || undefined,
      parking_spaces: Number(record['Parking spaces']) || undefined,
      parking_type: record['Parking Type'] || undefined,
      universal_land_use: record['Universal Land Use'] || undefined,
      images: [],
      skip_trace_status: record['Skip Trace Status'] || undefined
    }
    return property
  })
}

export default function PropertiesPage() {
  const { properties, loading, error, fetchProperties, addProperty } = useProperties()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [location, setLocation] = useState("all")
  const [propertyType, setPropertyType] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [addPropertyOpen, setAddPropertyOpen] = useState(false)
  const [formData, setFormData] = useState<AddPropertyForm>({
    property_address: "",
    city: "",
    state: "",
    zip_5: "",
    list_price: "",
    status: "",
    beds: "",
    baths: "",
    living_area_sqft: "",
    year_built: "",
    parking_spaces: "",
    parking_type: "",
    universal_land_use: "",
    images: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 // Number of items to show per page
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [importSummary, setImportSummary] = useState<null | {
    total: number;
    dnc: number;
    active: number;
    outreach: number;
  }>(null)
  const [skipTraceFilter, setSkipTraceFilter] = useState<'dnc' | 'active' | 'outreach'>('outreach')
  const [pendingImportedProperties, setPendingImportedProperties] = useState<Property[] | null>(null)
  const [savingImport, setSavingImport] = useState(false)
  const [importConfirmed, setImportConfirmed] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Add this new code to get unique property types
  const uniquePropertyTypes = [...new Set(properties
    .map(property => property.universal_land_use)
    .filter(type => type) // Remove null/undefined values
  )].sort()

  const filteredProperties = properties.filter((property) => {
    const priceMin = minPrice ? Number.parseInt(minPrice) : 0
    const priceMax = maxPrice ? Number.parseInt(maxPrice) : Infinity
    const locationFilter = location.trim()

    const matchesMinPrice = !minPrice || (property.list_price && property.list_price >= priceMin)
    const matchesMaxPrice = !maxPrice || (property.list_price && property.list_price <= priceMax)
    const matchesLocation = locationFilter === "all" || 
      property.state === locationFilter
    const matchesType = !propertyType || propertyType === "all" || 
      (property.universal_land_use && property.universal_land_use === propertyType)
    let matchesSkipTrace = true
    if (skipTraceFilter === 'dnc') matchesSkipTrace = (property.skip_trace_status || '').toLowerCase().includes('dnc')
    else if (skipTraceFilter === 'active') matchesSkipTrace = (property.skip_trace_status || '').toLowerCase().includes('active')
    else if (skipTraceFilter === 'outreach') matchesSkipTrace = !((property.skip_trace_status || '').toLowerCase().includes('dnc') || (property.skip_trace_status || '').toLowerCase().includes('active'))

    return matchesMinPrice && matchesMaxPrice && matchesLocation && matchesType && matchesSkipTrace
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [minPrice, maxPrice, location, propertyType])

  const handleViewDetails = (id: string) => {
    const property = properties.find(p => p.id === id)
    if (property) {
      setSelectedProperty(property)
      setDetailsOpen(true)
    }
  }

  const handleInputChange = (field: keyof AddPropertyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.property_address || !formData.list_price || !formData.universal_land_use) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      // Upload images to Supabase Storage
      const imageUrls: string[] = []
      for (const image of formData.images) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(`properties/${fileName}`, image)

        if (error) throw error
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(`properties/${fileName}`)
          imageUrls.push(publicUrl)
        }
      }

      // Create new property object
      const newProperty = {
        property_address: formData.property_address,
        city: formData.city,
        state: formData.state,
        zip_5: formData.zip_5,
        list_price: Number(formData.list_price),
        status: formData.status || "Active",
        beds: Number(formData.beds) || undefined,
        baths: Number(formData.baths) || undefined,
        living_area_sqft: Number(formData.living_area_sqft) || undefined,
        year_built: Number(formData.year_built) || undefined,
        parking_spaces: Number(formData.parking_spaces) || undefined,
        parking_type: formData.parking_type || undefined,
        universal_land_use: formData.universal_land_use,
        images: imageUrls
      }

      // Add the property using the context function
      const result = await addProperty(newProperty)
      
      if (result) {
        toast({
          title: "Success",
          description: "Property added successfully",
        })
        setAddPropertyOpen(false)
        setFormData({
          property_address: "",
          city: "",
          state: "",
          zip_5: "",
          list_price: "",
          status: "",
          beds: "",
          baths: "",
          living_area_sqft: "",
          year_built: "",
          parking_spaces: "",
          parking_type: "",
          universal_land_use: "",
          images: [],
        })
      }
    } catch (err) {
      console.error('Error adding property:', err)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    Papa.parse(file as any, {
      header: true,
      complete: async (results: ParseResult<any>) => {
        try {
          const newProperties = results.data
          // Compute skip trace status counts
          let dnc = 0, active = 0, outreach = 0
          newProperties.forEach(p => {
            const skipStatus = (p.skip_trace_status || '').toLowerCase().trim()
            if (skipStatus === 'dnc') dnc++
            else if (skipStatus === 'active' || skipStatus === 'active listing') active++
            else outreach++
          })
          setImportSummary({
            total: newProperties.length,
            dnc,
            active,
            outreach
          })
          setPendingImportedProperties(newProperties)
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive"
          })
        } finally {
          setImporting(false)
        }
      },
      error: () => {
        toast({
          title: "Error",
          description: "Failed to parse CSV file",
          variant: "destructive"
        })
        setImporting(false)
      }
    } as any)
  }

  const handleConfirmImport = async () => {
    if (!pendingImportedProperties) return
    setSavingImport(true)
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(pendingImportedProperties)
      if (error) {
        toast({
          title: "Error",
          description: "Failed to import properties: " + error.message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Success",
          description: `Imported ${data ? (data as any[]).length : 0} properties!`
        })
        fetchProperties()
      }
      setImportSummary(null)
      setPendingImportedProperties(null)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to import properties",
        variant: "destructive"
      })
    } finally {
      setSavingImport(false)
    }
  }

  const handleExportAllProperties = () => {
    // Export all properties with all fields
    // @ts-ignore
    const csv = Papa.unparse(properties)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'all_properties_export.csv')
  }

  // Export for Skip Tracing handler
  const handleExportSkipTracing = () => {
    // Choose relevant fields for skip tracing
    const exportFields = [
      'apn', 'address', 'city', 'state', 'zip5', 'price', 'status',
      'owner1FirstName', 'owner1LastName', 'owner1FullName',
      'owner1EmailAddresses', 'owner1PhoneNumbers',
      'universalLandUse'
    ]
    const data = filteredProperties.map((property) => {
      const row: Record<string, any> = {}
      exportFields.forEach(field => {
        row[field] = (property as any)[field] || ''
      })
      return row
    })
    // @ts-ignore
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'skip_tracing_export.csv')
  }

  // Update the AddPropertyDialogContent
  const AddPropertyDialogContent = (
    <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-6 -mr-6">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Property Images</label>
            <div className="grid gap-4">
              {/* Image preview */}
              {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="property_address">Address*</label>
              <Input
                id="property_address"
                placeholder="Address"
                value={formData.property_address}
                onChange={(e) => handleInputChange("property_address", e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label htmlFor="zip_5">Zip Code</label>
              <Input
                id="zip_5"
                placeholder="Zip Code"
                value={formData.zip_5}
                onChange={(e) => handleInputChange("zip_5", e.target.value)}
              />
            </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="list_price">Price*</label>
              <Input
                id="list_price"
                type="number"
                placeholder="Price"
                value={formData.list_price}
                onChange={(e) => handleInputChange("list_price", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Contract">Under Contract</SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label htmlFor="living_area_sqft">Living Area (sqft)</label>
              <Input
                id="living_area_sqft"
                type="number"
                placeholder="Living Area"
                value={formData.living_area_sqft}
                onChange={(e) => handleInputChange("living_area_sqft", e.target.value)}
              />
            </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label htmlFor="year_built">Year Built</label>
              <Input
                id="year_built"
                type="number"
                placeholder="Year Built"
                value={formData.year_built}
                onChange={(e) => handleInputChange("year_built", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="parking_spaces">Parking Spaces</label>
              <Input
                id="parking_spaces"
                type="number"
                placeholder="Parking Spaces"
                value={formData.parking_spaces}
                onChange={(e) => handleInputChange("parking_spaces", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="parking_type">Parking Type</label>
                <Select value={formData.parking_type} onValueChange={(value) => handleInputChange("parking_type", value)}>
                  <SelectTrigger id="parking_type">
                    <SelectValue placeholder="Select parking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Garage">Garage</SelectItem>
                    <SelectItem value="Carport">Carport</SelectItem>
                    <SelectItem value="Driveway">Driveway</SelectItem>
                    <SelectItem value="Street">Street</SelectItem>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="Covered">Covered</SelectItem>
                    <SelectItem value="Underground">Underground</SelectItem>
                    <SelectItem value="Tandem">Tandem</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="propertyType">Property Type*</label>
            <Select value={formData.universal_land_use} onValueChange={(value) => handleInputChange("universal_land_use", value)}>
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {uniquePropertyTypes.map(type => (
                  <SelectItem key={type || ''} value={type || ''}>{type || ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>
        <DialogFooter className="mt-4 pt-4 border-t">
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
      <div className="flex items-center justify-between">
        <PageHeader
          title="Property Listings"
          description="Manage your property listings"
        />
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => setAddPropertyOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Button>
          <Button
            variant="outline"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportSkipTracing}
            disabled={!importConfirmed && !!pendingImportedProperties}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Export for Skip Tracing
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImportCSV}
          />
        </div>
      </div>

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
                    <SelectItem key={type || ''} value={type || ''}>{type || ''}</SelectItem>
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

      {/* Quick Skip Trace Filter Bar */}
      <div className="flex gap-2 my-4">
        <Button variant={skipTraceFilter === 'outreach' ? 'default' : 'outline'} onClick={() => setSkipTraceFilter('outreach')}>Ready for Outreach</Button>
        <Button variant={skipTraceFilter === 'dnc' ? 'default' : 'outline'} onClick={() => setSkipTraceFilter('dnc')}>DNC</Button>
        <Button variant={skipTraceFilter === 'active' ? 'default' : 'outline'} onClick={() => setSkipTraceFilter('active')}>Active Listing</Button>
      </div>

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
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
                skipTraceStatus={property.skip_trace_status}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y">
              {currentProperties.map((property) => (
                <PropertyListItem
                  key={property.id}
                  property={property}
                  onViewDetails={handleViewDetails}
                  skipTraceStatus={property.skip_trace_status}
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
      {!loading && !error && currentProperties.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No properties found matching your criteria
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Import Summary Modal */}
      {importSummary && (
        <Dialog open={!!importSummary} onOpenChange={() => setImportSummary(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>Total properties imported: <b>{importSummary.total}</b></div>
              <div>Marked DNC: <b>{importSummary.dnc}</b></div>
              <div>Active Listings: <b>{importSummary.active}</b></div>
              <div>Ready for Outreach: <b>{importSummary.outreach}</b></div>
            </div>
            <DialogFooter>
              <Button onClick={() => setImportSummary(null)} disabled={savingImport}>Cancel</Button>
              <Button onClick={handleConfirmImport} disabled={savingImport}>
                {savingImport ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Saving...</span>
                ) : (
                  'Confirm & Save'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add this near the end of the component */}
      {AddPropertyDialogContent}
    </div>
  )
}
