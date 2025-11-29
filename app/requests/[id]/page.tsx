import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Star } from "lucide-react"
import { RespondToRequestButton } from "@/components/respond-to-request-button"
import { AcceptResponseButton } from "@/components/accept-response-button"

const urgencyColors = {
  low: "bg-secondary text-foreground",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: request } = await supabase.from("requests").select("*, requester:profiles(*)").eq("id", id).single()

  if (!request) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === request.requester_id

  // Get responses for this request
  const { data: responses } = await supabase
    .from("request_responses")
    .select("*, responder:profiles(*)")
    .eq("request_id", id)
    .order("created_at", { ascending: false })

  const userHasResponded = responses?.some((r) => r.responder_id === user?.id)

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/requests" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline">{request.category}</Badge>
                    <Badge className={urgencyColors[request.urgency as keyof typeof urgencyColors]}>
                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                    </Badge>
                    {request.status !== "open" && (
                      <Badge variant={request.status === "fulfilled" ? "default" : "secondary"}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-foreground mb-4">{request.title}</h1>

                  <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-wrap">
                    {request.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {request.budget_max && (
                      <span>
                        Budget: ₹{request.budget_min || 0} - ₹{request.budget_max}
                      </span>
                    )}
                    {request.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {request.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {timeAgo(request.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Responses Section */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Responses ({responses?.length || 0})</h2>

                {responses && responses.length > 0 ? (
                  <div className="space-y-4">
                    {responses.map((response: any) => (
                      <Card key={response.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-secondary text-foreground">
                                {response.responder?.full_name?.charAt(0) || "R"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {response.responder?.full_name || "Student"}
                                  </span>
                                  {response.responder?.rating > 0 && (
                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                      <Star className="h-3 w-3 fill-foreground text-foreground" />
                                      {response.responder.rating.toFixed(1)}
                                    </span>
                                  )}
                                  {response.status === "accepted" && (
                                    <Badge variant="default" className="bg-green-600">
                                      Accepted
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{timeAgo(response.created_at)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{response.message}</p>
                              {response.proposed_price && (
                                <p className="text-sm font-medium text-foreground">
                                  Offered: ₹{response.proposed_price}
                                </p>
                              )}

                              {/* Accept/Decline buttons for request owner */}
                              {isOwner && response.status === "pending" && request.status === "open" && (
                                <div className="flex gap-2 mt-3">
                                  <AcceptResponseButton
                                    responseId={response.id}
                                    requestId={request.id}
                                    responderId={response.responder_id}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No responses yet. Be the first to help!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Requester Info */}
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-3">Posted by</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-secondary text-foreground">
                          {request.requester?.full_name?.charAt(0) || "R"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{request.requester?.full_name || "Student"}</p>
                        {request.requester?.hostel_block && (
                          <p className="text-sm text-muted-foreground">{request.requester.hostel_block}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isOwner && request.status === "open" && !userHasResponded && (
                    <RespondToRequestButton requestId={request.id} requestTitle={request.title} />
                  )}

                  {!isOwner && userHasResponded && (
                    <div className="text-center text-sm text-muted-foreground p-4 bg-secondary/50 rounded-lg">
                      You have already responded to this request
                    </div>
                  )}

                  {isOwner && (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full bg-transparent">
                        Edit Request
                      </Button>
                      {request.status === "open" && (
                        <Button variant="outline" className="w-full text-destructive bg-transparent">
                          Close Request
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
