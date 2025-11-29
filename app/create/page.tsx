import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag, Sparkles, MessageSquare, ArrowRight } from "lucide-react"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create a Listing</h1>
            <p className="text-muted-foreground">What would you like to share with your campus?</p>
          </div>

          <div className="grid gap-4">
            <Link href="/products/create">
              <Card className="hover:shadow-lg hover:border-foreground/20 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">Sell a Product</CardTitle>
                      <CardDescription>
                        List textbooks, electronics, lab equipment, or other campus essentials
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services/create">
              <Card className="hover:shadow-lg hover:border-foreground/20 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">Offer a Service</CardTitle>
                      <CardDescription>
                        Share your skills — tutoring, design, coding, photography, and more
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/requests/create">
              <Card className="hover:shadow-lg hover:border-foreground/20 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">Post a Request</CardTitle>
                      <CardDescription>Need something urgently? Post what you need and let others help</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
