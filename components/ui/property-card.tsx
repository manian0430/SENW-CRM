"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Bed, Bath, Square, Calendar, Car, Home, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { type Property } from "@/lib/utils/property-data"
import { formatCurrency } from "@/lib/utils/format"

export interface PropertyCardProps {
  property: Property
  onViewDetails?: (apn: string) => void
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (property.images.length > currentImageIndex + 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

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
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.address} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />
            {property.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={previousImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={nextImage}
                  disabled={currentImageIndex === property.images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 font-semibold text-lg truncate" title={property.address}>
            {property.address}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
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
          {property.parkingSpaces > 0 && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{property.parkingSpaces} {property.parkingType || 'parking'}</span>
            </div>
          )}
          {property.universalLandUse && (
            <div className="flex items-center text-gray-500">
              <Home className="h-4 w-4 mr-1" />
              <span>{property.universalLandUse}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-semibold">{formatCurrency(property.price)}</div>
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
    </div>
  )
}
