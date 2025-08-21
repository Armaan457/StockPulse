"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, DollarSign, Zap } from "lucide-react"

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const [actionType, setActionType] = useState<"buy" | "sell">("buy")

  const handleAction = () => {
    // Mock confirmation
    alert(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} order placed successfully!`)
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>Execute trades quickly with one-click actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="h-20 flex-col space-y-2" onClick={() => setActionType("buy")}>
                <ShoppingCart className="h-6 w-6" />
                <span>Quick Buy</span>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 bg-transparent"
                onClick={() => setActionType("sell")}
              >
                <DollarSign className="h-6 w-6" />
                <span>Quick Sell</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="capitalize">{actionType} Stock</DialogTitle>
                <DialogDescription>Enter the details for your {actionType} order</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticker">Stock Symbol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                      <SelectItem value="MSFT">MSFT - Microsoft Corp.</SelectItem>
                      <SelectItem value="TSLA">TSLA - Tesla Inc.</SelectItem>
                      <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="Number of shares" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Share</Label>
                  <Input id="price" type="number" placeholder="Market price" />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleAction} className="flex-1">
                    Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
