import { Navigation } from "@/components/navigation"
import { PortfolioTable } from "@/components/portfolio/portfolio-table"
import { PortfolioCharts } from "@/components/portfolio/portfolio-charts"
import { BacktestingTool } from "@/components/portfolio/backtesting-tool"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">Portfolio Management</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Detailed analysis of your holdings with advanced charting and backtesting tools
            </p>
          </div>

          {/* Portfolio Content */}
          <div className="space-y-8">
            <PortfolioTable />
            <PortfolioCharts />
            <BacktestingTool />
          </div>
        </div>
      </main>
    </div>
  )
}
