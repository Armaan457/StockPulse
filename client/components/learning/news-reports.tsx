"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, FileText, Calendar } from "lucide-react"

// Mock financial reports and news data
const reports = [
  {
    id: 1,
    title: "Q4 2024 Market Outlook: Tech Sector Analysis",
    summary: "Comprehensive analysis of technology sector performance and future projections for Q4 2024.",
    fullContent: `
      The technology sector continues to show resilience despite market volatility. Key findings include:
      
      • Cloud computing revenue up 23% YoY across major providers
      • AI and machine learning investments driving innovation
      • Semiconductor demand recovering from 2023 lows
      • Cybersecurity spending increasing due to rising threats
      
      Investment Recommendations:
      - Overweight on cloud infrastructure companies
      - Selective exposure to AI-focused startups
      - Maintain positions in established tech giants
      
      Risk Factors:
      - Regulatory scrutiny on big tech companies
      - Supply chain disruptions in Asia
      - Interest rate sensitivity for growth stocks
    `,
    date: "2024-01-15",
    category: "Market Analysis",
    author: "Sarah Chen, CFA",
  },
  {
    id: 2,
    title: "Federal Reserve Policy Impact on Financial Markets",
    summary: "Analysis of recent Fed decisions and their implications for various asset classes.",
    fullContent: `
      The Federal Reserve's latest policy decisions have significant implications for investors:
      
      Key Policy Changes:
      • Interest rates maintained at current levels
      • Quantitative tightening continues at reduced pace
      • Forward guidance suggests potential cuts in H2 2024
      
      Market Implications:
      - Bond yields expected to stabilize
      - Dollar strength may moderate
      - Emerging markets could benefit from policy shift
      
      Sector Impact Analysis:
      - Financials: Mixed outlook due to net interest margin pressure
      - REITs: Potential beneficiary of lower rate environment
      - Utilities: Defensive characteristics remain attractive
    `,
    date: "2024-01-12",
    category: "Economic Policy",
    author: "Michael Rodriguez, Senior Economist",
  },
  {
    id: 3,
    title: "ESG Investing Trends and Performance Review",
    summary: "Evaluation of Environmental, Social, and Governance investing strategies and their market performance.",
    fullContent: `
      ESG investing continues to evolve with changing market dynamics:
      
      Performance Metrics:
      • ESG funds outperformed benchmarks by 1.2% in 2023
      • Sustainable energy investments up 34% YoY
      • Corporate governance scores improving across sectors
      
      Emerging Trends:
      - Climate transition financing gaining momentum
      - Social impact bonds showing strong returns
      - Governance-focused strategies outperforming
      
      Investment Opportunities:
      - Clean technology infrastructure projects
      - Companies with strong diversity metrics
      - Firms leading in carbon reduction initiatives
      
      Challenges:
      - Greenwashing concerns require due diligence
      - Regulatory frameworks still developing
      - Performance measurement standardization needed
    `,
    date: "2024-01-10",
    category: "ESG Investing",
    author: "Dr. Amanda Foster, Sustainability Analyst",
  },
]

export function NewsReports() {
  const [expandedReport, setExpandedReport] = useState<number | null>(null)

  const toggleReport = (reportId: number) => {
    setExpandedReport(expandedReport === reportId ? null : reportId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Research Reports
        </CardTitle>
        <CardDescription>In-depth market analysis and financial research</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight">{report.title}</h3>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {report.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">{report.summary}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <span>{report.author}</span>
                  </div>
                </div>

                {expandedReport === report.id && (
                  <div className="pt-3 border-t">
                    <div className="text-xs text-foreground whitespace-pre-line leading-relaxed">
                      {report.fullContent}
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReport(report.id)}
                  className="w-full justify-center gap-1 h-8"
                >
                  {expandedReport === report.id ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Read Full Report
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
