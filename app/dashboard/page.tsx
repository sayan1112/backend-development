import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ShoppingBag, Sparkles, MessageSquare, Package, Calendar, TrendingUp, Plus } from "lucide-react"
import { DashboardBookingActions } from "@/components/dashboard-booking-actions"
import { DashboardOrderActions } from "@/components/dashboard-order-actions"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  // Get user's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })

  // Get user's requests
  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .eq("requester_id", user.id)
    .order("created_at", { ascending: false })

  // Get incoming bookings (as provider)
  const { data: incomingBookings } = await supabase
    .from("bookings")
    .select("*, service:services(*), buyer:profiles(*)")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false })

  // Get outgoing bookings (as buyer)
  const { data: outgoingBookings } = await supabase
    .from("bookings")
    .select("*, service:services(*), provider:profiles(*)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })

  // Get incoming orders (as seller)
  const { data: incomingOrders } = await supabase
    .from("orders")
    .select("*, product:products(*), buyer:profiles(*)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  // Get outgoing orders (as buyer)
  const { data: outgoingOrders } = await supabase
    .from("orders")
    .select("*, product:products(*), seller:profiles(*)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalListings = (products?.length || 0) + (services?.length || 0)
  const pendingBookings = incomingBookings?.filter((b) => b.status === "pending").length || 0
  const pendingOrders = incomingOrders?.filter((o) => o.status === "pending").length || 0
  const totalEarnings = [
    ...(incomingBookings?.filter((b) => b.status === "completed") || []),
    ...(incomingOrders?.filter((o) => o.status === "completed") || []),
  ].reduce((sum, item) => sum + (item.total_price || 0), 0)

  const defaultTab = params.tab || "overview"

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    declined: "bg-red-100 text-red-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    confirmed: "bg-blue-100 text-blue-800",
    available: "bg-green-100 text-green-800",
    reserved: "bg-yellow-100 text-yellow-800",
    sold: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-foreground text-background text-xl">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || "Welcome"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link href="/create">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalListings}</p>
                    <p className="text-xs text-muted-foreground">Active Listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pendingBookings + pendingOrders}</p>
                    <p className="text-xs text-muted-foreground">Pending Actions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{requests?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">My Requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Booking Requests</CardTitle>
                    <CardDescription>Service bookings awaiting your response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {incomingBookings && incomingBookings.filter((b) => b.status === "pending").length > 0 ? (
                      <div className="space-y-3">
                        {incomingBookings
                          .filter((b) => b.status === "pending")
                          .slice(0, 3)
                          .map((booking: any) => (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">{booking.service?.title}</p>
                                <p className="text-xs text-muted-foreground">From: {booking.buyer?.full_name}</p>
                              </div>
                              <DashboardBookingActions bookingId={booking.id} />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No pending bookings</p>
                    )}
                  </CardContent>
                </Card>

                {/* Pending Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pending Product Orders</CardTitle>
                    <CardDescription>Product reservations awaiting confirmation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {incomingOrders && incomingOrders.filter((o) => o.status === "pending").length > 0 ? (
                      <div className="space-y-3">
                        {incomingOrders
                          .filter((o) => o.status === "pending")
                          .slice(0, 3)
                          .map((order: any) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground text-sm">{order.product?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  From: {order.buyer?.full_name} • ₹{order.total_price}
                                </p>
                              </div>
                              <DashboardOrderActions orderId={order.id} productId={order.product_id} />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No pending orders</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>Manage your product listings</CardDescription>
                  </div>
                  <Link href="/products/create">
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {products && products.length > 0 ? (
                    <div className="space-y-3">
                      {products.map((product: any) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden">
                                <img
                                  src={
                                    product.images?.[0] ||
                                    `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(product.title)}`
                                  }
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{product.title}</p>
                                <p className="text-sm text-muted-foreground">₹{product.price}</p>
                              </div>
                            </div>
                            <Badge className={statusColors[product.status]}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No products listed yet</p>
                      <Link href="/products/create">
                        <Button>List Your First Product</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Services</CardTitle>
                    <CardDescription>Manage your service offerings</CardDescription>
                  </div>
                  <Link href="/services/create">
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Service
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {services && services.length > 0 ? (
                    <div className="space-y-3">
                      {services.map((service: any) => (
                        <Link key={service.id} href={`/services/${service.id}`}>
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                            <div>
                              <p className="font-medium text-foreground">{service.title}</p>
                              <p className="text-sm text-muted-foreground">
                                ₹{service.price} • {service.total_bookings} bookings
                              </p>
                            </div>
                            <Badge variant={service.is_available ? "default" : "secondary"}>
                              {service.is_available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No services offered yet</p>
                      <Link href="/services/create">
                        <Button>Offer Your First Service</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incoming Bookings</CardTitle>
                  <CardDescription>Bookings for your services</CardDescription>
                </CardHeader>
                <CardContent>
                  {incomingBookings && incomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {incomingBookings.map((booking: any) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{booking.service?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {booking.buyer?.full_name} • ₹{booking.total_price}
                            </p>
                            {booking.message && (
                              <p className="text-sm text-muted-foreground mt-1 italic">{`"${booking.message}"`}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={statusColors[booking.status]}>
                              {booking.status.replace("_", " ").charAt(0).toUpperCase() +
                                booking.status.slice(1).replace("_", " ")}
                            </Badge>
                            {booking.status === "pending" && <DashboardBookingActions bookingId={booking.id} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No incoming bookings</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>Services you have booked</CardDescription>
                </CardHeader>
                <CardContent>
                  {outgoingBookings && outgoingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {outgoingBookings.map((booking: any) => (
                        <Link key={booking.id} href={`/services/${booking.service_id}`}>
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                            <div>
                              <p className="font-medium text-foreground">{booking.service?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Provider: {booking.provider?.full_name} • ₹{booking.total_price}
                              </p>
                            </div>
                            <Badge className={statusColors[booking.status]}>
                              {booking.status.replace("_", " ").charAt(0).toUpperCase() +
                                booking.status.slice(1).replace("_", " ")}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No bookings made</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incoming Orders</CardTitle>
                  <CardDescription>Product orders you need to fulfill</CardDescription>
                </CardHeader>
                <CardContent>
                  {incomingOrders && incomingOrders.length > 0 ? (
                    <div className="space-y-3">
                      {incomingOrders.map((order: any) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{order.product?.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Buyer: {order.buyer?.full_name} • ₹{order.total_price} •{" "}
                              {order.payment_method?.toUpperCase()}
                            </p>
                            {order.meetup_location && (
                              <p className="text-sm text-muted-foreground">Meetup: {order.meetup_location}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={statusColors[order.status]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            {order.status === "pending" && (
                              <DashboardOrderActions orderId={order.id} productId={order.product_id} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No incoming orders</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Purchases</CardTitle>
                  <CardDescription>Products you have ordered</CardDescription>
                </CardHeader>
                <CardContent>
                  {outgoingOrders && outgoingOrders.length > 0 ? (
                    <div className="space-y-3">
                      {outgoingOrders.map((order: any) => (
                        <Link key={order.id} href={`/products/${order.product_id}`}>
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                            <div>
                              <p className="font-medium text-foreground">{order.product?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Seller: {order.seller?.full_name} • ₹{order.total_price}
                              </p>
                            </div>
                            <Badge className={statusColors[order.status]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No purchases made</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
