"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserAnswer } from "../app/page"
import type { SessionLog } from "../app/api/generate-logs/route"
import type { UserPerformance } from "../lib/performance-tracker"
import { calculateWeightedScore, getSkillLevel } from "../lib/performance-tracker"

interface ResultsScreenProps {
  userAnswers: UserAnswer[]
  sessionLogs: SessionLog[]
  onReset: () => void
  userPerformance: UserPerformance
}

export default function ResultsScreen({ userAnswers, sessionLogs, onReset, userPerformance }: ResultsScreenProps) {
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState("")

  const correctAnswers = userAnswers.filter((answer) => answer.correct).length
  const totalAnswers = userAnswers.length
  const simplePercentage = Math.round((correctAnswers / totalAnswers) * 100)

  const weightedScore = calculateWeightedScore(
    userAnswers.map((a) => ({ isCorrect: a.correct, logDifficulty: a.logDifficulty })),
  )

  const hardCorrect = userAnswers.filter((a) => a.logDifficulty === "hard" && a.correct).length
  const skillLevel = getSkillLevel(weightedScore, hardCorrect)

  const getScoreMessage = (score: number, level: string) => {
    if (score >= 90) return `${level} level achieved! 🎯`
    if (score >= 80) return `${level} level - Great detection skills! 👏`
    if (score >= 70) return `${level} level - Good eye for anomalies! 👀`
    return `${level} level - Bot detection is tricky, practice makes perfect! 💪`
  }

  const handleShare = async () => {
    const shareData = {
      title: "Kasada Bot Detection Challenge",
      text: `🔥 I scored ${weightedScore} points (${skillLevel} level) on the Kasada Bot Detection Challenge! Think you can spot the bots better than me?`,
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
        fallbackShare(shareData.text)
      }
    } else {
      fallbackShare(shareData.text)
    }
  }

  const fallbackShare = (text: string) => {
    navigator.clipboard.writeText(`${text} ${window.location.origin}`)
    alert("Share text copied to clipboard!")
  }

  const handleCreateChallenge = async () => {
    setIsCreatingChallenge(true)
    try {
      const response = await fetch("/api/create-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameData: userAnswers,
          userScore: simplePercentage,
          logs: sessionLogs,
          weightedScore,
          skillLevel,
        }),
      })

      const data = await response.json()
      const fullUrl = `${window.location.origin}${data.challengeUrl}`
      setChallengeUrl(fullUrl)

      // Copy to clipboard
      navigator.clipboard.writeText(fullUrl)
      alert("Challenge link copied to clipboard!")
    } catch (error) {
      console.error("Error creating challenge:", error)
      alert("Failed to create challenge. Please try again.")
    } finally {
      setIsCreatingChallenge(false)
    }
  }

  const getLogById = (id: string) => {
    return sessionLogs.find((log) => log.id === id)
  }

  const getBotHint = (pattern: string) => {
    const hints: Record<string, string> = {
      "iphone-desktop-gpu": "iPhone User-Agent but Windows Navigator + Desktop GPU",
      "firefox-chrome-headers": "Firefox User-Agent but includes Chrome-only Sec-CH-UA headers",
      "cloud-infrastructure": "Consumer device but AWS cloud infrastructure (AS16509)",
      "version-mismatch": "Chrome 91 User-Agent but Chrome 119 Sec-CH-UA headers",
      "missing-headers": "Chrome User-Agent but missing expected Sec-CH-UA headers",
      "minor-version-diff": "Minor version difference between User-Agent and Navigator",
    }
    return hints[pattern] || "Technical inconsistency detected"
  }

  // Performance breakdown by difficulty
  const difficultyBreakdown = {
    easy: userAnswers.filter((a) => a.logDifficulty === "easy"),
    medium: userAnswers.filter((a) => a.logDifficulty === "medium"),
    hard: userAnswers.filter((a) => a.logDifficulty === "hard"),
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Score Card */}
        <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{weightedScore} Points</h1>
            <p className="text-2xl text-purple-400 font-semibold mb-4">{skillLevel} Level</p>
            <p className="text-lg text-gray-300 mb-2">
              {correctAnswers} out of {totalAnswers} correct ({simplePercentage}%)
            </p>
            <p className="text-lg text-blue-400 font-semibold">{getScoreMessage(weightedScore, skillLevel)}</p>

            {hardCorrect > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 font-semibold">🎯 Caught {hardCorrect} hard patterns!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance by Difficulty</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(difficultyBreakdown).map(([difficulty, answers]) => {
                const correct = answers.filter((a) => a.correct).length
                const total = answers.length
                const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

                return (
                  <div key={difficulty} className="text-center">
                    <div
                      className={`text-sm font-semibold uppercase mb-1 ${
                        difficulty === "easy"
                          ? "text-green-400"
                          : difficulty === "medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {difficulty}
                    </div>
                    <div className="text-white font-bold">
                      {correct}/{total}
                    </div>
                    <div className="text-gray-400 text-sm">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Answer Breakdown</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userAnswers.map((answer, index) => {
                const log = getLogById(answer.logId)
                if (!log) return null

                return (
                  <div
                    key={answer.logId}
                    className={`p-3 rounded-lg border ${
                      answer.correct ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Session {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                            log.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : log.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {log.difficulty}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            answer.userGuess ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          Your guess: {answer.userGuess ? "BOT" : "HUMAN"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            answer.actualValue ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          Actual: {answer.actualValue ? "BOT" : "HUMAN"}
                        </span>
                        {answer.correct ? (
                          <span className="text-green-400 text-lg">✓</span>
                        ) : (
                          <span className="text-red-400 text-lg">✗</span>
                        )}
                      </div>
                    </div>

                    {!answer.correct && answer.actualValue && (
                      <div className="text-xs text-gray-400 mt-2 p-2 bg-black/20 rounded">
                        <strong className="text-red-400">Bot indicators:</strong>
                        <div className="mt-1">• {getBotHint(answer.pattern)}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={onReset}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
          >
            Try Again
          </Button>

          <Button
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
          >
            Share Score
          </Button>

          <Button
            onClick={handleCreateChallenge}
            disabled={isCreatingChallenge}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 disabled:opacity-50"
          >
            {isCreatingChallenge ? "Creating..." : "Challenge Friend"}
          </Button>
        </div>

        {challengeUrl && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg w-full">
            <p className="text-green-300 text-sm mb-2">Challenge created! Link copied to clipboard:</p>
            <p className="text-white text-sm font-mono break-all">{challengeUrl}</p>
          </div>
        )}

        {/* Personal Stats */}
        <Card className="w-full bg-black/20 backdrop-blur-lg border-white/10 mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{userPerformance.totalGames}</div>
                <div className="text-gray-400 text-sm">Games Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{userPerformance.bestStreak}</div>
                <div className="text-gray-400 text-sm">Best Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by <span className="text-purple-400 font-semibold">Kasada</span> - Learn more about bot mitigation
            at{" "}
            <a
              href="https://kasada.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              kasada.io
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
