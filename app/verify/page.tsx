"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function VerifyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    universityEmail: "",
    department: "",
  })

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Basic validation
      if (!formData.studentId || !formData.universityEmail || !formData.department) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      // Validate university email format (should end with .edu or similar)
      if (!formData.universityEmail.includes("@") || 
          (!formData.universityEmail.endsWith(".edu") && 
           !formData.universityEmail.endsWith(".ac.in") &&
           !formData.universityEmail.endsWith(".edu.in"))) {
        setError("Please use a valid university email address")
        setIsLoading(false)
        return
      }

      // Update profile with verification
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_verified: true,
          student_id: formData.studentId,
          university_email: formData.universityEmail,
          department: formData.department,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Verification Successful!
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Your account has been verified. You now have access to all features.
                  </p>
                  <Badge className="bg-green-500 text-white">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    University Verified
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-4">
                    Redirecting to dashboard...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-cyan-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Verify Your Account</h1>
            <p className="text-muted-foreground">
              Get verified to unlock full access and build trust with other students
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>University Verification</CardTitle>
              <CardDescription>
                Verify your student status to access all features and increase your credibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="e.g., 2021CS001"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your official university student ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="universityEmail">University Email</Label>
                  <Input
                    id="universityEmail"
                    type="email"
                    placeholder="you@university.edu"
                    value={formData.universityEmail}
                    onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Use your official university email address (.edu, .ac.in, or .edu.in)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department/Major</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your department or major
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-500" />
                    Benefits of Verification
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Verified badge on your profile</li>
                    <li>Increased trust from other students</li>
                    <li>Access to premium features</li>
                    <li>Higher visibility in search results</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Verify Account
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By verifying, you confirm that the information provided is accurate and belongs to you.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
