"use client"

import { useState } from "react"
import { Search, MapPin, DollarSign, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { PropertyCard } from "@/components/ui/property-card"
import { Textarea } from "@/components/ui/textarea"

export default function PropertiesPage() {
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")

  // Placeholder for API calls
  // Fetch properties from /api/properties
  // Sync MLS data via /api/mls

  const properties = [
    {
      id: 1,
      address: "123 Main St, Seattle, WA",
      price: 750000,
      status: "Active",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
    },
    {
      id: 2,
      address: "456 Oak Ave, Bellevue, WA",
      price: 1250000,
      status: "Pending",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2400,
    },
    {
      id: 3,
      address: "789 Pine Rd, Redmond, WA",
      price: 950000,
      status: "Active",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2100,
    },
    {
      id: 4,
      address: "321 Elm St, Kirkland, WA",
      price: 1100000,
      status: "Sold",
      bedrooms: 4,
      bathrooms: 3.5,
      sqft: 2800,
    },
    {
      id: 5,
      address: "555 Cedar Ln, Seattle, WA",
      price: 825000,
      status: "Active",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1950,
    },
    {
      id: 6,
      address: "777 Maple Dr, Bellevue, WA",
      price: 1400000,
      status: "Active",
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3200,
    },
  ]

  const filteredProperties = properties.filter((property) => {
    const matchesMinPrice = minPrice === "" || property.price >= Number.parseInt(minPrice)
    const matchesMaxPrice = maxPrice === "" || property.price <= Number.parseInt(maxPrice)
    const matchesLocation = location === "" || property.address.toLowerCase().includes(location.toLowerCase())
    const matchesStatus = status === "" || status === "all" || property.status === status

    return matchesMinPrice && matchesMaxPrice && matchesLocation && matchesStatus
  })

  // Add Property Dialog Content
  const AddPropertyDialogContent = (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add New Property</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="address">Address</label>
          <Input id="address" placeholder="Full address" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="price">Price</label>
            <Input id="price" type="number" placeholder="Price" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="status">Status</label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label htmlFor="bedrooms">Bedrooms</label>
            <Input id="bedrooms" type="number" placeholder="Bedrooms" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="bathrooms">Bathrooms</label>
            <Input id="bathrooms" type="number" placeholder="Bathrooms" step="0.5" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sqft">Square Feet</label>
            <Input id="sqft" type="number" placeholder="Square Feet" />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="description">Description</label>
          <Textarea id="description" placeholder="Property description" rows={4} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="image">Property Images</label>
          <Input type="file" id="image" multiple />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setOpen(false)}>Add Property</Button>
      </div>
    </DialogContent>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Sold":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Listings"
        description="Manage your property listings"
        action={{
          label: "Add Property",
          icon: Plus,
          dialogContent: AddPropertyDialogContent,
        }}
      />

      {/* Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Min Price</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Min"
                  className="pl-8"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
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
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="City, State"
                  className="pl-8"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onViewDetails={(id) => console.log(`View details for property ${id}`)}
          />
        ))}
      </div>
    </div>
  )
}
