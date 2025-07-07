"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null)

  if (state?.success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Thanks for subscribing!</h3>
            <p className="text-gray-600 mb-4">{state.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Subscribe another email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Subscribe to Our Newsletter
        </CardTitle>
        <CardDescription>
          Get the latest updates on invisible CAPTCHA technology and web security insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              disabled={isPending}
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>

          {state?.error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>{state.error}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
