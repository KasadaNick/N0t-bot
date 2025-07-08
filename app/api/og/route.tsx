import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const score = searchParams.get("score") || "0"
  const skillLevel = searchParams.get("skillLevel") || "Learning"
  const hardCorrect = searchParams.get("hardCorrect") || "0"
  const difficulty = searchParams.get("difficulty") || "medium"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a2e",
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          padding: "60px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
          }}
        >
          🤖 Bot Detection Challenge
        </div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#4ade80",
            marginBottom: "10px",
          }}
        >
          {skillLevel} Level: {score} points
        </div>

        {Number.parseInt(hardCorrect) > 0 && (
          <div
            style={{
              fontSize: "32px",
              color: "#fbbf24",
              marginBottom: "20px",
            }}
          >
            🎯 Caught {hardCorrect} hard patterns!
          </div>
        )}

        <div
          style={{
            fontSize: "28px",
            color: "#e5e7eb",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Can you beat my score?
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#a855f7",
            fontWeight: "bold",
          }}
        >
          Powered by Kasada
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
