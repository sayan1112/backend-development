import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

const conditionLabels = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
        <div className="aspect-square bg-secondary relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={`/.jpg?height=300&width=300&query=${encodeURIComponent(product.title)}`}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {product.status !== "available" && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                {product.status === "reserved" ? "Reserved" : "Sold"}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-foreground/80">{product.title}</h3>
            <Badge variant="outline" className="shrink-0 text-xs">
              {conditionLabels[product.condition]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
