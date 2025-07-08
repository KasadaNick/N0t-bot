import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameData, userScore, logs, weightedScore, skillLevel } = body

    // Generate a unique challenge ID
    const challengeId = Math.random().toString(36).substr(2, 12)

    // In a real app, you'd store this in a database
    // For now, we'll encode the data in the challenge ID
    const challengeData = {
      id: challengeId,
      challengerScore: userScore,
      challengerWeightedScore: weightedScore,
      challengerSkillLevel: skillLevel,
      logs: logs,
      createdAt: new Date().toISOString(),
    }

    // Encode the challenge data (in production, store in database)
    const encodedData = Buffer.from(JSON.stringify(challengeData)).toString("base64")

    return NextResponse.json({
      challengeId,
      challengeUrl: `/challenge/${challengeId}`,
      encodedData, // This would be stored in DB in production
    })
  } catch (error) {
    console.error("Error creating challenge:", error)
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
  }
}
