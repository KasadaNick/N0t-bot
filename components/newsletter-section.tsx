import { NewsletterForm } from "./newsletter-form"

export function NewsletterSection() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-xl text-gray-400 mb-8">
          Get the latest insights on invisible CAPTCHA technology delivered to your inbox.
        </p>

        <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
