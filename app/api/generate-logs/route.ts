import { type NextRequest, NextResponse } from "next/server"

export interface SessionLog {
  id: string
  isBot: boolean
  difficulty: "easy" | "medium" | "hard"
  pattern: string
  requestHeaders: {
    "User-Agent": string
    "Sec-CH-UA"?: string
    "Sec-CH-UA-Platform"?: string
    "Accept-Language": string
  }
  navigator: {
    userAgent: string
    platform: string
    language: string
  }
  webgl: {
    vendor: string
    renderer: string
  }
  network: {
    ip: string
    asn: string
    location: string
    timezone: string
  }
}

const easyBotLogs: Omit<SessionLog, "id">[] = [
  {
    isBot: true,
    difficulty: "easy",
    pattern: "iphone-desktop-gpu",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "NVIDIA Corporation",
      renderer: "NVIDIA GeForce RTX 4090/PCIe/SSE2",
    },
    network: {
      ip: "203.0.113.45",
      asn: "AS7922 Comcast Cable Communications",
      location: "San Francisco, CA, US",
      timezone: "America/Los_Angeles",
    },
  },
  {
    isBot: true,
    difficulty: "easy",
    pattern: "firefox-chrome-headers",
    requestHeaders: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.5",
    },
    navigator: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (Intel)",
      renderer: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "198.51.100.23",
      asn: "AS7922 Comcast Cable Communications",
      location: "Chicago, IL, US",
      timezone: "America/Chicago",
    },
  },
  {
    isBot: true,
    difficulty: "easy",
    pattern: "cloud-infrastructure",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "MacIntel",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (Apple)",
      renderer: "ANGLE (Apple, Apple M2 Pro, OpenGL 4.1)",
    },
    network: {
      ip: "54.239.28.85",
      asn: "AS16509 Amazon.com, Inc.",
      location: "Ashburn, VA, US",
      timezone: "UTC",
    },
  },
]

const mediumBotLogs: Omit<SessionLog, "id">[] = [
  {
    isBot: true,
    difficulty: "medium",
    pattern: "version-mismatch",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (NVIDIA)",
      renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "198.51.100.89",
      asn: "AS7922 Comcast Cable Communications",
      location: "Denver, CO, US",
      timezone: "America/Denver",
    },
  },
  {
    isBot: true,
    difficulty: "medium",
    pattern: "missing-headers",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (NVIDIA)",
      renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "203.0.113.67",
      asn: "AS7922 Comcast Cable Communications",
      location: "Portland, OR, US",
      timezone: "America/Los_Angeles",
    },
  },
]

const hardBotLogs: Omit<SessionLog, "id">[] = [
  {
    isBot: true,
    difficulty: "hard",
    pattern: "minor-version-diff",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="118", "Chromium";v="118", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.1.0 Safari/537.36",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (NVIDIA)",
      renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "203.0.113.67",
      asn: "AS7922 Comcast Cable Communications",
      location: "Portland, OR, US",
      timezone: "America/Los_Angeles",
    },
  },
]

const humanLogs: Omit<SessionLog, "id">[] = [
  {
    isBot: false,
    difficulty: "easy",
    pattern: "consistent-human",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (NVIDIA)",
      renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "203.0.113.12",
      asn: "AS7922 Comcast Cable Communications",
      location: "Seattle, WA, US",
      timezone: "America/Los_Angeles",
    },
  },
  {
    isBot: false,
    difficulty: "medium",
    pattern: "consistent-human",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
      platform: "MacIntel",
      language: "en-US",
    },
    webgl: {
      vendor: "Apple Inc.",
      renderer: "Apple M2 Pro",
    },
    network: {
      ip: "198.51.100.34",
      asn: "AS701 Verizon Business",
      location: "New York, NY, US",
      timezone: "America/New_York",
    },
  },
  {
    isBot: false,
    difficulty: "hard",
    pattern: "consistent-human",
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      language: "en-US",
    },
    webgl: {
      vendor: "Apple Inc.",
      renderer: "Apple A17 Pro GPU",
    },
    network: {
      ip: "203.0.113.56",
      asn: "AS20001 T-Mobile USA",
      location: "Los Angeles, CA, US",
      timezone: "America/Los_Angeles",
    },
  },
]

function generateLogId(): string {
  return Math.random().toString(36).substr(2, 9)
}

function selectLogsByDifficulty(difficulty: string, performance: any): SessionLog[] {
  const logs: SessionLog[] = []

  // Determine bot/human ratio based on difficulty
  let botCount: number
  let easyBots: number, mediumBots: number, hardBots: number

  switch (difficulty) {
    case "easy":
      botCount = 5
      easyBots = 4
      mediumBots = 1
      hardBots = 0
      break
    case "medium":
      botCount = 6
      easyBots = 2
      mediumBots = 3
      hardBots = 1
      break
    case "hard":
      botCount = 7
      easyBots = 1
      mediumBots = 3
      hardBots = 3
      break
    default:
      botCount = 5
      easyBots = 3
      mediumBots = 2
      hardBots = 0
  }

  // Add bot logs
  for (let i = 0; i < easyBots; i++) {
    const log = { ...easyBotLogs[i % easyBotLogs.length], id: generateLogId() }
    logs.push(log)
  }

  for (let i = 0; i < mediumBots; i++) {
    const log = { ...mediumBotLogs[i % mediumBotLogs.length], id: generateLogId() }
    logs.push(log)
  }

  for (let i = 0; i < hardBots; i++) {
    const log = { ...hardBotLogs[i % hardBotLogs.length], id: generateLogId() }
    logs.push(log)
  }

  // Add human logs to reach 15 total
  const humanCount = 15 - botCount
  for (let i = 0; i < humanCount; i++) {
    const log = { ...humanLogs[i % humanLogs.length], id: generateLogId() }
    logs.push(log)
  }

  // Shuffle the logs
  return logs.sort(() => Math.random() - 0.5)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get("difficulty") || "medium"
  const performanceData = searchParams.get("performance")

  let performance = {}
  if (performanceData) {
    try {
      performance = JSON.parse(performanceData)
    } catch (e) {
      console.error("Failed to parse performance data:", e)
    }
  }

  const logs = selectLogsByDifficulty(difficulty, performance)

  return NextResponse.json({ logs })
}
