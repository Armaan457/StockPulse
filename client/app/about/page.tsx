import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Mail, Award, Target, Users, Zap } from "lucide-react"

// Mock team data
const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Lead Developer & AI Specialist",
    bio: "Full-stack developer with 8+ years of experience in fintech and AI. Passionate about creating intelligent trading platforms that democratize financial markets.",
    avatar: "/placeholder.svg?height=120&width=120",
    skills: ["React", "Node.js", "Python", "Machine Learning"],
    github: "https://github.com/sarahchen",
    linkedin: "https://linkedin.com/in/sarahchen",
    email: "sarah@stockpulse.com",
  },
  {
    name: "Marcus Rodriguez",
    role: "Financial Data Engineer",
    bio: "Former Wall Street analyst turned developer. Specializes in real-time market data processing and algorithmic trading systems with 10+ years in finance.",
    avatar: "/placeholder.svg?height=120&width=120",
    skills: ["Python", "SQL", "Apache Kafka", "Financial Modeling"],
    github: "https://github.com/marcusrodriguez",
    linkedin: "https://linkedin.com/in/marcusrodriguez",
    email: "marcus@stockpulse.com",
  },
  {
    name: "Emily Foster",
    role: "UX Designer & Product Manager",
    bio: "Design-focused product manager with expertise in creating intuitive financial interfaces. Previously led design teams at major fintech companies.",
    avatar: "/placeholder.svg?height=120&width=120",
    skills: ["UI/UX Design", "Product Strategy", "User Research", "Figma"],
    github: "https://github.com/emilyfoster",
    linkedin: "https://linkedin.com/in/emilyfoster",
    email: "emily@stockpulse.com",
  },
  {
    name: "David Kim",
    role: "Backend Architect & DevOps",
    bio: "Infrastructure specialist focused on building scalable, secure financial platforms. Expert in cloud architecture and real-time data processing systems.",
    avatar: "/placeholder.svg?height=120&width=120",
    skills: ["AWS", "Kubernetes", "Go", "Microservices"],
    github: "https://github.com/davidkim",
    linkedin: "https://linkedin.com/in/davidkim",
    email: "david@stockpulse.com",
  },
]

const companyValues = [
  {
    icon: Target,
    title: "Data-Driven Decisions",
    description:
      "We believe every investment decision should be backed by comprehensive data analysis and AI-powered insights.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a collaborative platform where investors of all levels can learn, share, and grow together.",
  },
  {
    icon: Zap,
    title: "Innovation & Speed",
    description:
      "Leveraging cutting-edge technology to provide real-time market insights and lightning-fast execution.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">About StockPulse</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize financial markets by providing AI-powered insights, comprehensive
              education, and a thriving community for investors of all levels.
            </p>
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm">
              <Award className="h-4 w-4 mr-2" />
              Built at TechCrunch Disrupt 2024 Hackathon
            </Badge>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                "Helping investors make data-driven decisions through AI-powered analysis, comprehensive education, and
                community-driven insights. We believe that everyone deserves access to professional-grade investment
                tools and knowledge."
              </p>
            </CardContent>
          </Card>

          {/* Company Values */}
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companyValues.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-heading text-3xl font-bold">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A diverse group of finance professionals, engineers, and designers united by our passion for
                democratizing investment technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20 border-2 border-primary/20">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-heading text-xl font-semibold">{member.name}</h3>
                          <p className="text-primary font-medium">{member.role}</p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${member.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Hackathon Credit */}
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Hackathon Project
              </CardTitle>
              <CardDescription className="text-base">Born from innovation and built with passion</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                StockPulse was conceived and built during the TechCrunch Disrupt 2024 Hackathon, where our team came
                together with a shared vision of making professional-grade investment tools accessible to everyone. In
                just 48 hours, we created the foundation of what would become a comprehensive financial platform.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="px-3 py-1">
                  TechCrunch Disrupt 2024
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  48-Hour Build
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Finalist Project
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center space-y-6">
            <h2 className="font-heading text-3xl font-bold">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or want to collaborate? We'd love to hear from you.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild>
                <a href="mailto:team@stockpulse.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/stockpulse" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://linkedin.com/company/stockpulse" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
