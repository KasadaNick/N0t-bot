"use client"

import type React from "react"

import { useState } from "react"
import { Mail } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    // Simulate form submission
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thanks for subscribing!</h3>
        <p className="text-gray-400">You'll receive our latest insights on invisible CAPTCHA technology.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  )
}
