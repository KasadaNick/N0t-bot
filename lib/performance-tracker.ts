export interface UserPerformance {
  totalGames: number
  bestWeightedScore: number
  bestSimpleScore: number
  currentStreak: number
  bestStreak: number
  difficultyLevel: "easy" | "medium" | "hard"
  skillLevel: "Learning" | "Beginner" | "Intermediate" | "Advanced" | "Expert"
  lastPlayed: string
  difficultyPerformance: {
    easy: { totalAttempts: number; correct: number; avgPoints: number }
    medium: { totalAttempts: number; correct: number; avgPoints: number }
    hard: { totalAttempts: number; correct: number; avgPoints: number }
  }
  patternAccuracy: Record<string, { attempts: number; correct: number; difficulty: string }>
}

export const SCORING_WEIGHTS = {
  easy: { correct: 1, incorrect: -0.5 },
  medium: { correct: 2, incorrect: -1 },
  hard: { correct: 4, incorrect: -1 },
}

export function getDefaultPerformance(): UserPerformance {
  return {
    totalGames: 0,
    bestWeightedScore: 0,
    bestSimpleScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    difficultyLevel: "medium",
    skillLevel: "Learning",
    lastPlayed: "",
    difficultyPerformance: {
      easy: { totalAttempts: 0, correct: 0, avgPoints: 0 },
      medium: { totalAttempts: 0, correct: 0, avgPoints: 0 },
      hard: { totalAttempts: 0, correct: 0, avgPoints: 0 },
    },
    patternAccuracy: {},
  }
}

export function loadUserPerformance(): UserPerformance {
  if (typeof window === "undefined") return getDefaultPerformance()

  try {
    const stored = localStorage.getItem("kasada-bot-detection-performance")
    if (stored) {
      return { ...getDefaultPerformance(), ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("Error loading user performance:", error)
  }

  return getDefaultPerformance()
}

export function saveUserPerformance(performance: UserPerformance): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("kasada-bot-detection-performance", JSON.stringify(performance))
  } catch (error) {
    console.error("Error saving user performance:", error)
  }
}

export function calculateWeightedScore(answers: Array<{ isCorrect: boolean; logDifficulty: string }>): number {
  let totalPoints = 0
  let maxPossiblePoints = 0

  answers.forEach((answer) => {
    const difficulty = answer.logDifficulty as keyof typeof SCORING_WEIGHTS
    const weights = SCORING_WEIGHTS[difficulty] || SCORING_WEIGHTS.medium

    maxPossiblePoints += weights.correct
    totalPoints += answer.isCorrect ? weights.correct : weights.incorrect
  })

  totalPoints = Math.max(0, totalPoints)
  return maxPossiblePoints > 0 ? Math.round((totalPoints / maxPossiblePoints) * 100) : 0
}

export function getSkillLevel(weightedScore: number, hardCorrect: number): string {
  if (weightedScore >= 90) return "Expert"
  if (weightedScore >= 80) return "Advanced"
  if (weightedScore >= 70) return "Intermediate"
  if (weightedScore >= 60) return "Beginner"
  if (hardCorrect > 0 && weightedScore >= 55) return "Advanced" // Bonus for hard patterns
  return "Learning"
}

export function updatePerformanceAfterGame(
  performance: UserPerformance,
  answers: Array<{ isCorrect: boolean; logDifficulty: string; pattern: string }>,
  weightedScore: number,
  simpleScore: number,
): UserPerformance {
  const updated = { ...performance }

  // Update basic stats
  updated.totalGames += 1
  updated.bestWeightedScore = Math.max(updated.bestWeightedScore, weightedScore)
  updated.bestSimpleScore = Math.max(updated.bestSimpleScore, simpleScore)
  updated.lastPlayed = new Date().toISOString()

  // Update streak
  const allCorrect = answers.every((a) => a.isCorrect)
  if (allCorrect) {
    updated.currentStreak += 1
    updated.bestStreak = Math.max(updated.bestStreak, updated.currentStreak)
  } else {
    updated.currentStreak = 0
  }

  // Update difficulty performance
  answers.forEach((answer) => {
    const difficulty = answer.logDifficulty as keyof typeof updated.difficultyPerformance
    if (updated.difficultyPerformance[difficulty]) {
      updated.difficultyPerformance[difficulty].totalAttempts += 1
      if (answer.isCorrect) {
        updated.difficultyPerformance[difficulty].correct += 1
      }

      // Recalculate average points
      const perf = updated.difficultyPerformance[difficulty]
      perf.avgPoints = perf.totalAttempts > 0 ? perf.correct / perf.totalAttempts : 0
    }

    // Update pattern accuracy
    if (!updated.patternAccuracy[answer.pattern]) {
      updated.patternAccuracy[answer.pattern] = {
        attempts: 0,
        correct: 0,
        difficulty: answer.logDifficulty,
      }
    }

    updated.patternAccuracy[answer.pattern].attempts += 1
    if (answer.isCorrect) {
      updated.patternAccuracy[answer.pattern].correct += 1
    }
  })

  // Update skill level
  const hardCorrect = answers.filter((a) => a.logDifficulty === "hard" && a.isCorrect).length
  updated.skillLevel = getSkillLevel(weightedScore, hardCorrect) as UserPerformance["skillLevel"]

  return updated
}

export function adaptDifficulty(performance: UserPerformance, recentAnswers: boolean[]): "easy" | "medium" | "hard" {
  // Check recent performance (last 3 answers)
  const recent = recentAnswers.slice(-3)

  if (recent.length >= 3) {
    const allCorrect = recent.every((correct) => correct)
    const allWrong = recent.every((correct) => !correct)

    if (allCorrect && performance.difficultyLevel !== "hard") {
      // Increase difficulty
      return performance.difficultyLevel === "easy" ? "medium" : "hard"
    } else if (allWrong && performance.difficultyLevel !== "easy") {
      // Decrease difficulty
      return performance.difficultyLevel === "hard" ? "medium" : "easy"
    }
  }

  return performance.difficultyLevel
}
