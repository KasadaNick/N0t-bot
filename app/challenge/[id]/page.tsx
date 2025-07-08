"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GameScreen from "../../../components/GameScreen"
import ResultsScreen from "../../../components/ResultsScreen"
import type { SessionLog } from "../../api/generate-logs/route"
import type { UserAnswer } from "../../page"
import {
  calculateWeightedScore,
  getSkillLevel,
  loadUserPerformance,
  saveUserPerformance,
  updatePerformanceAfterGame,
} from "../../../lib/performance-tracker"

interface ChallengeData {
  id: string
  challengerScore: number
  challengerWeightedScore: number
  challengerSkillLevel: string
  logs: SessionLog[]
  createdAt: string
}

export default function ChallengePage() {
  const params = useParams()
  const challengeId = params.id as string

  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null)
  const [gameState, setGameState] = useState<"loading" | "intro" | "playing" | "results">("loading")
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, you'd fetch from your database
    // For now, we'll simulate loading challenge data
    const loadChallenge = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, create mock challenge data
        // In production, this would come from your database
        const mockChallengeData: ChallengeData = {
          id: challengeId,
          challengerScore: 85,
          challengerWeightedScore: 78,
          challengerSkillLevel: "Advanced",
          logs: [], // Would be loaded from database
          createdAt: new Date().toISOString(),
        }

        setChallengeData(mockChallengeData)
        setGameState("intro")
      } catch (err) {
        setError("Challenge not found or expired")
      }
    }

    if (challengeId) {
      loadChallenge()
    }
  }, [challengeId])

  const startChallenge = () => {
    setGameState("playing")
    setCurrentLogIndex(0)
    setUserAnswers([])
  }

  const handleSwipe = (isBot: boolean) => {
    if (!challengeData) return

    const currentLog = challengeData.logs[currentLogIndex]
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
    setUserAnswers(newAnswers)

    if (currentLogIndex < challengeData.logs.length - 1) {
      setCurrentLogIndex(currentLogIndex + 1)
    } else {
      // Game finished - update performance
      const userPerformance = loadUserPerformance()
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

      saveUserPerformance(updatedPerformance)
      setGameState("results")
    }
  }

  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading challenge...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Challenge Not Found</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
            >
              Start New Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "intro" && challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Challenge Accepted!</h1>

            <div className="mb-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <p className="text-purple-300 text-sm mb-2">Your friend scored:</p>
              <p className="text-white font-bold text-2xl">{challengeData.challengerWeightedScore} points</p>
              <p className="text-gray-300">
                {challengeData.challengerSkillLevel} level ({challengeData.challengerScore}%)
              </p>
            </div>

            <p className="text-gray-300 text-lg mb-8">
              Can you beat their score? You'll face the exact same session logs they did.
            </p>

            <Button
              onClick={startChallenge}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
            >
              Accept Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === "playing" && challengeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <GameScreen
          currentLog={challengeData.logs[currentLogIndex]}
          currentIndex={currentLogIndex}
          totalLogs={challengeData.logs.length}
          onSwipe={handleSwipe}
          currentDifficulty="medium" // Challenges use fixed difficulty
          currentStreak={0} // No streak tracking in challenges
        />
      </div>
    )
  }

  if (gameState === "results" && challengeData) {
    const userPerformance = loadUserPerformance()
    const myWeightedScore = calculateWeightedScore(
      userAnswers.map((a) => ({ isCorrect: a.correct, logDifficulty: a.logDifficulty })),
    )
    const mySimpleScore = Math.round((userAnswers.filter((a) => a.correct).length / userAnswers.length) * 100)
    const mySkillLevel = getSkillLevel(
      myWeightedScore,
      userAnswers.filter((a) => a.logDifficulty === "hard" && a.correct).length,
    )

    const won = myWeightedScore > challengeData.challengerWeightedScore

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            {/* Challenge Results Comparison */}
            <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 mb-6">
              <CardContent className="p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-6">Challenge Results</h1>

                <div className="grid grid-cols-2 gap-6">
                  <div
                    className={`p-4 rounded-lg border ${won ? "bg-green-500/20 border-green-500/30" : "bg-gray-500/20 border-gray-500/30"}`}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">You</h3>
                    <div className="text-2xl font-bold text-purple-400">{myWeightedScore} pts</div>
                    <div className="text-gray-300">
                      {mySkillLevel} ({mySimpleScore}%)
                    </div>
                    {won && <div className="text-green-400 font-semibold mt-2">🏆 Winner!</div>}
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${!won ? "bg-green-500/20 border-green-500/30" : "bg-gray-500/20 border-gray-500/30"}`}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Challenger</h3>
                    <div className="text-2xl font-bold text-blue-400">{challengeData.challengerWeightedScore} pts</div>
                    <div className="text-gray-300">
                      {challengeData.challengerSkillLevel} ({challengeData.challengerScore}%)
                    </div>
                    {!won && <div className="text-green-400 font-semibold mt-2">🏆 Winner!</div>}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xl text-white font-semibold">
                    {won ? "🎉 Congratulations! You won the challenge!" : "💪 Good effort! Your friend won this round."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Regular Results Screen */}
            <ResultsScreen
              userAnswers={userAnswers}
              sessionLogs={challengeData.logs}
              onReset={() => (window.location.href = "/")}
              userPerformance={userPerformance}
            />
          </div>
        </div>
      </div>
    )
  }

  return null
}
