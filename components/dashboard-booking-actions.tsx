"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"

interface DashboardBookingActionsProps {
  bookingId: string
}

export function DashboardBookingActions({ bookingId }: DashboardBookingActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"accept" | "decline" | null>(null)

  const handleAction = async (action: "accept" | "decline") => {
    setIsLoading(action)
    const supabase = createClient()

    await supabase
      .from("bookings")
      .update({ status: action === "accept" ? "accepted" : "declined" })
      .eq("id", bookingId)

    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("accept")}
        disabled={isLoading !== null}
        className="bg-green-600 hover:bg-green-700 h-8"
      >
        {isLoading === "accept" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("decline")}
        disabled={isLoading !== null}
        className="h-8"
      >
        {isLoading === "decline" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </Button>
    </div>
  )
}
