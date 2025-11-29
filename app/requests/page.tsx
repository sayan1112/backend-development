import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { RequestCard } from "@/components/request-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { REQUEST_CATEGORIES } from "@/lib/types"
import type { Request } from "@/lib/types"

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; urgency?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("requests")
    .select("*, requester:profiles(*)")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (params.category) {
    query = query.eq("category", params.category)
  }

  if (params.urgency) {
    query = query.eq("urgency", params.urgency)
  }

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`)
  }

  const { data: requests } = await query

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
            <form className="flex gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="search" placeholder="Search requests..." defaultValue={params.search} className="pl-10" />
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
                  variant={!params.category ? "default" : "outline"}
                  className={`cursor-pointer ${!params.category ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {REQUEST_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/requests?category=${encodeURIComponent(category)}${params.urgency ? `&urgency=${params.urgency}` : ""}`}
                >
                  <Badge
                    variant={params.category === category ? "default" : "outline"}
                    className={`cursor-pointer ${params.category === category ? "bg-foreground text-background" : ""}`}
                  >
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Urgency Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2 self-center">Urgency:</span>
              <Link href={`/requests${params.category ? `?category=${params.category}` : ""}`}>
                <Badge
                  variant={!params.urgency ? "default" : "outline"}
                  className={`cursor-pointer ${!params.urgency ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {urgencyLevels.map((level) => (
                <Link
                  key={level}
                  href={`/requests?urgency=${level}${params.category ? `&category=${params.category}` : ""}`}
                >
                  <Badge
                    variant={params.urgency === level ? "default" : "outline"}
                    className={`cursor-pointer ${params.urgency === level ? "bg-foreground text-background" : ""}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Requests List */}
          {requests && requests.length > 0 ? (
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
                {params.search || params.category || params.urgency
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
