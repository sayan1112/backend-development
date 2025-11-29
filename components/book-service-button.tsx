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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Loader2, Calendar } from "lucide-react"

interface BookServiceButtonProps {
  serviceId: string
  providerId: string
  price: number
  serviceTitle: string
}

export function BookServiceButton({ serviceId, providerId, price, serviceTitle }: BookServiceButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi")
  const [scheduledDate, setScheduledDate] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleBook = async () => {
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

    const { error: bookingError } = await supabase.from("bookings").insert({
      service_id: serviceId,
      buyer_id: user.id,
      provider_id: providerId,
      message: message || null,
      scheduled_at: scheduledDate ? new Date(scheduledDate).toISOString() : null,
      total_price: price,
      payment_method: paymentMethod,
      status: "pending",
    })

    if (bookingError) {
      setError(bookingError.message)
      setIsLoading(false)
      return
    }

    setOpen(false)
    router.push("/dashboard?tab=bookings")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
          <Calendar className="h-4 w-4 mr-2" />
          Book Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
          <DialogDescription>Request to book: {serviceTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message to Provider (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Describe what you need, any specific requirements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled">Preferred Date/Time (Optional)</Label>
            <Input
              id="scheduled"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "upi" | "cash")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="font-normal">
                  UPI
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="font-normal">
                  Cash
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Price</span>
              <span className="font-semibold">₹{price.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBook}
            disabled={isLoading}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Send Booking Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
