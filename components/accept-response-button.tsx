"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"

interface AcceptResponseButtonProps {
  responseId: string
  requestId: string
  responderId: string
}

export function AcceptResponseButton({ responseId, requestId, responderId }: AcceptResponseButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = async () => {
    setIsLoading(true)

    const supabase = createClient()

    // Update response status
    await supabase.from("request_responses").update({ status: "accepted" }).eq("id", responseId)

    // Update request status and fulfilled_by
    await supabase
      .from("requests")
      .update({
        status: "in_progress",
        fulfilled_by: responderId,
      })
      .eq("id", requestId)

    // Decline other responses
    await supabase
      .from("request_responses")
      .update({ status: "declined" })
      .eq("request_id", requestId)
      .neq("id", responseId)

    router.refresh()
  }

  return (
    <Button size="sm" onClick={handleAccept} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Check className="h-4 w-4 mr-1" />
          Accept
        </>
      )}
    </Button>
  )
}
