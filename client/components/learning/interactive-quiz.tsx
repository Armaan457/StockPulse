"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Brain, RotateCcw } from "lucide-react"

// Mock quiz data
const quizQuestions = [
  {
    id: 1,
    question: "What does P/E ratio stand for in stock analysis?",
    options: [
      "Price to Equity ratio",
      "Price to Earnings ratio",
      "Profit to Expense ratio",
      "Portfolio to Equity ratio",
    ],
    correctAnswer: 1,
    explanation:
      "P/E ratio stands for Price-to-Earnings ratio, which compares a company's stock price to its earnings per share.",
  },
  {
    id: 2,
    question: "Which of the following is considered a defensive stock sector?",
    options: ["Technology", "Utilities", "Biotechnology", "Cryptocurrency"],
    correctAnswer: 1,
    explanation:
      "Utilities are considered defensive because people need electricity, water, and gas regardless of economic conditions.",
  },
  {
    id: 3,
    question: "What is diversification in investing?",
    options: [
      "Buying only one type of stock",
      "Spreading investments across different assets to reduce risk",
      "Investing only in foreign markets",
      "Trading frequently to maximize profits",
    ],
    correctAnswer: 1,
    explanation:
      "Diversification involves spreading investments across different assets, sectors, or markets to reduce overall portfolio risk.",
  },
  {
    id: 4,
    question: "What does 'bull market' mean?",
    options: [
      "A market where prices are falling",
      "A market where prices are rising",
      "A market with high volatility",
      "A market that's closed for trading",
    ],
    correctAnswer: 1,
    explanation:
      "A bull market refers to a period when stock prices are rising or are expected to rise, typically by 20% or more.",
  },
  {
    id: 5,
    question: "What is a dividend?",
    options: [
      "A fee paid to brokers",
      "A payment made by companies to shareholders",
      "The difference between buy and sell prices",
      "A type of investment risk",
    ],
    correctAnswer: 1,
    explanation:
      "A dividend is a payment made by companies to their shareholders, usually from profits, as a reward for investing.",
  },
]

export function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newUserAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newUserAnswers)

    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
    setUserAnswers([])
  }

  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / quizQuestions.length) * 100

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Quiz Complete!
          </CardTitle>
          <CardDescription>Here are your results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{percentage}%</div>
            <p className="text-lg">
              You scored {score} out of {quizQuestions.length} questions correctly
            </p>
            <Badge className={percentage >= 80 ? "bg-success" : percentage >= 60 ? "bg-warning" : "bg-loss"}>
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Review Your Answers:</h4>
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="flex items-center gap-2 text-sm">
                {userAnswers[index] === question.correctAnswer ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-loss" />
                )}
                <span className="truncate">Question {index + 1}</span>
              </div>
            ))}
          </div>

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Interactive Knowledge Quiz
        </CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold leading-tight">{question.question}</h3>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto p-4 ${
                  showExplanation
                    ? index === question.correctAnswer
                      ? "bg-success text-success-foreground"
                      : selectedAnswer === index && index !== question.correctAnswer
                        ? "bg-loss text-loss-foreground"
                        : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showExplanation && index === question.correctAnswer && <CheckCircle className="h-4 w-4 ml-auto" />}
                {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                  <XCircle className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}
            </div>
            {!showExplanation ? (
              <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
