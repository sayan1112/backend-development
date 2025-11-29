import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Sparkles, MessageSquare, Users, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">SL</span>
              </div>
              <span className="font-semibold text-xl">SkillLink</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/requests" className="text-muted-foreground hover:text-foreground transition-colors">
                Requests
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
              The campus marketplace for students
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Buy and sell products, offer your skills as services, and post urgent requests — all in one unified
              platform built for your campus.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">500+</div>
              <div className="mt-1 text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">1,200+</div>
              <div className="mt-1 text-sm text-muted-foreground">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">300+</div>
              <div className="mt-1 text-sm text-muted-foreground">Services Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">98%</div>
              <div className="mt-1 text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything your campus needs</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three powerful sections to help you buy, sell, earn, and solve problems instantly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Products Card */}
            <Link href="/products" className="group">
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <ShoppingBag className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Products</h3>
                <p className="text-muted-foreground mb-6">
                  Buy and sell textbooks, electronics, calculators, lab equipment, and other campus essentials at
                  student-friendly prices.
                </p>
                <div className="flex items-center text-foreground font-medium group-hover:gap-2 transition-all">
                  Browse Products
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Services Card */}
            <Link href="/services" className="group">
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Services</h3>
                <p className="text-muted-foreground mb-6">
                  Offer your skills or book help with PPT design, coding, tutoring, photography, video editing, and
                  more.
                </p>
                <div className="flex items-center text-foreground font-medium group-hover:gap-2 transition-all">
                  Explore Services
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Requests Card */}
            <Link href="/requests" className="group">
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-foreground/20 transition-all duration-300">
                <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Requests</h3>
                <p className="text-muted-foreground mb-6">
                  Post what you urgently need and let others respond. Need an HDMI cable, notes, or debugging help? Just
                  ask.
                </p>
                <div className="flex items-center text-foreground font-medium group-hover:gap-2 transition-all">
                  View Requests
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Built for campus life</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Features designed specifically for the student experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Peer-to-Peer</h3>
                <p className="text-muted-foreground text-sm">
                  Connect directly with fellow students. No middlemen, no hidden fees.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Campus Verified</h3>
                <p className="text-muted-foreground text-sm">
                  Only verified students from your campus can join and transact.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instant Bookings</h3>
                <p className="text-muted-foreground text-sm">
                  Book services or reserve products instantly with real-time status updates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <svg className="h-5 w-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Flexible Payments</h3>
                <p className="text-muted-foreground text-sm">Pay via UPI or cash — whatever works for both parties.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <svg className="h-5 w-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ratings & Reviews</h3>
                <p className="text-muted-foreground text-sm">
                  Build your reputation with verified reviews from real transactions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center shrink-0">
                <svg className="h-5 w-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">In-App Chat</h3>
                <p className="text-muted-foreground text-sm">
                  Message sellers, providers, and requesters directly within the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to join your campus marketplace?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Sign up today and start buying, selling, or earning with your skills.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-base">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-sm">SL</span>
              </div>
              <span className="font-semibold text-lg">SkillLink</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition-colors">
                Products
              </Link>
              <Link href="/services" className="hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/requests" className="hover:text-foreground transition-colors">
                Requests
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">Built for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
