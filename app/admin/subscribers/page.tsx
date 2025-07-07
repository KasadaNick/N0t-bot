import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase"
import { SubscriberStats } from "@/components/admin/subscriber-stats"
import { SubscribersList } from "@/components/admin/subscribers-list"

async function getSubscriberStats() {
  if (!supabaseAdmin) {
    return { total: 0, active: 0, unsubscribed: 0, recent: 0 }
  }

  const { data: subscribers } = await supabaseAdmin.from("subscribers").select("status, created_at")

  if (!subscribers) {
    return { total: 0, active: 0, unsubscribed: 0, recent: 0 }
  }

  const total = subscribers.length
  const active = subscribers.filter((s) => s.status === "active").length
  const unsubscribed = subscribers.filter((s) => s.status === "unsubscribed").length

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recent = subscribers.filter((s) => new Date(s.created_at) > sevenDaysAgo).length

  return { total, active, unsubscribed, recent }
}

async function getRecentSubscribers() {
  if (!supabaseAdmin) {
    return []
  }

  const { data: subscribers } = await supabaseAdmin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return subscribers || []
}

export default async function AdminSubscribersPage() {
  const stats = await getSubscriberStats()
  const recentSubscribers = await getRecentSubscribers()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
        <p className="text-gray-600">Manage your newsletter subscribers and view analytics.</p>
      </div>

      <SubscriberStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
          <CardDescription>Latest newsletter subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscribersList subscribers={recentSubscribers} />
        </CardContent>
      </Card>
    </div>
  )
}
