"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, Loader2 } from "lucide-react"
import { PRODUCT_CATEGORIES } from "@/lib/types"
import type { Product } from "@/lib/types"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const category = searchParams.get("category")
  const search = searchParams.get("search")

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let query = supabase
          .from("products")
          .select("*, seller:profiles(*)")
          .eq("status", "available")
          .order("created_at", { ascending: false })

        if (category) {
          query = query.eq("category", category)
        }

        if (search) {
          query = query.ilike("title", `%${search}%`)
        }

        const { data } = await query
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
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
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">Buy and sell campus essentials</p>
            </div>
            <Link href="/products/create">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-4 w-4 mr-2" />
                Sell Product
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
                  placeholder="Search products..." 
                  defaultValue={search || ""} 
                  className="pl-10"
                  onChange={(e) => {
                    // Simple debounce could be added here, but for now we'll rely on form submission or just URL updates if we wired it up
                    // For a true client-side search with URL params, we'd need to update the router
                  }}
                />
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link href="/products">
                <Badge
                  variant={!category ? "default" : "outline"}
                  className={`cursor-pointer ${!category ? "bg-foreground text-background" : ""}`}
                >
                  All
                </Badge>
              </Link>
              {PRODUCT_CATEGORIES.map((cat) => (
                <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`}>
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

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {search || category
                  ? "Try adjusting your search or filters"
                  : "Be the first to list a product!"}
              </p>
              <Link href="/products/create">
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="h-4 w-4 mr-2" />
                  List a Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
