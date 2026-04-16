"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SurrenderButton } from "@/components/surrender-button"

// Sample trivia questions - in production, fetch from API
const TRIVIA_QUESTIONS = [
  {
    question: "Which country has won the most FIFA World Cup titles?",
    options: ["Germany", "Brazil", "Argentina", "Italy"],
    correctAnswer: 1,
    category: "World Cup"
  },
  {
    question: "Who holds the record for most goals in a single calendar year?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Gerd Muller", "Robert Lewandowski"],
    correctAnswer: 1,
    category: "Records"
  },
  {
    question: "Which club has won the most UEFA Champions League titles?",
    options: ["Barcelona", "AC Milan", "Real Madrid", "Bayern Munich"],
    correctAnswer: 2,
    category: "Champions League"
  },
  {
    question: "In which year did England win their only World Cup?",
    options: ["1962", "1966", "1970", "1974"],
    correctAnswer: 1,
    category: "World Cup"
  },
  {
    question: "Who is the all-time top scorer in Premier League history?",
    options: ["Wayne Rooney", "Sergio Aguero", "Alan Shearer", "Thierry Henry"],
    correctAnswer: 2,
    category: "Premier League"
  },
  {
    question: "Which goalkeeper has the most clean sheets in World Cup history?",
    options: ["Gianluigi Buffon", "Manuel Neuer", "Peter Shilton", "Iker Casillas"],
    correctAnswer: 0,
    category: "World Cup"
  },
  {
    question: "Which player has won the most Ballon d'Or awards?",
    options: ["Cristiano Ronaldo", "Lionel Messi", "Johan Cruyff", "Michel Platini"],
    correctAnswer: 1,
    category: "Awards"
  },
  {
    question: "What is the capacity of Camp Nou stadium?",
    options: ["85,000", "90,000", "99,000", "105,000"],
    correctAnswer: 2,
    category: "Stadiums"
  }
]

interface GameState {
  currentQuestion: number
  score: number
  answers: (number | null)[]
  isComplete: boolean
}

export default function TriviaPage() {
  const [questions, setQuestions] = useState(TRIVIA_QUESTIONS)
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    isComplete: false
  })
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    // Shuffle questions for variety
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, 5)) // Pick 5 random questions
  }, [])

  const currentQ = questions[gameState.currentQuestion]

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQ.correctAnswer
    setShowResult(true)

    setTimeout(() => {
      const newAnswers = [...gameState.answers, selectedAnswer]
      const newScore = isCorrect ? gameState.score + 1 : gameState.score

      if (gameState.currentQuestion + 1 >= questions.length) {
        setGameState({
          ...gameState,
          score: newScore,
          answers: newAnswers,
          isComplete: true
        })
      } else {
        setGameState({
          ...gameState,
          currentQuestion: gameState.currentQuestion + 1,
          score: newScore,
          answers: newAnswers
        })
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }, 1500)
  }

  const resetGame = () => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, 5))
    setGameState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      isComplete: false
    })
    setSelectedAnswer(null)
    setShowResult(false)
    setIsStarted(false)
  }

  const getScoreMessage = () => {
    const percentage = (gameState.score / questions.length) * 100
    if (percentage === 100) return "Perfect score! You're a football genius!"
    if (percentage >= 80) return "Excellent! You really know your football!"
    if (percentage >= 60) return "Good job! Keep learning!"
    if (percentage >= 40) return "Not bad! Room for improvement."
    return "Keep practicing! You'll get better!"
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/games" className="text-white hover:text-primary text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Football Trivia</h1>
        <p className="text-white font-medium">
          Prove your status as a football historian with our daily knowledge test.
        </p>
      </div>

      {!isStarted ? (
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] relative flex items-center justify-center p-8 bg-muted/5">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-game-3 to-transparent" />
                <img
                  src="/images/games/trivia.png"
                  alt="Football Trivia"
                  className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-center md:text-left">
                <h2 className="text-2xl font-bold text-card-foreground mb-4">The Ultimate Knowledge Test</h2>

                <div className="flex flex-col gap-6">
                  <p className="text-black/80 dark:text-muted-foreground leading-relaxed">
                    Face a curated set of <strong>5 challenging questions</strong> covering everything from World Cup records and Champions League legends to iconic stadiums and Premier League history.
                  </p>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center bg-muted/5 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                    <div className="flex-1 text-xs text-muted-foreground font-medium italic">
                      "Knowledge is the only tool that grows when you use it. Face today's challenge and prove your expertise."
                    </div>
                    <div className="w-full md:w-auto flex items-center justify-center md:pr-4">
                      <Button 
                        onClick={() => setIsStarted(true)} 
                        className="w-full md:w-[180px] bg-primary text-primary-foreground font-black py-4 rounded-xl text-xs hover:scale-[1.05] transition-transform shadow-lg h-auto uppercase tracking-[0.2em]"
                      >
                        Start Trivia
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : gameState.isComplete ? (
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center">
            <div className={cn(
              "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
              gameState.score >= questions.length * 0.6 ? "bg-primary/20" : "bg-secondary"
            )}>
              <span className="text-3xl font-bold text-primary">
                {gameState.score}/{questions.length}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              {gameState.score >= questions.length * 0.8 ? "¡Increíble!" : gameState.score >= questions.length * 0.5 ? "¡Buen trabajo!" : "¡Buen intento!"}
            </h2>
            <p className="text-muted-foreground mb-6">{getScoreMessage()}</p>

            {/* Results breakdown */}
            <div className="mb-6 space-y-2">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg text-sm",
                    gameState.answers[i] === q.correctAnswer
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  <span className="truncate max-w-[80%]">{q.question}</span>
                  {gameState.answers[i] === q.correctAnswer ? (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/50 max-w-sm mx-auto">
              <p className="text-primary font-bold">¡Gracias por jugar! Nos vemos mañana</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress */}
          <div className="relative flex items-center justify-between mb-4">
            <span className="text-sm text-black dark:text-white font-medium">
              Pregunta {gameState.currentQuestion + 1} de {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-primary">
                Score: {gameState.score}
              </span>
              <SurrenderButton onClick={() => console.log("Surrender")} />
            </div>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((gameState.currentQuestion) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <span className="text-xs text-primary font-medium">{currentQ.category}</span>
              <CardTitle className="text-xl text-card-foreground leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === currentQ.correctAnswer
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-lg text-left transition-all",
                        "border-2",
                        showCorrect
                          ? "border-primary bg-primary/10 text-primary"
                          : showWrong
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : isSelected
                              ? "border-primary bg-primary/5 text-card-foreground"
                              : "border-border bg-secondary/30 text-card-foreground hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {showWrong && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submit button */}
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || showResult}
            className="w-full bg-primary text-primary-foreground"
          >
            {showResult ? "Loading next question..." : "Submit Answer"}
          </Button>
        </>
      )}
    </div>
  )
}
