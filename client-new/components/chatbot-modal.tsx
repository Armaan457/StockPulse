"use client"

import { useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Mock AI responses for demo
const mockResponses = [
  "Based on current market trends, I'd recommend diversifying your portfolio with some tech stocks.",
  "Tesla's volatility suggests implementing risk management strategies. Consider setting stop-losses.",
  "The Federal Reserve's recent decisions typically impact growth stocks more than value stocks.",
  "Apple's earnings report shows strong fundamentals. The stock might see continued growth.",
  "Market sentiment appears bullish on renewable energy stocks this quarter.",
]

export function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI stock analysis assistant. Ask me anything about stocks, market trends, or investment strategies.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Open AI Assistant</span>
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Stock Assistant
          </DialogTitle>
          <DialogDescription>Get instant insights about stocks and market trends</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <ScrollArea className="h-80 w-full rounded-md border p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && <Bot className="h-6 w-6 text-primary mt-1 flex-shrink-0" />}
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.sender === "user" && <User className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex space-x-2">
            <Input
              placeholder="Ask about stocks, trends, or strategies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
