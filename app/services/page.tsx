"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, Loader2 } from "lucide-react"
import { SERVICE_CATEGORIES } from "@/lib/types"
import type { Service } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const category = searchParams.get("category")
  const search = searchParams.get("search")

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true)
      try {
        let query = supabase
          .from("services")
          .select("*, provider:profiles(*)")
          .eq("is_available", true)
          .order("created_at", { ascending: false })

        if (category) {
          query = query.eq("category", category)
        }

        if (search) {
          query = query.ilike("title", `%${search}%`)
        }

        const { data } = await query
        setServices(data || [])
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search])

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
            <form className="flex gap-3 mb-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="search" 
                  placeholder="Search services..." 
                  defaultValue={search || ""} 
                  className="pl-10"
                  onChange={(e) => {
                    // Simple debounce could be added here
                  }}
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link href="/services">
                <Badge
                  variant={!category ? "default" : "outline"}
                  className={`cursor-pointer ${!category ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {SERVICE_CATEGORIES.map((cat) => (
                <Link key={cat} href={`/services?category=${encodeURIComponent(cat)}`}>
                  <Badge
                    variant={category === cat ? "default" : "outline"}
                    className={`cursor-pointer ${category === cat ? "bg-foreground text-background" : ""}`}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services && services.length > 0 ? (
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
                {search || category
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
