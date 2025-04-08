"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Bed, Bath, Square, Eye } from "lucide-react"

interface PropertyCardProps {
  property: {
    id: number | string
    address: string
    price: number
    status: string
    bedrooms: number
    bathrooms: number
    sqft: number
    image?: string
  }
  onViewDetails?: (id: number | string) => void
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "status-badge-active"
      case "pending":
        return "status-badge-pending"
      case "sold":
        return "status-badge-sold"
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
    <Card className="property-card">
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={property.image || `/placeholder.svg?height=200&width=400`}
          alt={property.address}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={`status-badge ${getStatusColor(property.status)}`}>{property.status}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.address}</h3>
        <p className="property-price mb-3">{formatPrice(property.price)}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.sqft.toLocaleString()}</span>
          </div>
        </div>
        <Button
          className="w-full bg-senw-gold hover:bg-senw-gold/90 text-white"
          onClick={() => onViewDetails && onViewDetails(property.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
