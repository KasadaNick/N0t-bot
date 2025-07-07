"use client"

import { useState, useEffect } from "react"
import { X, Trophy, ArrowRight, Shuffle, HelpCircle } from "lucide-react"

interface CaptchaProvider {
  id: string
  name: string
  description: string
  color: string
}

interface CaptchaType {
  id: string
  type: string
  description: string
  icon: string
}

export function KnowYourCaptchaGame() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState<"game" | "success">("game")
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [shuffledProviders, setShuffledProviders] = useState<CaptchaProvider[]>([])
  const [shuffledTypes, setShuffledTypes] = useState<CaptchaType[]>([])

  const baseProviders: CaptchaProvider[] = [
    {
      id: "datadome",
      name: "DataDome",
      description: "Bot protection platform",
      color: "bg-blue-100 border-blue-300 text-blue-800",
    },
    {
      id: "human",
      name: "Human Security (PerimeterX)",
      description: "Application security platform",
      color: "bg-purple-100 border-purple-300 text-purple-800",
    },
    {
      id: "cloudflare",
      name: "Cloudflare",
      description: "Web infrastructure & security",
      color: "bg-orange-100 border-orange-300 text-orange-800",
    },
    {
      id: "arkose",
      name: "Arkose Labs",
      description: "Fraud prevention platform",
      color: "bg-green-100 border-green-300 text-green-800",
    },
    {
      id: "google",
      name: "Google reCAPTCHA",
      description: "The original CAPTCHA service",
      color: "bg-red-100 border-red-300 text-red-800",
    },
  ]

  const baseCaptchaTypes: CaptchaType[] = [
    {
      id: "slider",
      type: "Slider Challenge",
      description: "Drag the slider to complete the puzzle",
      icon: "🎚️",
    },
    {
      id: "presshold",
      type: "Press & Hold",
      description: "Press and hold the button for 3 seconds",
      icon: "👆",
    },
    {
      id: "checkbox",
      type: "Check the Box",
      description: "Simply click 'I'm not a robot'",
      icon: "☑️",
    },
    {
      id: "puzzles",
      type: "Solve the Puzzles",
      description: "Complete interactive mini-games",
      icon: "🧩",
    },
    {
      id: "images",
      type: "Select Images",
      description: "Identify objects in image grids",
      icon: "🖼️",
    },
  ]

  const correctMatches = {
    datadome: "slider",
    human: "presshold",
    cloudflare: "checkbox",
    arkose: "puzzles",
    google: "images",
  }

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled arrays when game opens
  useEffect(() => {
    if (isVisible) {
      setShuffledProviders(shuffleArray(baseProviders))
      setShuffledTypes(shuffleArray(baseCaptchaTypes))
    }
  }, [isVisible])

  // Reset game state completely
  const resetGameState = () => {
    setMatches({})
    setSelectedProvider(null)
    setSelectedType(null)
    setIsComplete(false)
    setAttempts(0)
    setCurrentStep("game")
    // Reshuffle the arrays
    setShuffledProviders(shuffleArray(baseProviders))
    setShuffledTypes(shuffleArray(baseCaptchaTypes))
  }

  // Handle modal close - always reset
  const handleClose = () => {
    setIsVisible(false)
    // Reset everything when closing
    setTimeout(() => {
      resetGameState()
    }, 300) // Small delay to allow modal close animation
  }

  const handleProviderClick = (providerId: string) => {
    if (matches[providerId]) {
      // If already matched, remove the match
      const newMatches = { ...matches }
      delete newMatches[providerId]
      setMatches(newMatches)
    }
    setSelectedProvider(providerId)
    setSelectedType(null)
  }

  const handleTypeClick = (typeId: string) => {
    if (selectedProvider) {
      // Remove any existing match for this type
      const newMatches = { ...matches }
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === typeId) {
          delete newMatches[key]
        }
      })

      // Add new match
      newMatches[selectedProvider] = typeId
      setMatches(newMatches)
      setSelectedProvider(null)

      // Check if game is complete
      if (Object.keys(newMatches).length === 5) {
        checkCompletion(newMatches)
      }
    } else {
      setSelectedType(typeId)
    }
  }

  const checkCompletion = (currentMatches: Record<string, string>) => {
    const isCorrect = Object.keys(correctMatches).every(
      (provider) => currentMatches[provider] === correctMatches[provider],
    )

    if (isCorrect) {
      setIsComplete(true)
      setTimeout(() => setCurrentStep("success"), 1000)
    } else {
      setAttempts((prev) => prev + 1)
      // Show feedback for incorrect matches
      setTimeout(() => {
        setMatches({})
        setSelectedProvider(null)
        setSelectedType(null)
        // Reshuffle on incorrect attempt to make it harder
        setShuffledProviders(shuffleArray(baseProviders))
        setShuffledTypes(shuffleArray(baseCaptchaTypes))
      }, 2000)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    // Reset game state after completion
    setTimeout(() => {
      resetGameState()
    }, 300)
    // Trigger the CAPTCHA experience popup using a custom event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("captcha-game-complete"))
    }
  }

  const getMatchedType = (providerId: string) => {
    const typeId = matches[providerId]
    return shuffledTypes.find((type) => type.id === typeId)
  }

  const isTypeMatched = (typeId: string) => {
    return Object.values(matches).includes(typeId)
  }

  return (
    <>
      {/* Game Trigger Button */}
      <button
        onClick={() => setIsVisible(true)}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        🎮 Know Your CAPTCHA
      </button>

      {/* Game Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Game Step */}
            {currentStep === "game" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">🎮 Know Your CAPTCHA</h2>
                    <p className="text-gray-600">Match each CAPTCHA provider with their signature challenge type</p>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Clear Instructions */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">How to Play:</h3>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>
                          <strong>Click a CAPTCHA provider</strong> on the left (it will highlight in blue)
                        </li>
                        <li>
                          <strong>Click the matching challenge type</strong> on the right to connect them
                        </li>
                        <li>
                          <strong>Match all 5 pairs correctly</strong> to become a CAPTCHA expert!
                        </li>
                        <li>
                          <strong>Tip:</strong> Click a matched provider to disconnect and try again
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                {attempts > 0 && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                    <strong>Not quite right!</strong> The items have been reshuffled. Try again! (Attempt {attempts + 1}
                    )
                  </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* CAPTCHA Providers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      CAPTCHA Providers
                    </h3>
                    <div className="space-y-3">
                      {shuffledProviders.map((provider) => {
                        const matchedType = getMatchedType(provider.id)
                        return (
                          <div
                            key={provider.id}
                            onClick={() => handleProviderClick(provider.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedProvider === provider.id
                                ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                                : matchedType
                                  ? "border-green-500 bg-green-50"
                                  : provider.color + " hover:opacity-80"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{provider.name}</h4>
                                <p className="text-sm opacity-75">{provider.description}</p>
                              </div>
                              {matchedType && (
                                <div className="text-right">
                                  <div className="text-lg">{matchedType.icon}</div>
                                  <div className="text-xs font-medium">{matchedType.type}</div>
                                </div>
                              )}
                              {selectedProvider === provider.id && !matchedType && (
                                <div className="text-blue-600 font-semibold text-sm">Selected ✓</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* CAPTCHA Types */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      Challenge Types
                    </h3>
                    <div className="space-y-3">
                      {shuffledTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => handleTypeClick(type.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedType === type.id
                              ? "border-green-500 ring-2 ring-green-200 bg-green-50"
                              : isTypeMatched(type.id)
                                ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"
                                : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{type.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{type.type}</h4>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                            {isTypeMatched(type.id) && (
                              <div className="text-gray-500 text-sm font-medium">Matched ✓</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Progress: <strong>{Object.keys(matches).length}/5</strong> matches completed
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={resetGameState}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Shuffle className="w-4 h-4" />
                      Reset & Shuffle
                    </button>
                  </div>
                </div>

                {selectedProvider && !selectedType && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                    <strong>Step 2:</strong> You selected{" "}
                    <strong>{shuffledProviders.find((p) => p.id === selectedProvider)?.name}</strong>. Now click on
                    their matching challenge type on the right! →
                  </div>
                )}

                {!selectedProvider && Object.keys(matches).length < 5 && (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-gray-600 text-sm">
                    <strong>Step 1:</strong> Click on a CAPTCHA provider on the left to get started! ←
                  </div>
                )}
              </div>
            )}

            {/* Success Step */}
            {currentStep === "success" && (
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h2>
                  <p className="text-xl text-gray-600 mb-4">
                    You're officially a <strong>Visible CAPTCHA Expert!</strong>
                  </p>
                  <p className="text-gray-500">
                    You successfully matched all 5 CAPTCHA providers with their signature challenge types.
                  </p>
                  {attempts > 0 && <p className="text-sm text-gray-400 mt-2">Completed in {attempts + 1} attempts</p>}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Perfect Matches:</h3>
                  <div className="grid gap-3">
                    {baseProviders.map((provider) => {
                      const matchedType = baseCaptchaTypes.find((type) => type.id === correctMatches[provider.id])
                      return (
                        <div key={provider.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{provider.name}</span>
                          <span className="flex items-center gap-2">
                            {matchedType?.icon} {matchedType?.type}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Fun Fact:</strong> You just learned about 5 different types of user friction that invisible
                    CAPTCHAs eliminate entirely! Now experience the difference...
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                >
                  Experience the Invisible Alternative
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
