import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { SERVICE_CATEGORIES } from "@/lib/types"
import type { Service } from "@/lib/types"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("services")
    .select("*, provider:profiles(*)")
    .eq("is_available", true)
    .order("created_at", { ascending: false })

  if (params.category) {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`)
  }

  const { data: services } = await query

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Services</h1>
              <p className="text-muted-foreground mt-1">Find skilled students to help you</p>
            </div>
            <Link href="/services/create">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4 mr-2" />
                Offer Service
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <form className="flex gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="search" placeholder="Search services..." defaultValue={params.search} className="pl-10" />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link href="/services">
                <Badge
                  variant={!params.category ? "default" : "outline"}
                  className={`cursor-pointer ${!params.category ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {SERVICE_CATEGORIES.map((category) => (
                <Link key={category} href={`/services?category=${encodeURIComponent(category)}`}>
                  <Badge
                    variant={params.category === category ? "default" : "outline"}
                    className={`cursor-pointer ${params.category === category ? "bg-foreground text-background" : ""}`}
                  >
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: Service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">
                {params.search || params.category
                  ? "Try adjusting your search or filters"
                  : "Be the first to offer a service!"}
              </p>
              <Link href="/services/create">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Offer a Service
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
