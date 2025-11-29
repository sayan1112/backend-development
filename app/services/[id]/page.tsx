import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Star, MessageSquare } from "lucide-react"
import { BookServiceButton } from "@/components/book-service-button"

const priceTypeLabels = {
  fixed: "Fixed Price",
  hourly: "Per Hour",
  negotiable: "Negotiable",
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase.from("services").select("*, provider:profiles(*)").eq("id", id).single()

  if (!service) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === service.provider_id

  // Get reviews for this service
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, reviewer:profiles(*)")
    .eq("target_id", id)
    .eq("target_type", "service")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Image */}
              <div className="aspect-video bg-secondary rounded-2xl overflow-hidden mb-6">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0] || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`/.jpg?height=400&width=700&query=${encodeURIComponent(service.title + " service")}`}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Service Details */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{service.category}</Badge>
                {service.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    <span className="font-medium">{service.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({service.total_bookings} bookings)</span>
                  </div>
                )}
                {!service.is_available && <Badge variant="outline">Currently Unavailable</Badge>}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{service.title}</h1>

              <p className="text-muted-foreground mb-8 leading-relaxed whitespace-pre-wrap">{service.description}</p>

              {/* Reviews Section */}
              {reviews && reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-secondary text-foreground">
                                {review.reviewer?.full_name?.charAt(0) || "R"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">
                                  {review.reviewer?.full_name || "Student"}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating ? "fill-foreground text-foreground" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">
                      ₹{service.price.toLocaleString()}
                      {service.price_type === "hourly" && (
                        <span className="text-lg font-normal text-muted-foreground">/hr</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {priceTypeLabels[service.price_type as keyof typeof priceTypeLabels]}
                    </p>
                  </div>

                  {service.delivery_time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                      <Clock className="h-4 w-4" />
                      <span>Delivery: {service.delivery_time}</span>
                    </div>
                  )}

                  {/* Provider Info */}
                  <div className="border-t border-border pt-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-secondary text-foreground">
                          {service.provider?.full_name?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{service.provider?.full_name || "Provider"}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {service.provider?.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-foreground text-foreground" />
                              {service.provider.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isOwner && user && (
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Provider
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isOwner && service.is_available && (
                    <BookServiceButton
                      serviceId={service.id}
                      providerId={service.provider_id}
                      price={service.price}
                      serviceTitle={service.title}
                    />
                  )}

                  {isOwner && (
                    <Link href={`/services/${service.id}/edit`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Edit Service
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
