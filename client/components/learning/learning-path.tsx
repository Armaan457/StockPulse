"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Star, ArrowRight } from "lucide-react"

// Mock learning path data
const learningPath = {
  title: "Beginner to Intermediate Investor",
  description: "AI-recommended path based on your current knowledge level",
  progress: 65,
  modules: [
    {
      id: 1,
      title: "Stock Market Fundamentals",
      description: "Learn the basics of how stock markets work",
      status: "completed",
      duration: "2 hours",
      lessons: 8,
    },
    {
      id: 2,
      title: "Reading Financial Statements",
      description: "Understand balance sheets, income statements, and cash flow",
      status: "completed",
      duration: "3 hours",
      lessons: 12,
    },
    {
      id: 3,
      title: "Valuation Methods",
      description: "Learn different approaches to value stocks",
      status: "current",
      duration: "2.5 hours",
      lessons: 10,
    },
    {
      id: 4,
      title: "Portfolio Construction",
      description: "Build and manage a diversified investment portfolio",
      status: "locked",
      duration: "3 hours",
      lessons: 15,
    },
    {
      id: 5,
      title: "Risk Management",
      description: "Understand and manage investment risks",
      status: "locked",
      duration: "2 hours",
      lessons: 9,
    },
  ],
}

const aiRecommendations = [
  "Focus on options trading basics next",
  "Consider advanced technical analysis",
  "Explore sector-specific investing strategies",
]

export function LearningPath() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Personalized Learning Path
        </CardTitle>
        <CardDescription>AI-curated curriculum tailored to your progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{learningPath.title}</h3>
            <Badge variant="outline">{learningPath.progress}% Complete</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{learningPath.description}</p>
          <Progress value={learningPath.progress} className="h-2" />
        </div>

        {/* Learning Modules */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Learning Modules</h4>
          {learningPath.modules.map((module) => (
            <div
              key={module.id}
              className={`border rounded-lg p-3 space-y-2 ${
                module.status === "current" ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {module.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : module.status === "current" ? (
                    <Circle className="h-4 w-4 text-primary fill-primary/20" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="font-medium text-sm">{module.title}</h5>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{module.duration}</span>
                    <span>{module.lessons} lessons</span>
                  </div>
                </div>
                {module.status === "current" && (
                  <Button size="sm" variant="outline" className="h-7 px-2 bg-transparent">
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">AI Recommendations</h4>
          <div className="space-y-2">
            {aiRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                <span className="text-muted-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full">Continue Learning</Button>
      </CardContent>
    </Card>
  )
}
