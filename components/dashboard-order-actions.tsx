"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"

interface DashboardOrderActionsProps {
  orderId: string
  productId: string
}

export function DashboardOrderActions({ orderId, productId }: DashboardOrderActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<"confirm" | "cancel" | null>(null)

  const handleAction = async (action: "confirm" | "cancel") => {
    setIsLoading(action)
    const supabase = createClient()

    // Update order status
    await supabase
      .from("orders")
      .update({ status: action === "confirm" ? "confirmed" : "cancelled" })
      .eq("id", orderId)

    // Update product status based on action
    if (action === "cancel") {
      await supabase
        .from("products")
        .update({
          status: "available",
          reserved_by: null,
          reserved_at: null,
        })
        .eq("id", productId)
    }

    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("confirm")}
        disabled={isLoading !== null}
        className="bg-green-600 hover:bg-green-700 h-8"
      >
        {isLoading === "confirm" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleAction("cancel")}
        disabled={isLoading !== null}
        className="h-8"
      >
        {isLoading === "cancel" ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </Button>
    </div>
  )
}
