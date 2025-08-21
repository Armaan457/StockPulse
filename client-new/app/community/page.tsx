import { Navigation } from "@/components/navigation"
import { ForumPosts } from "@/components/community/forum-posts"
import { TrendingSidebar } from "@/components/community/trending-sidebar"
import { MessagingModal } from "@/components/community/messaging-modal"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">Community Forum</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with fellow investors, share insights, and learn from the community
            </p>
          </div>

          {/* Community Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Forum Content */}
            <div className="lg:col-span-3">
              <ForumPosts />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </main>

      <MessagingModal />
    </div>
  )
}
