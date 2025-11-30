"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { RequestCard } from "@/components/request-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, Loader2 } from "lucide-react"
import { REQUEST_CATEGORIES } from "@/lib/types"
import type { Request } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function RequestsPage() {
  const searchParams = useSearchParams()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const category = searchParams.get("category")
  const urgency = searchParams.get("urgency")
  const search = searchParams.get("search")

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        let query = supabase
          .from("requests")
          .select("*, requester:profiles(*)")
          .eq("status", "open")
          .order("created_at", { ascending: false })

        if (category) {
          query = query.eq("category", category)
        }

        if (urgency) {
          query = query.eq("urgency", urgency)
        }

        if (search) {
          query = query.ilike("title", `%${search}%`)
        }

        const { data } = await query
        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, urgency, search])

  const urgencyLevels = ["low", "medium", "high", "urgent"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Requests</h1>
              <p className="text-muted-foreground mt-1">Help fellow students with their urgent needs</p>
            </div>
            <Link href="/requests/create">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4 mr-2" />
                Post Request
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
                  placeholder="Search requests..." 
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm text-muted-foreground mr-2 self-center">Category:</span>
              <Link href="/requests">
                <Badge
                  variant={!category ? "default" : "outline"}
                  className={`cursor-pointer ${!category ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {REQUEST_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/requests?category=${encodeURIComponent(cat)}${urgency ? `&urgency=${urgency}` : ""}`}
                >
                  <Badge
                    variant={category === cat ? "default" : "outline"}
                    className={`cursor-pointer ${category === cat ? "bg-foreground text-background" : ""}`}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Urgency Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2 self-center">Urgency:</span>
              <Link href={`/requests${category ? `?category=${category}` : ""}`}>
                <Badge
                  variant={!urgency ? "default" : "outline"}
                  className={`cursor-pointer ${!urgency ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {urgencyLevels.map((level) => (
                <Link
                  key={level}
                  href={`/requests?urgency=${level}${category ? `&category=${category}` : ""}`}
                >
                  <Badge
                    variant={urgency === level ? "default" : "outline"}
                    className={`cursor-pointer ${urgency === level ? "bg-foreground text-background" : ""}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request: Request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
              <p className="text-muted-foreground mb-6">
                {search || category || urgency
                  ? "Try adjusting your filters"
                  : "Be the first to post a request!"}
              </p>
              <Link href="/requests/create">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Request
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
