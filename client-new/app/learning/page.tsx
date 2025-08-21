import { Navigation } from "@/components/navigation"
import { VideoSection } from "@/components/learning/video-section"
import { NewsReports } from "@/components/learning/news-reports"
import { InteractiveQuiz } from "@/components/learning/interactive-quiz"
import { LearningPath } from "@/components/learning/learning-path"

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">Learning Hub</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Master the markets with our comprehensive educational resources, interactive content, and personalized
              learning paths
            </p>
          </div>

          {/* Learning Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <VideoSection />
              <InteractiveQuiz />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <LearningPath />
              <NewsReports />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
