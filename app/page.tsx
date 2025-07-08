"use client"

import { useState, useEffect } from "react"
import type { SessionLog } from "./api/generate-logs/route"
import WelcomeScreen from "../components/WelcomeScreen"
import GameScreen from "../components/GameScreen"
import ResultsScreen from "../components/ResultsScreen"
import {
  loadUserPerformance,
  saveUserPerformance,
  updatePerformanceAfterGame,
  adaptDifficulty,
  calculateWeightedScore,
  type UserPerformance,
} from "../lib/performance-tracker"

export type GameState = "welcome" | "playing" | "results"

export interface UserAnswer {
  logId: string
  userGuess: boolean
  correct: boolean
  actualValue: boolean
  logDifficulty: string
  pattern: string
}

export default function BotDetectionApp() {
  const [gameState, setGameState] = useState<GameState>("welcome")
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])
  const [userPerformance, setUserPerformance] = useState<UserPerformance | null>(null)
  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [recentAnswers, setRecentAnswers] = useState<boolean[]>([])

  useEffect(() => {
    // Load user performance on mount
    const performance = loadUserPerformance()
    setUserPerformance(performance)
    setCurrentDifficulty(performance.difficultyLevel)
  }, [])

  const generateLogs = async (difficulty: string, performance: UserPerformance) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/generate-logs?difficulty=${difficulty}&performance=${encodeURIComponent(JSON.stringify(performance))}`,
      )
      const data = await response.json()
      setSessionLogs(data.logs)
    } catch (error) {
      console.error("Error generating logs:", error)
      // Fallback to empty array or default logs
      setSessionLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const startGame = async () => {
    if (!userPerformance) return

    setGameState("playing")
    setCurrentLogIndex(0)
    setUserAnswers([])
    setRecentAnswers([])

    await generateLogs(currentDifficulty, userPerformance)
  }

  const handleSwipe = async (isBot: boolean) => {
    const currentLog = sessionLogs[currentLogIndex]
    const correct = isBot === currentLog.isBot

    const answer: UserAnswer = {
      logId: currentLog.id,
      userGuess: isBot,
      correct,
      actualValue: currentLog.isBot,
      logDifficulty: currentLog.difficulty,
      pattern: currentLog.pattern,
    }

    const newAnswers = [...userAnswers, answer]
    const newRecentAnswers = [...recentAnswers, correct]

    setUserAnswers(newAnswers)
    setRecentAnswers(newRecentAnswers)

    // Check if we need to adapt difficulty
    if (userPerformance && newRecentAnswers.length >= 3) {
      const newDifficulty = adaptDifficulty(userPerformance, newRecentAnswers)
      if (newDifficulty !== currentDifficulty) {
        setCurrentDifficulty(newDifficulty)
        // Show difficulty change notification (you could add a toast here)
        console.log(`Difficulty changed to: ${newDifficulty}`)
      }
    }

    if (currentLogIndex < sessionLogs.length - 1) {
      setCurrentLogIndex(currentLogIndex + 1)
    } else {
      // Game finished - update performance and show results
      if (userPerformance) {
        const weightedScore = calculateWeightedScore(
          newAnswers.map((a) => ({ isCorrect: a.correct, logDifficulty: a.logDifficulty })),
        )
        const simpleScore = Math.round((newAnswers.filter((a) => a.correct).length / newAnswers.length) * 100)

        const updatedPerformance = updatePerformanceAfterGame(
          userPerformance,
          newAnswers.map((a) => ({
            isCorrect: a.correct,
            logDifficulty: a.logDifficulty,
            pattern: a.pattern,
          })),
          weightedScore,
          simpleScore,
        )

        setUserPerformance(updatedPerformance)
        saveUserPerformance(updatedPerformance)
      }

      setGameState("results")
    }
  }

  const resetGame = () => {
    setGameState("welcome")
    setCurrentLogIndex(0)
    setUserAnswers([])
    setRecentAnswers([])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Generating adaptive challenge...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {gameState === "welcome" && <WelcomeScreen onStart={startGame} userPerformance={userPerformance} />}

      {gameState === "playing" && sessionLogs.length > 0 && (
        <GameScreen
          currentLog={sessionLogs[currentLogIndex]}
          currentIndex={currentLogIndex}
          totalLogs={sessionLogs.length}
          onSwipe={handleSwipe}
          currentDifficulty={currentDifficulty}
          currentStreak={recentAnswers.filter(Boolean).length}
        />
      )}

      {gameState === "results" && userPerformance && (
        <ResultsScreen
          userAnswers={userAnswers}
          sessionLogs={sessionLogs}
          onReset={resetGame}
          userPerformance={userPerformance}
        />
      )}
    </div>
  )
}
