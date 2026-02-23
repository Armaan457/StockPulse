"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OptionsModalProps {
  ticker: string | null
  isOpen: boolean
  onClose: () => void
}

// Mock options chain data
const generateOptionsData = (ticker: string) => ({
  calls: [
    { strike: 160, expiry: "2024-01-19", bid: 12.5, ask: 12.8, volume: 1250, openInterest: 5420 },
    { strike: 165, expiry: "2024-01-19", bid: 8.2, ask: 8.5, volume: 2100, openInterest: 8930 },
    { strike: 170, expiry: "2024-01-19", bid: 4.8, ask: 5.1, volume: 3200, openInterest: 12450 },
    { strike: 175, expiry: "2024-01-19", bid: 2.3, ask: 2.6, volume: 1800, openInterest: 6780 },
    { strike: 180, expiry: "2024-01-19", bid: 0.95, ask: 1.2, volume: 950, openInterest: 3210 },
  ],
  puts: [
    { strike: 160, expiry: "2024-01-19", bid: 1.2, ask: 1.45, volume: 800, openInterest: 2340 },
    { strike: 165, expiry: "2024-01-19", bid: 2.8, ask: 3.1, volume: 1500, openInterest: 4560 },
    { strike: 170, expiry: "2024-01-19", bid: 5.4, ask: 5.7, volume: 2200, openInterest: 7890 },
    { strike: 175, expiry: "2024-01-19", bid: 9.2, ask: 9.5, volume: 1600, openInterest: 5670 },
    { strike: 180, expiry: "2024-01-19", bid: 14.8, ask: 15.2, volume: 900, openInterest: 3450 },
  ],
})

export function OptionsModal({ ticker, isOpen, onClose }: OptionsModalProps) {
  if (!ticker) return null

  const optionsData = generateOptionsData(ticker)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Options Chain - {ticker}</DialogTitle>
          <DialogDescription>Current options contracts with strikes, expiries, and open interest</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calls">Call Options</TabsTrigger>
            <TabsTrigger value="puts">Put Options</TabsTrigger>
          </TabsList>

          <TabsContent value="calls" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strike</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    <TableHead className="text-right">Ask</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Open Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionsData.calls.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">${option.strike}</TableCell>
                      <TableCell>{option.expiry}</TableCell>
                      <TableCell className="text-right">${option.bid.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${option.ask.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{option.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-success border-success">
                          {option.openInterest.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="puts" className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strike</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    <TableHead className="text-right">Ask</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Open Interest</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionsData.puts.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">${option.strike}</TableCell>
                      <TableCell>{option.expiry}</TableCell>
                      <TableCell className="text-right">${option.bid.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${option.ask.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{option.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-loss border-loss">
                          {option.openInterest.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
