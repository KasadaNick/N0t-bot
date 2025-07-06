export const metadata = {
  title: "About | n0t.bot",
  description: "Learn about n0t.bot and our mission to improve human verification systems.",
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-invert prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-8">About n0t.bot</h1>

        <p className="text-xl text-gray-300 mb-8">
          We're building the future of human verification - one that doesn't frustrate users or waste their time with
          impossible puzzles.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 mb-6">
          Traditional CAPTCHAs have become a barrier between businesses and their customers. Our invisible CAPTCHA
          technology provides robust bot protection without the user friction.
        </p>

        <h2 className="text-2xl font-bold mb-4">The Problem</h2>
        <p className="text-gray-300 mb-6">
          Current CAPTCHA systems often fail humans while being easily solved by sophisticated bots. This creates a
          paradox where the very people you want to protect are the ones being blocked.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
        <p className="text-gray-300 mb-6">
          Invisible verification that works in the background, analyzing user behavior patterns and device
          characteristics to distinguish humans from bots - all without interrupting the user experience.
        </p>
      </div>
    </div>
  )
}
