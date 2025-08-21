"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Search } from "lucide-react"

// Mock conversations and messages
const conversations = [
  {
    id: 1,
    user: {
      username: "TechAnalyst",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
    },
    lastMessage: "Thanks for the NVDA analysis!",
    timestamp: "2 min ago",
    unread: 2,
  },
  {
    id: 2,
    user: {
      username: "ValueSeeker",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "offline",
    },
    lastMessage: "What do you think about dividend stocks?",
    timestamp: "1 hour ago",
    unread: 0,
  },
  {
    id: 3,
    user: {
      username: "OptionsGuru",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "online",
    },
    lastMessage: "The iron condor strategy worked perfectly",
    timestamp: "3 hours ago",
    unread: 1,
  },
]

const mockMessages = [
  {
    id: 1,
    content: "Hey! I saw your post about Tesla earnings. Great analysis!",
    sender: "TechAnalyst",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    content: "Thanks! I think they're really hitting their stride with the energy business.",
    sender: "CurrentUser",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    content: "Absolutely. The Supercharger network expansion is also a huge moat.",
    sender: "TechAnalyst",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: 4,
    content: "Thanks for the NVDA analysis!",
    sender: "TechAnalyst",
    timestamp: "10:45 AM",
    isOwn: false,
  },
]

export function MessagingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage = {
      id: messages.length + 1,
      content: messageInput,
      sender: "CurrentUser",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([...messages, newMessage])
    setMessageInput("")

    // Simulate response
    setTimeout(() => {
      const responses = [
        "That's a great point!",
        "I hadn't considered that angle.",
        "Thanks for sharing your insights.",
        "Interesting perspective on the market.",
        "I'll have to look into that more.",
      ]

      const response = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "TechAnalyst",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50" size="icon">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[600px] p-0">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r flex flex-col">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Messages</DialogTitle>
              <DialogDescription>Direct conversations with community members</DialogDescription>
            </DialogHeader>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {conversation.user.status === "online" && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conversation.user.username}</p>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          conversations.find((c) => c.id === selectedConversation)?.user.avatar || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {conversations
                          .find((c) => c.id === selectedConversation)
                          ?.user.username.slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {conversations.find((c) => c.id === selectedConversation)?.user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {conversations.find((c) => c.id === selectedConversation)?.user.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
