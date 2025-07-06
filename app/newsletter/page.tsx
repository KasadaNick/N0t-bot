import { NewsletterForm } from "@/components/newsletter-form"

export const metadata = {
  title: "Newsletter | n0t.bot",
  description: "Subscribe to our newsletter for updates on invisible CAPTCHA technology.",
}

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Newsletter</h1>
        <p className="text-xl text-gray-400">
          Stay updated with the latest insights on invisible CAPTCHA technology and human verification systems.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-8">
        <NewsletterForm />
      </div>
    </div>
  )
}
