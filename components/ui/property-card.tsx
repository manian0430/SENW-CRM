"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Bed, Bath, Square, Calendar, Car, Home, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import type { Property } from "@/types/supabase"
import { formatCurrency } from "@/lib/utils/format"

export interface PropertyCardProps {
  property: Property
  onViewDetails?: (id: string) => void
  skipTraceStatus?: string
}

export function PropertyCard({ property, onViewDetails, skipTraceStatus }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]}
              alt={property.property_address || "Property"}
              fill
              className="object-cover"
            />
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-semibold truncate" title={property.property_address}>
            {property.property_address}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status || '')}`}>
            {property.status}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {property.beds && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.beds} beds</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.baths} baths</span>
            </div>
          )}
          {property.living_area_sqft && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.living_area_sqft.toLocaleString()} sqft</span>
            </div>
          )}
          {property.year_built && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Built {property.year_built}</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {property.parking_spaces && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{property.parking_spaces} {property.parking_type || 'parking'}</span>
            </div>
          )}
          {property.universal_land_use && (
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>{property.universal_land_use}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold">{property.list_price ? formatCurrency(property.list_price) : 'Price not listed'}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails && onViewDetails(property.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
