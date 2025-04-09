"use client"

import { Button } from "@/components/ui/button"
import { Bed, Bath, Square, Eye, Calendar, Car, Home } from "lucide-react"
import { type Property } from "@/lib/utils/property-data"
import { formatCurrency } from "@/lib/utils/format"

interface PropertyListItemProps {
  property: Property
  onViewDetails?: (id: string) => void
}

export function PropertyListItem({ property, onViewDetails }: PropertyListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <div className="flex h-full items-center justify-center">
          <Home className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-semibold truncate" title={property.address}>
            {property.address}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.livingAreaSqft.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Built {property.yearBuilt}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {property.parkingSpaces > 0 && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{property.parkingSpaces} {property.parkingType || 'parking'}</span>
            </div>
          )}
          {property.universalLandUse && (
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>{property.universalLandUse}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="text-lg font-semibold">{formatCurrency(property.price)}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(property.apn)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  )
} 