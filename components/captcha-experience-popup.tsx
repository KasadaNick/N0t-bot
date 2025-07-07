"use client"

import { useState, useEffect } from "react"
import { X, Clock, Shield, Eye, Monitor, Globe, Cpu, MousePointer } from "lucide-react"

interface BrowserFingerprint {
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  platform: string
  cookiesEnabled: boolean
  doNotTrack: string
  colorDepth: number
  pixelRatio: number
  hardwareConcurrency: number
  maxTouchPoints: number
  onlineStatus: boolean
}

export function CaptchaExperiencePopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState<"captcha" | "timing" | "fingerprint" | "conclusion">("captcha")
  const [startTime, setStartTime] = useState<number>(0)
  const [completionTime, setCompletionTime] = useState<number>(0)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showError, setShowError] = useState(false)
  const [isManualTrigger, setIsManualTrigger] = useState(false)
  const [hasCompletedBefore, setHasCompletedBefore] = useState(false)
  const [debugInfo, setDebugInfo] = useState({ scrollY: 0, timeOnPage: 0, triggered: false })

  // Listen for game completion to trigger popup
  useEffect(() => {
    const handleGameComplete = () => {
      console.log("Game completed - triggering CAPTCHA popup")
      triggerManually()
    }

    // Listen for custom event from the game
    window.addEventListener("captcha-game-complete", handleGameComplete)
    return () => window.removeEventListener("captcha-game-complete", handleGameComplete)
  }, [])

  // Check if user has completed the popup before
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("captcha-popup-completed")
      const completedTime = localStorage.getItem("captcha-popup-completed-time")

      // Reset after 15 minutes
      if (completed && completedTime) {
        const timeDiff = Date.now() - Number.parseInt(completedTime)
        const fifteenMinutes = 15 * 60 * 1000

        if (timeDiff > fifteenMinutes) {
          localStorage.removeItem("captcha-popup-completed")
          localStorage.removeItem("captcha-popup-completed-time")
          setHasCompletedBefore(false)
        } else {
          setHasCompletedBefore(true)
        }
      }
    }
  }, [])

  // Debug trigger - remove this in production
  useEffect(() => {
    const debugInterval = setInterval(() => {
      setDebugInfo({
        scrollY: window.scrollY,
        timeOnPage: Date.now() - (window as any).pageLoadTime || 0,
        triggered: isVisible,
      })
    }, 1000)

    return () => clearInterval(debugInterval)
  }, [isVisible])

  // Set page load time for debugging
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).pageLoadTime = Date.now()
    }
  }, [])

  // Trigger popup after user engagement - but only if not completed before
  useEffect(() => {
    if (hasCompletedBefore) return // Don't trigger if already completed

    let timeoutId: NodeJS.Timeout

    const triggerPopup = () => {
      console.log("Triggering popup...")
      setIsVisible(true)
      setStartTime(Date.now())
    }

    // Simple timer - trigger after 5 seconds for testing
    timeoutId = setTimeout(() => {
      console.log("5 second timer triggered")
      triggerPopup()
    }, 5000)

    // Also trigger on scroll past 300px after 3 seconds
    const handleScroll = () => {
      if (window.scrollY > 300 && !isVisible && !hasCompletedBefore) {
        console.log("Scroll trigger activated")
        clearTimeout(timeoutId)
        setTimeout(triggerPopup, 3000)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timeoutId)
    }
  }, [isVisible, hasCompletedBefore])

  // Collect browser fingerprint
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fp: BrowserFingerprint = {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || "not specified",
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        onlineStatus: navigator.onLine,
      }
      setFingerprint(fp)
    }
  }, [])

  const captchaImages = [
    {
      id: 1,
      label: "🚦 Traffic Light",
      bgColor: "bg-red-200",
      textColor: "text-red-800",
      isCorrect: true,
    },
    {
      id: 2,
      label: "🚗 Red Car",
      bgColor: "bg-blue-200",
      textColor: "text-blue-800",
      isCorrect: false,
    },
    {
      id: 3,
      label: "🚦 Traffic Signal",
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      isCorrect: true,
    },
    {
      id: 4,
      label: "🚲 Bicycle",
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      isCorrect: false,
    },
    {
      id: 5,
      label: "🚦 Pedestrian Light",
      bgColor: "bg-purple-200",
      textColor: "text-purple-800",
      isCorrect: true,
    },
    {
      id: 6,
      label: "🚌 City Bus",
      bgColor: "bg-orange-200",
      textColor: "text-orange-800",
      isCorrect: false,
    },
    {
      id: 7,
      label: "🚶 Crosswalk",
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
      isCorrect: false,
    },
    {
      id: 8,
      label: "🚦 Traffic Light Pole",
      bgColor: "bg-pink-200",
      textColor: "text-pink-800",
      isCorrect: true,
    },
    {
      id: 9,
      label: "🏍️ Motorcycle",
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-800",
      isCorrect: false,
    },
  ]

  const handleImageClick = (imageId: number) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleVerify = () => {
    const correctImages = captchaImages.filter((img) => img.isCorrect).map((img) => img.id)
    const isCorrect =
      selectedImages.length === correctImages.length && selectedImages.every((id) => correctImages.includes(id))

    if (isCorrect) {
      const endTime = Date.now()
      setCompletionTime(endTime - startTime)
      setIsCompleted(true)
      setTimeout(() => setCurrentStep("timing"), 1000)
    } else {
      setAttempts((prev) => prev + 1)
      setShowError(true)
      setSelectedImages([])
      setTimeout(() => setShowError(false), 2000)

      // Make it even more frustrating on subsequent attempts
      if (attempts >= 1) {
        setTimeout(() => {
          setSelectedImages([])
        }, 1000)
      }
    }
  }

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)} seconds`
  }

  const handleClose = () => {
    setIsVisible(false)

    // Mark as completed if they went through the full experience
    if (currentStep === "conclusion" || isCompleted) {
      if (typeof window !== "undefined") {
        localStorage.setItem("captcha-popup-completed", "true")
        localStorage.setItem("captcha-popup-completed-time", Date.now().toString())
        setHasCompletedBefore(true)
      }
    }
  }

  const triggerManually = () => {
    setIsVisible(true)
    setCurrentStep("captcha")
    setStartTime(Date.now())
    setCompletionTime(0)
    setSelectedImages([])
    setIsCompleted(false)
    setAttempts(0)
    setShowError(false)
    setIsManualTrigger(true)
  }

  const resetExperience = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("captcha-popup-completed")
      localStorage.removeItem("captcha-popup-completed-time")
      setHasCompletedBefore(false)
    }
    triggerManually()
  }

  return (
    <>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-40">
          <div>Scroll: {debugInfo.scrollY}px</div>
          <div>Time: {Math.round(debugInfo.timeOnPage / 1000)}s</div>
          <div>Triggered: {debugInfo.triggered ? "Yes" : "No"}</div>
          <div>Completed Before: {hasCompletedBefore ? "Yes" : "No"}</div>
          <button onClick={triggerManually} className="bg-red-500 px-2 py-1 rounded mt-1 text-xs">
            Force Trigger
          </button>
          <button onClick={resetExperience} className="bg-blue-500 px-2 py-1 rounded mt-1 text-xs ml-1">
            Reset & Trigger
          </button>
        </div>
      )}

      {/* Manual trigger button - show different text based on completion status */}
      {!isVisible && (
        <button
          onClick={hasCompletedBefore ? resetExperience : triggerManually}
          className="fixed bottom-6 right-6 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-600 hover:border-gray-500"
        >
          {hasCompletedBefore ? "Experience CAPTCHA frustration again →" : "Experience CAPTCHA frustration →"}
        </button>
      )}

      {isVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* CAPTCHA Step */}
            {currentStep === "captcha" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Verify you're human</h3>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    Select all images with <strong>traffic lights</strong>
                  </p>
                  <p className="text-sm text-gray-500">Click verify once there are none left.</p>
                </div>

                {showError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    Please try again. Select all images with traffic lights.
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-6 border border-gray-300 p-4 bg-gray-50">
                  {captchaImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleImageClick(image.id)}
                      className={`aspect-square border-2 cursor-pointer hover:opacity-80 transition-all relative overflow-hidden rounded flex items-center justify-center text-center p-2 ${
                        image.bgColor
                      } ${image.textColor} ${
                        selectedImages.includes(image.id) ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                      }`}
                    >
                      <div className="text-xs font-medium leading-tight">{image.label}</div>
                      {selectedImages.includes(image.id) && (
                        <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Time elapsed: {formatTime(Date.now() - startTime)}</span>
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={selectedImages.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-semibold transition-colors"
                  >
                    Verify
                  </button>
                </div>

                {attempts > 0 && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    Attempt {attempts + 1} - This is getting frustrating, isn't it?
                  </div>
                )}
              </div>
            )}

            {/* Timing Reveal Step */}
            {currentStep === "timing" && (
              <div className="p-6 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">That took {formatTime(completionTime)}</h3>
                  <p className="text-gray-600">An invisible CAPTCHA would have verified you in 0.2 seconds.</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-700">
                    <div className="flex justify-between mb-2">
                      <span>Your time:</span>
                      <span className="font-semibold text-red-600">{formatTime(completionTime)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Invisible CAPTCHA:</span>
                      <span className="font-semibold text-green-600">0.2 seconds</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Time wasted:</span>
                      <span className="font-bold text-red-600">{formatTime(completionTime - 200)}</span>
                    </div>
                  </div>
                </div>

                {/* Million Iteration Impact */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-red-800 mb-3">Scale Impact: 1 Million Users</h4>
                  <div className="text-sm text-red-700 space-y-2">
                    <div className="flex justify-between">
                      <span>Traditional CAPTCHA:</span>
                      <span className="font-semibold">
                        {Math.round((completionTime * 1000000) / 3600000).toLocaleString()} human hours
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invisible CAPTCHA:</span>
                      <span className="font-semibold text-green-600">0 human hours</span>
                    </div>
                    <div className="flex justify-between border-t border-red-300 pt-2 font-bold">
                      <span>Human time saved:</span>
                      <span className="text-red-800">
                        {Math.round((completionTime * 1000000) / 3600000).toLocaleString()} human hours
                      </span>
                    </div>

                    {/* Fun alternative activities */}
                    <div className="mt-3 pt-3 border-t border-red-300">
                      <div className="text-xs text-red-600 font-semibold mb-2">
                        With that saved time, humanity could instead:
                      </div>
                      <div className="space-y-1 text-xs text-red-700">
                        {(() => {
                          const totalHours = Math.round((completionTime * 1000000) / 3600000)
                          const activities = []

                          // Calculate different activities based on time saved
                          if (totalHours >= 10000) {
                            activities.push(`🎬 Watch ${Math.round(totalHours / 2.5).toLocaleString()} movies`)
                          }
                          if (totalHours >= 1000) {
                            activities.push(`📚 Read ${Math.round(totalHours / 8).toLocaleString()} novels`)
                          }
                          if (totalHours >= 100) {
                            activities.push(
                              `☕ Enjoy ${Math.round((totalHours * 60) / 15).toLocaleString()} coffee breaks`,
                            )
                          }
                          if (totalHours >= 50) {
                            activities.push(`🏃 Run ${Math.round(totalHours * 6).toLocaleString()} miles`)
                          }
                          if (totalHours >= 10) {
                            activities.push(`😴 Take ${Math.round(totalHours / 0.33).toLocaleString()} power naps`)
                          }

                          // Always show pizza slices for any amount of time
                          activities.push(
                            `🍕 Eat ${Math.round((totalHours * 60) / 3).toLocaleString()} slices of pizza`,
                          )

                          return activities.slice(0, 3).map((activity, index) => <div key={index}>• {activity}</div>)
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep("fingerprint")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Want to see what we already knew about you?
                </button>
              </div>
            )}

            {/* Fingerprint Reveal Step */}
            {currentStep === "fingerprint" && fingerprint && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">We identified you in 0.2 seconds</h3>
                  <p className="text-gray-600">Here's what your browser told us automatically:</p>
                </div>

                <div className="grid gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">Device Information</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        Screen: {fingerprint.screenResolution} ({fingerprint.colorDepth}-bit color)
                      </div>
                      <div>Platform: {fingerprint.platform}</div>
                      <div>Pixel Ratio: {fingerprint.pixelRatio}x</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">Location & Language</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>Timezone: {fingerprint.timezone}</div>
                      <div>Language: {fingerprint.language}</div>
                      <div>Online Status: {fingerprint.onlineStatus ? "Connected" : "Offline"}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">Hardware Capabilities</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>CPU Cores: {fingerprint.hardwareConcurrency}</div>
                      <div>Touch Points: {fingerprint.maxTouchPoints}</div>
                      <div>Cookies: {fingerprint.cookiesEnabled ? "Enabled" : "Disabled"}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">Browser Signature</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="truncate">{fingerprint.userAgent}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>Human behavior detected:</strong> Natural mouse movements, realistic timing patterns, and
                    authentic interaction sequences confirmed your humanity instantly.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep("conclusion")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  See the Full Comparison
                </button>
              </div>
            )}

            {/* Conclusion Step */}
            {currentStep === "conclusion" && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">The Invisible Difference</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 mb-2">Traditional CAPTCHA</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>Time wasted: {formatTime(completionTime)}</li>
                      <li>User frustration: High</li>
                      <li>Attempts needed: {attempts + 1}</li>
                      <li>Accessibility: Poor</li>
                      <li>Bot effectiveness: 85-100%</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">Invisible CAPTCHA</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>Time wasted: 0 seconds</li>
                      <li>User frustration: None</li>
                      <li>Attempts needed: 0</li>
                      <li>Accessibility: Perfect</li>
                      <li>Bot effectiveness: 0%</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-center">
                    <strong>Result:</strong> Invisible CAPTCHAs provide better security with zero user friction. Your{" "}
                    {formatTime(completionTime)} of frustration could have been avoided entirely.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Learn More About Invisible CAPTCHAs
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
