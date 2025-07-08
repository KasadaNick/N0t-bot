"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserPerformance } from "../lib/performance-tracker"

interface WelcomeScreenProps {
  onStart: () => void
  userPerformance: UserPerformance | null
}

export default function WelcomeScreen({ onStart, userPerformance }: WelcomeScreenProps) {
  const isReturningUser = userPerformance && userPerformance.totalGames > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border-white/10">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-4">Bot Detection Challenge</h1>
            {isReturningUser ? (
              <div className="mb-4 p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <p className="text-purple-300 text-sm mb-2">Welcome back!</p>
                <p className="text-white font-semibold">
                  Best Score: {userPerformance.bestWeightedScore} pts ({userPerformance.skillLevel} level)
                </p>
                <p className="text-gray-300 text-sm">
                  Games played: {userPerformance.totalGames} | Best streak: {userPerformance.bestStreak}
                </p>
              </div>
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed">
                Test your ability to identify bot traffic from real user sessions. Swipe left for{" "}
                <span className="text-red-400 font-semibold">BOT</span>, right for{" "}
                <span className="text-green-400 font-semibold">HUMAN</span>.
              </p>
            )}
          </div>

          <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-400 mb-2">Look for technical inconsistencies:</p>
            <ul className="text-xs text-gray-300 space-y-1 text-left">
              <li>• User-Agent vs Navigator mismatches</li>
              <li>• Platform conflicts</li>
              <li>• Impossible hardware combinations</li>
              <li>• Missing or incorrect browser headers</li>
              <li>• Cloud infrastructure signatures</li>
            </ul>
          </div>

          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
          >
            {isReturningUser ? "Continue Challenge" : "Start Challenge"}
          </Button>

          <footer className="mt-8 pt-4 border-t border-white/10">
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
        </CardContent>
      </Card>
    </div>
  )
}
