"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { UserProfile } from "@/components/community/user-profile"
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, ChevronDown, ChevronUp } from "lucide-react"

// Mock forum data
const forumPosts = [
  {
    id: 1,
    title: "What do you think about Tesla's Q4 earnings?",
    content:
      "Tesla just released their Q4 earnings and they beat expectations. The stock is up 8% in after-hours trading. What's everyone's take on this? Are we looking at a sustained rally or just a temporary bump?",
    author: {
      username: "TechInvestor42",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-03-15",
      posts: 156,
      badges: ["Top Contributor", "Tech Expert"],
    },
    timestamp: "2 hours ago",
    upvotes: 24,
    downvotes: 3,
    replies: [
      {
        id: 101,
        content:
          "I think this is just the beginning. Their energy business is finally showing real growth and the Cybertruck deliveries are ramping up nicely.",
        author: {
          username: "ElonFan2024",
          avatar: "/placeholder.svg?height=32&width=32",
          joinDate: "2023-08-20",
          posts: 89,
          badges: ["EV Enthusiast"],
        },
        timestamp: "1 hour ago",
        upvotes: 12,
        downvotes: 1,
      },
      {
        id: 102,
        content:
          "Be careful with the hype. Tesla's valuation is still pretty stretched compared to traditional automakers. I'd wait for a pullback before adding more.",
        author: {
          username: "ValueHunter",
          avatar: "/placeholder.svg?height=32&width=32",
          joinDate: "2022-11-10",
          posts: 234,
          badges: ["Value Investor", "Veteran"],
        },
        timestamp: "45 minutes ago",
        upvotes: 8,
        downvotes: 5,
      },
    ],
    tags: ["TSLA", "Earnings", "EV"],
    category: "Stock Discussion",
  },
  {
    id: 2,
    title: "Best options strategy for volatile markets?",
    content:
      "With all this market volatility, I'm looking to hedge my portfolio with options. What strategies are you all using? I've been considering iron condors but wondering if there are better approaches.",
    author: {
      username: "OptionsGuru",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2022-05-22",
      posts: 312,
      badges: ["Options Expert", "Risk Manager"],
    },
    timestamp: "4 hours ago",
    upvotes: 18,
    downvotes: 2,
    replies: [
      {
        id: 201,
        content:
          "I've been using protective puts on my core holdings. More expensive than iron condors but gives me peace of mind during these uncertain times.",
        author: {
          username: "SafeTrader",
          avatar: "/placeholder.svg?height=32&width=32",
          joinDate: "2023-01-15",
          posts: 67,
          badges: ["Conservative"],
        },
        timestamp: "3 hours ago",
        upvotes: 6,
        downvotes: 0,
      },
    ],
    tags: ["Options", "Volatility", "Hedging"],
    category: "Options Trading",
  },
  {
    id: 3,
    title: "AI stocks are on fire! Which ones are you watching?",
    content:
      "The AI revolution is clearly here and these stocks are reflecting it. NVDA, AMD, and even some smaller players are making huge moves. What's on your AI watchlist?",
    author: {
      username: "AIBullish",
      avatar: "/placeholder.svg?height=40&width=40",
      joinDate: "2023-09-08",
      posts: 78,
      badges: ["AI Enthusiast"],
    },
    timestamp: "6 hours ago",
    upvotes: 31,
    downvotes: 4,
    replies: [],
    tags: ["AI", "NVDA", "AMD", "Technology"],
    category: "Sector Discussion",
  },
]

export function ForumPosts() {
  const [posts, setPosts] = useState(forumPosts)
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleVote = (postId: number, voteType: "up" | "down", isReply = false, replyId?: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (isReply && replyId) {
            return {
              ...post,
              replies: post.replies.map((reply) => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    upvotes: voteType === "up" ? reply.upvotes + 1 : reply.upvotes,
                    downvotes: voteType === "down" ? reply.downvotes + 1 : reply.downvotes,
                  }
                }
                return reply
              }),
            }
          } else {
            return {
              ...post,
              upvotes: voteType === "up" ? post.upvotes + 1 : post.upvotes,
              downvotes: voteType === "down" ? post.downvotes + 1 : post.downvotes,
            }
          }
        }
        return post
      }),
    )
  }

  const toggleReplies = (postId: number) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const handleReply = (postId: number) => {
    if (!replyContent.trim()) return

    const newReply = {
      id: Date.now(),
      content: replyContent,
      author: {
        username: "CurrentUser",
        avatar: "/placeholder.svg?height=32&width=32",
        joinDate: "2024-01-01",
        posts: 1,
        badges: ["New Member"],
      },
      timestamp: "just now",
      upvotes: 0,
      downvotes: 0,
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply],
          }
        }
        return post
      }),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  return (
    <>
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar
                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => setSelectedUser(post.author)}
                  >
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedUser(post.author)}
                      >
                        {post.author.username}
                      </span>
                      {post.author.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                  </div>
                </div>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{post.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleVote(post.id, "up")} className="h-8 px-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="ml-1">{post.upvotes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleVote(post.id, "down")} className="h-8 px-2">
                    <ThumbsDown className="h-4 w-4" />
                    <span className="ml-1">{post.downvotes}</span>
                  </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={() => toggleReplies(post.id)} className="h-8 px-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="ml-1">{post.replies.length} replies</span>
                  {expandedPosts.has(post.id) ? (
                    <ChevronUp className="h-3 w-3 ml-1" />
                  ) : (
                    <ChevronDown className="h-3 w-3 ml-1" />
                  )}
                </Button>

                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(post.id)} className="h-8 px-2">
                  <Reply className="h-4 w-4" />
                  <span className="ml-1">Reply</span>
                </Button>
              </div>

              {/* Reply Form */}
              {replyingTo === post.id && (
                <div className="space-y-3 pt-4 border-t">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(post.id)}>
                      Post Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {expandedPosts.has(post.id) && post.replies.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-muted">
                      <Avatar
                        className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => setSelectedUser(reply.author)}
                      >
                        <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{reply.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setSelectedUser(reply.author)}
                          >
                            {reply.author.username}
                          </span>
                          {reply.author.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post.id, "up", true, reply.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span className="ml-1">{reply.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post.id, "down", true, reply.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <ThumbsDown className="h-3 w-3" />
                            <span className="ml-1">{reply.downvotes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <UserProfile user={selectedUser} isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}
