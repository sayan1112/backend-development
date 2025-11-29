"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Hand } from "lucide-react"

interface RespondToRequestButtonProps {
  requestId: string
  requestTitle: string
}

export function RespondToRequestButton({ requestId, requestTitle }: RespondToRequestButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [proposedPrice, setProposedPrice] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleRespond = async () => {
    if (!message.trim()) {
      setError("Please enter a message")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { error: responseError } = await supabase.from("request_responses").insert({
      request_id: requestId,
      responder_id: user.id,
      message: message,
      proposed_price: proposedPrice ? Number.parseFloat(proposedPrice) : null,
      status: "pending",
    })

    if (responseError) {
      setError(responseError.message)
      setIsLoading(false)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
          <Hand className="h-4 w-4 mr-2" />I Can Help
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Respond to Request</DialogTitle>
          <DialogDescription>Offer to help with: {requestTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Explain how you can help, when you're available, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Your Price (Optional)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              placeholder="₹ Amount"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank if you want to discuss the price later</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRespond}
            disabled={isLoading}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Response"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
