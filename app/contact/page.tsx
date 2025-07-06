import { Mail } from "lucide-react"

export const metadata = {
  title: "Contact | n0t.bot",
  description: "Get in touch with the n0t.bot team.",
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-400">
          Have questions about invisible CAPTCHA technology? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 text-green-400" />
          <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
          <p className="text-gray-400 mb-6">
            For inquiries about invisible CAPTCHA technology, partnerships, or technical discussions.
          </p>
          <a
            href="mailto:nick@kasada.io"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Mail className="w-4 h-4" />
            nick@kasada.io
          </a>
        </div>
      </div>
    </div>
  )
}
