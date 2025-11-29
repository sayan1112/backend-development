import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar } from "lucide-react"
import { ProfileEditForm } from "@/components/profile-edit-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const joinDate = new Date(profile?.created_at || user.created_at || Date.now())
  const formattedDate = joinDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-foreground text-background text-2xl">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{profile?.full_name || "Student"}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {profile?.is_verified_student && <Badge variant="secondary">Verified Student</Badge>}
                    {profile?.rating > 0 && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-foreground text-foreground" />
                        {profile.rating.toFixed(1)} ({profile.total_reviews} reviews)
                      </span>
                    )}
                    {profile?.hostel_block && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.hostel_block}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileEditForm
                profile={{
                  full_name: profile?.full_name || "",
                  phone: profile?.phone || "",
                  bio: profile?.bio || "",
                  hostel_block: profile?.hostel_block || "",
                  college_id: profile?.college_id || "",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
