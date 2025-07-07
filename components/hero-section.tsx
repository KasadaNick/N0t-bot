import { KnowYourCaptchaGame } from "./know-your-captcha-game"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-green-400">n0t.bot</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Technical insights on invisible CAPTCHA technology and human verification systems that don't frustrate your
          users.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/blog"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Read the Blog
          </a>
          <KnowYourCaptchaGame />
          <a
            href="/newsletter"
            className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Subscribe
          </a>
        </div>
      </div>
    </section>
  )
}
