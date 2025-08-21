import { Navigation } from "@/components/navigation"
import { AIInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { PortfolioSnapshot } from "@/components/dashboard/portfolio-snapshot"
import { StockChart } from "@/components/dashboard/stock-chart"
import { NewsFeed } from "@/components/dashboard/news-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">StockPulse Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered insights and real-time market analysis at your fingertips
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <AIInsightsPanel />
              <StockChart />
              <QuickActions />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <PortfolioSnapshot />
              <NewsFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
