"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Sparkles, MessageSquare, X, Loader2 } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  type: "product" | "service" | "request"
  category: string
  price?: number
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true)
      const supabase = createClient()

      const [productsRes, servicesRes, requestsRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, title, category, price")
          .ilike("title", `%${query}%`)
          .eq("status", "available")
          .limit(3),
        supabase
          .from("services")
          .select("id, title, category, price")
          .ilike("title", `%${query}%`)
          .eq("is_available", true)
          .limit(3),
        supabase
          .from("requests")
          .select("id, title, category")
          .ilike("title", `%${query}%`)
          .eq("status", "open")
          .limit(3),
      ])

      const combined: SearchResult[] = [
        ...(productsRes.data || []).map((p) => ({ ...p, type: "product" as const })),
        ...(servicesRes.data || []).map((s) => ({ ...s, type: "service" as const })),
        ...(requestsRes.data || []).map((r) => ({ ...r, type: "request" as const })),
      ]

      setResults(combined)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    const path =
      result.type === "product"
        ? `/products/${result.id}`
        : result.type === "service"
          ? `/services/${result.id}`
          : `/requests/${result.id}`

    router.push(path)
    setOpen(false)
    setQuery("")
  }

  const typeIcons = {
    product: ShoppingBag,
    service: Sparkles,
    request: MessageSquare,
  }

  const typeLabels = {
    product: "Product",
    service: "Service",
    request: "Request",
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => {
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-2 w-screen sm:w-[400px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center gap-2 p-3 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, services, requests..."
              className="border-0 p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => {
                  const Icon = typeIcons[result.type]
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.category}
                          {result.price && ` • ₹${result.price}`}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {typeLabels[result.type]}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">Start typing to search across all listings</p>
              </div>
            )}
          </div>

          {!query && (
            <div className="p-3 border-t border-border bg-secondary/30">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    router.push("/products")
                    setOpen(false)
                  }}
                  className="flex-1 text-xs text-muted-foreground hover:text-foreground p-2 rounded hover:bg-secondary transition-colors"
                >
                  Browse Products
                </button>
                <button
                  onClick={() => {
                    router.push("/services")
                    setOpen(false)
                  }}
                  className="flex-1 text-xs text-muted-foreground hover:text-foreground p-2 rounded hover:bg-secondary transition-colors"
                >
                  Browse Services
                </button>
                <button
                  onClick={() => {
                    router.push("/requests")
                    setOpen(false)
                  }}
                  className="flex-1 text-xs text-muted-foreground hover:text-foreground p-2 rounded hover:bg-secondary transition-colors"
                >
                  Browse Requests
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
