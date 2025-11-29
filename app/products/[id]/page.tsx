import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Star, MessageSquare } from "lucide-react"
import { ReserveProductButton } from "@/components/reserve-product-button"

const conditionLabels = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*, seller:profiles(*)").eq("id", id).single()

  if (!product) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === product.seller_id

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`/.jpg?height=600&width=600&query=${encodeURIComponent(product.title)}`}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="secondary">{conditionLabels[product.condition as keyof typeof conditionLabels]}</Badge>
                {product.status !== "available" && (
                  <Badge variant={product.status === "sold" ? "destructive" : "default"}>
                    {product.status === "reserved" ? "Reserved" : "Sold"}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>

              <p className="text-2xl font-bold text-foreground mb-6">₹{product.price.toLocaleString()}</p>

              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

              {product.location && (
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              )}

              {/* Seller Info */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-foreground">
                        {product.seller?.full_name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.seller?.full_name || "Student"}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {product.seller?.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-foreground text-foreground" />
                            {product.seller.rating.toFixed(1)}
                          </span>
                        )}
                        {product.seller?.hostel_block && <span>{product.seller.hostel_block}</span>}
                      </div>
                    </div>
                    {!isOwner && user && (
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {!isOwner && product.status === "available" && (
                <div className="flex gap-3">
                  <ReserveProductButton productId={product.id} sellerId={product.seller_id} price={product.price} />
                </div>
              )}

              {isOwner && (
                <div className="flex gap-3">
                  <Link href={`/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Edit Listing
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
