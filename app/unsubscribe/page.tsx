import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import { unsubscribeFromNewsletter } from "@/app/actions/newsletter"

async function UnsubscribeContent({ token }: { token: string }) {
  if (!token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Invalid Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>This unsubscribe link is invalid or has expired.</p>
        </CardContent>
      </Card>
    )
  }

  const result = await unsubscribeFromNewsletter(token)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${result.success ? "text-green-600" : "text-red-600"}`}>
          {result.success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Unsubscribed Successfully
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              Unsubscribe Failed
            </>
          )}
        </CardTitle>
        <CardDescription>{result.success ? result.message : result.error}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <Button asChild>
            <a href="/">Return to Homepage</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p>Processing unsubscribe request...</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <UnsubscribeContent token={searchParams.token || ""} />
      </Suspense>
    </div>
  )
}
