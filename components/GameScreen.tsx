"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { SessionLog } from "../app/api/generate-logs/route"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface GameScreenProps {
  currentLog: SessionLog
  currentIndex: number
  totalLogs: number
  onSwipe: (isBot: boolean) => void
  currentDifficulty: "easy" | "medium" | "hard"
  currentStreak: number
}

export default function GameScreen({
  currentLog,
  currentIndex,
  totalLogs,
  onSwipe,
  currentDifficulty,
  currentStreak,
}: GameScreenProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showOverlay, setShowOverlay] = useState<"bot" | "human" | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return

    const offset = clientX - startX.current
    setDragOffset(offset)

    if (Math.abs(offset) > 50) {
      setShowOverlay(offset < 0 ? "bot" : "human")
    } else {
      setShowOverlay(null)
    }
  }

  const handleEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    if (Math.abs(dragOffset) > 100) {
      const isBot = dragOffset < 0
      onSwipe(isBot)
    }

    setDragOffset(0)
    setShowOverlay(null)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd()
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, dragOffset])

  const progress = ((currentIndex + 1) / totalLogs) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white text-lg font-semibold">
            Session {currentIndex + 1} of {totalLogs}
          </h2>
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            {currentStreak > 0 && (
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <span className="text-purple-300 text-sm font-semibold">🔥 {currentStreak}</span>
              </div>
            )}

            {/* Difficulty Indicator */}
            <div
              className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${getDifficultyColor(currentDifficulty)}`}
            >
              {currentDifficulty}
            </div>
          </div>
        </div>

        <div className="text-gray-300 text-sm mb-2">
          <span className="md:hidden">Swipe ← BOT | HUMAN →</span>
          <span className="hidden md:inline">Drag card or use buttons below</span>
        </div>

        <Progress value={progress} className="h-2 bg-white/10" />

        {/* Desktop Click Buttons */}
        <div className="hidden md:flex justify-center gap-4 mt-4">
          <Button
            onClick={() => onSwipe(true)}
            className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400 font-semibold px-6 py-2"
            variant="outline"
          >
            🤖 BOT
          </Button>
          <Button
            onClick={() => onSwipe(false)}
            className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50 text-green-400 font-semibold px-6 py-2"
            variant="outline"
          >
            👤 HUMAN
          </Button>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center relative">
        <div
          ref={cardRef}
          className="relative w-full max-w-md cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Card className="bg-black/30 backdrop-blur-lg border-white/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6 font-mono text-sm">
                {/* Request Headers */}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">Request Headers</h3>
                  <div className="space-y-2 pl-4">
                    <div>
                      <span className="text-blue-300">User-Agent:</span>
                      <div className="text-green-300 break-all mt-1">{currentLog.requestHeaders["User-Agent"]}</div>
                    </div>
                    {currentLog.requestHeaders["Sec-CH-UA"] && (
                      <div>
                        <span className="text-blue-300">Sec-CH-UA:</span>
                        <div className="text-green-300 break-all mt-1">{currentLog.requestHeaders["Sec-CH-UA"]}</div>
                      </div>
                    )}
                    {currentLog.requestHeaders["Sec-CH-UA-Platform"] && (
                      <div>
                        <span className="text-blue-300">Sec-CH-UA-Platform:</span>
                        <div className="text-green-300 mt-1">{currentLog.requestHeaders["Sec-CH-UA-Platform"]}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-blue-300">Accept-Language:</span>
                      <div className="text-green-300 mt-1">{currentLog.requestHeaders["Accept-Language"]}</div>
                    </div>
                  </div>
                </div>

                {/* Navigator */}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">Navigator</h3>
                  <div className="space-y-2 pl-4">
                    <div>
                      <span className="text-blue-300">userAgent:</span>
                      <div className="text-green-300 break-all mt-1">{currentLog.navigator.userAgent}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">platform:</span>
                      <div className="text-green-300 mt-1">{currentLog.navigator.platform}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">language:</span>
                      <div className="text-green-300 mt-1">{currentLog.navigator.language}</div>
                    </div>
                  </div>
                </div>

                {/* WebGL */}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">WebGL</h3>
                  <div className="space-y-2 pl-4">
                    <div>
                      <span className="text-blue-300">vendor:</span>
                      <div className="text-green-300 mt-1">{currentLog.webgl.vendor}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">renderer:</span>
                      <div className="text-green-300 break-all mt-1">{currentLog.webgl.renderer}</div>
                    </div>
                  </div>
                </div>

                {/* Network */}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-3">Network</h3>
                  <div className="space-y-2 pl-4">
                    <div>
                      <span className="text-blue-300">ip:</span>
                      <div className="text-green-300 mt-1">{currentLog.network.ip}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">asn:</span>
                      <div className="text-green-300 mt-1">{currentLog.network.asn}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">location:</span>
                      <div className="text-green-300 mt-1">{currentLog.network.location}</div>
                    </div>
                    <div>
                      <span className="text-blue-300">timezone:</span>
                      <div className="text-green-300 mt-1">{currentLog.network.timezone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Swipe Overlays */}
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`text-6xl font-bold px-8 py-4 rounded-lg border-4 ${
                  showOverlay === "bot"
                    ? "text-red-400 border-red-400 bg-red-400/20"
                    : "text-green-400 border-green-400 bg-green-400/20"
                }`}
              >
                {showOverlay === "bot" ? "BOT" : "HUMAN"}
              </div>
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 opacity-50">
          <div className="text-2xl">←</div>
          <div className="text-sm font-semibold">BOT</div>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400 opacity-50">
          <div className="text-2xl">→</div>
          <div className="text-sm font-semibold">HUMAN</div>
        </div>
      </div>
    </div>
  )
}
