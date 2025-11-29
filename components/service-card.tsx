import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Service } from "@/lib/types"

interface ServiceCardProps {
  service: Service
}

const priceTypeLabels = {
  fixed: "Fixed",
  hourly: "/hour",
  negotiable: "Negotiable",
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
        <div className="aspect-video bg-secondary relative overflow-hidden">
          {service.images && service.images.length > 0 ? (
            <img
              src={service.images[0] || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={`/.jpg?height=200&width=350&query=${encodeURIComponent(service.title + " service")}`}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!service.is_available && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Unavailable
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {service.category}
            </Badge>
            {service.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-foreground text-foreground" />
                {service.rating.toFixed(1)}
              </div>
            )}
          </div>
          <h3 className="font-medium text-foreground line-clamp-1 mb-1 group-hover:text-foreground/80">
            {service.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{service.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              ₹{service.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">
                {service.price_type === "hourly" ? "/hr" : ""}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{service.total_bookings} bookings</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
