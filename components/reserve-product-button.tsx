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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Loader2, ShoppingBag } from "lucide-react"

interface ReserveProductButtonProps {
  productId: string
  sellerId: string
  price: number
}

export function ReserveProductButton({ productId, sellerId, price }: ReserveProductButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("upi")
  const [meetupLocation, setMeetupLocation] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleReserve = async () => {
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

    // Create order
    const { error: orderError } = await supabase.from("orders").insert({
      product_id: productId,
      buyer_id: user.id,
      seller_id: sellerId,
      total_price: price,
      payment_method: paymentMethod,
      meetup_location: meetupLocation || null,
      status: "pending",
    })

    if (orderError) {
      setError(orderError.message)
      setIsLoading(false)
      return
    }

    // Update product status
    await supabase
      .from("products")
      .update({
        status: "reserved",
        reserved_by: user.id,
        reserved_at: new Date().toISOString(),
      })
      .eq("id", productId)

    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Reserve Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve this product</DialogTitle>
          <DialogDescription>The seller will be notified and you can arrange the meetup.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          <div className="space-y-2">
            <Label htmlFor="meetup">Preferred Meetup Location (Optional)</Label>
            <Input
              id="meetup"
              placeholder="e.g., Library, Cafeteria"
              value={meetupLocation}
              onChange={(e) => setMeetupLocation(e.target.value)}
            />
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
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
            onClick={handleReserve}
            disabled={isLoading}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Reserving...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
