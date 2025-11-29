import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import type { Request } from "@/lib/types"

interface RequestCardProps {
  request: Request
}

const urgencyColors = {
  low: "bg-secondary text-foreground",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function RequestCard({ request }: RequestCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Link href={`/requests/${request.id}`} className="group">
      <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {request.category}
            </Badge>
            <Badge className={`text-xs ${urgencyColors[request.urgency]}`}>
              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(request.created_at)}
          </span>
        </div>

        <h3 className="font-medium text-foreground mb-2 group-hover:text-foreground/80">{request.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{request.description}</p>

        <div className="flex items-center justify-between">
          {request.budget_max && (
            <span className="text-sm font-medium text-foreground">
              Budget: ₹{request.budget_min?.toLocaleString() || 0} - ₹{request.budget_max.toLocaleString()}
            </span>
          )}
          {request.location && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {request.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
