export interface SessionLog {
  id: string
  isBot: boolean
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

export const sessionLogs: SessionLog[] = [
  // Bot logs with technical inconsistencies
  {
    id: "bot_001",
    isBot: true,
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
    id: "bot_002",
    isBot: true,
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
    id: "bot_003",
    isBot: true,
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
  {
    id: "bot_004",
    isBot: true,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Android"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      platform: "Linux armv8l",
      language: "en-US",
    },
    webgl: {
      vendor: "Intel Inc.",
      renderer: "Intel(R) UHD Graphics 630",
    },
    network: {
      ip: "203.0.113.67",
      asn: "AS20940 Akamai International B.V.",
      location: "London, England, GB",
      timezone: "Europe/London",
    },
  },
  {
    id: "bot_005",
    isBot: true,
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
  // Human logs with consistent technical details
  {
    id: "human_001",
    isBot: false,
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
    id: "human_002",
    isBot: false,
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
    id: "human_003",
    isBot: false,
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
  {
    id: "human_004",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Android"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      platform: "Linux armv8l",
      language: "en-US",
    },
    webgl: {
      vendor: "Qualcomm",
      renderer: "Adreno (TM) 740",
    },
    network: {
      ip: "198.51.100.78",
      asn: "AS20001 T-Mobile USA",
      location: "Miami, FL, US",
      timezone: "America/New_York",
    },
  },
  {
    id: "human_005",
    isBot: false,
    requestHeaders: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
      "Accept-Language": "en-US,en;q=0.5",
    },
    navigator: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (AMD)",
      renderer: "ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "203.0.113.91",
      asn: "AS7922 Comcast Cable Communications",
      location: "Phoenix, AZ, US",
      timezone: "America/Phoenix",
    },
  },
  {
    id: "human_006",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Linux"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "Linux x86_64",
      language: "en-US",
    },
    webgl: {
      vendor: "Mesa",
      renderer: "Mesa Intel(R) UHD Graphics 620 (KBL GT2)",
    },
    network: {
      ip: "198.51.100.45",
      asn: "AS701 Verizon Business",
      location: "Boston, MA, US",
      timezone: "America/New_York",
    },
  },
  {
    id: "human_007",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"macOS"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      platform: "MacIntel",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (Intel)",
      renderer: "ANGLE (Intel, Intel Iris Pro OpenGL Engine, OpenGL 4.1)",
    },
    network: {
      ip: "203.0.113.67",
      asn: "AS20057 AT&T Mobility LLC",
      location: "Austin, TX, US",
      timezone: "America/Chicago",
    },
  },
  {
    id: "human_008",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
      "Sec-CH-UA": '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Windows"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
      platform: "Win32",
      language: "en-US",
    },
    webgl: {
      vendor: "Google Inc. (NVIDIA)",
      renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
    },
    network: {
      ip: "198.51.100.123",
      asn: "AS7922 Comcast Cable Communications",
      location: "Portland, OR, US",
      timezone: "America/Los_Angeles",
    },
  },
  {
    id: "human_009",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
      platform: "iPad",
      language: "en-US",
    },
    webgl: {
      vendor: "Apple Inc.",
      renderer: "Apple A15 Bionic GPU",
    },
    network: {
      ip: "203.0.113.89",
      asn: "AS20001 T-Mobile USA",
      location: "Atlanta, GA, US",
      timezone: "America/New_York",
    },
  },
  {
    id: "human_010",
    isBot: false,
    requestHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      "Sec-CH-UA": '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      "Sec-CH-UA-Platform": '"Android"',
      "Accept-Language": "en-US,en;q=0.9",
    },
    navigator: {
      userAgent:
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      platform: "Linux armv8l",
      language: "en-US",
    },
    webgl: {
      vendor: "Qualcomm",
      renderer: "Adreno (TM) 740",
    },
    network: {
      ip: "198.51.100.156",
      asn: "AS20057 AT&T Mobility LLC",
      location: "Dallas, TX, US",
      timezone: "America/Chicago",
    },
  },
]
