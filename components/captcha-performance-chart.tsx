"use client"

import { useState } from "react"
import { Play, RotateCcw } from "lucide-react"

interface TimelineStep {
  name: string
  duration: number
  color: string
  label: string
  delay: number
}

export function CaptchaPerformanceChart() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const traditionalSteps: TimelineStep[] = [
    { name: "security-analysis", duration: 800, color: "bg-green-500", label: "Security Analysis", delay: 0 },
    {
      name: "show-puzzle",
      duration: 25000,
      color: "bg-red-500",
      label: "Human Puzzle Solving (3-42 seconds)",
      delay: 1000,
    },
    { name: "validation", duration: 15, color: "bg-purple-500", label: "Puzzle Validation", delay: 2000 },
  ]

  const invisibleSteps: TimelineStep[] = [
    { name: "security-analysis", duration: 200, color: "bg-green-500", label: "Security Analysis", delay: 3000 },
    { name: "decision", duration: 15, color: "bg-amber-600", label: "Automated Decision", delay: 3500 },
  ]

  const allSteps = [...traditionalSteps, ...invisibleSteps]

  const startAnimation = () => {
    setIsAnimating(true)
    setCurrentStep(0)
    setShowSummary(false)

    allSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1)
        if (index === allSteps.length - 1) {
          setTimeout(() => {
            setShowSummary(true)
            setIsAnimating(false)
          }, 1000)
        }
      }, step.delay)
    })
  }

  const resetAnimation = () => {
    setCurrentStep(0)
    setShowSummary(false)
    setIsAnimating(false)
  }

  const getBarWidth = (duration: number) => {
    const maxDuration = 42000 // 42 seconds max
    return Math.max((duration / maxDuration) * 100, 0.5) // Minimum 0.5% width for visibility
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 font-mono text-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-700">
        <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
          <span className="text-xs text-black">⚡</span>
        </div>
        <h3 className="text-lg font-bold text-gray-100">CAPTCHA Performance Analysis - Network Timeline</h3>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          <Play className="w-4 h-4" />
          {isAnimating ? "Running..." : "Start Analysis"}
        </button>
        <button
          onClick={resetAnimation}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Traditional CAPTCHA Flow */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-500"></div>
          <h4 className="text-lg font-bold text-gray-100">Traditional CAPTCHA Flow</h4>
        </div>

        <div className="bg-gray-800 rounded border border-gray-600">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-600 text-gray-400 text-xs font-semibold">
            <div className="col-span-2">NAME</div>
            <div className="col-span-8">WATERFALL</div>
            <div className="col-span-2 text-right">TIME</div>
          </div>

          {/* Traditional Steps */}
          {traditionalSteps.map((step, index) => (
            <div key={step.name} className="grid grid-cols-12 gap-4 p-3 border-b border-gray-700 last:border-b-0">
              <div className="col-span-2 text-blue-400">{step.name}</div>
              <div className="col-span-8 flex items-center">
                <div className="w-full bg-gray-700 h-4 rounded relative overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-1000 ease-out flex items-center px-2 text-xs text-white font-semibold`}
                    style={{
                      width: currentStep > index ? `${getBarWidth(step.duration)}%` : "0%",
                    }}
                  >
                    {currentStep > index && step.duration > 5000 && <span className="truncate">{step.label}</span>}
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right text-gray-300">
                {currentStep > index ? formatTime(step.duration) : ""}
              </div>
            </div>
          ))}

          {/* Timeline */}
          <div className="p-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>0ms</span>
              <span>5s</span>
              <span>10s</span>
              <span>15s</span>
              <span>20s</span>
              <span>25s</span>
              <span>30s</span>
              <span>35s</span>
              <span>40s+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invisible CAPTCHA Flow */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-500"></div>
          <h4 className="text-lg font-bold text-gray-100">Invisible CAPTCHA Flow</h4>
        </div>

        <div className="bg-gray-800 rounded border border-gray-600">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-600 text-gray-400 text-xs font-semibold">
            <div className="col-span-2">NAME</div>
            <div className="col-span-8">WATERFALL</div>
            <div className="col-span-2 text-right">TIME</div>
          </div>

          {/* Invisible Steps */}
          {invisibleSteps.map((step, index) => {
            const stepIndex = index + traditionalSteps.length
            return (
              <div key={step.name} className="grid grid-cols-12 gap-4 p-3 border-b border-gray-700 last:border-b-0">
                <div className="col-span-2 text-blue-400">{step.name}</div>
                <div className="col-span-8 flex items-center">
                  <div className="w-full bg-gray-700 h-4 rounded relative overflow-hidden">
                    <div
                      className={`h-full ${step.color} transition-all duration-500 ease-out`}
                      style={{
                        width: currentStep > stepIndex ? `${getBarWidth(step.duration)}%` : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-right text-gray-300">
                  {currentStep > stepIndex ? formatTime(step.duration) : ""}
                </div>
              </div>
            )
          })}

          {/* Timeline */}
          <div className="p-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>0ms</span>
              <span>5s</span>
              <span>10s</span>
              <span>15s</span>
              <span>20s</span>
              <span>25s</span>
              <span>30s</span>
              <span>35s</span>
              <span>40s+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Impact */}
      {showSummary && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-yellow-400">
            <span>⚡</span>
            <span className="font-semibold">Performance Impact:</span>
            <span>Traditional CAPTCHAs add 3,000-42,000ms of human overhead to a 215ms security process</span>
          </div>
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 animate-fade-in">
          <h4 className="text-blue-400 font-bold mb-3">Performance Analysis Summary</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Traditional CAPTCHA:</span> 3.8-42.8 seconds total (815ms security + 3-42s
              human solving)
            </div>
            <div>
              <span className="font-semibold">Invisible CAPTCHA:</span> 215ms total (200ms analysis + 15ms decision)
            </div>
            <div className="mt-3 pt-3 border-t border-blue-600">
              <span className="font-semibold text-green-400">Result:</span> Invisible CAPTCHAs are 18-199x faster while
              providing identical security analysis.
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Security Analysis (identical for both)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Human Puzzle Solving (traditional only)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded"></div>
            <span>Automated Decision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Puzzle Validation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
