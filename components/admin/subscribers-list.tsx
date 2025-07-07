import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Subscriber } from "@/lib/supabase"

interface SubscribersListProps {
  subscribers: Subscriber[]
}

export function SubscribersList({ subscribers }: SubscribersListProps) {
  if (subscribers.length === 0) {
    return <div className="text-center py-8 text-gray-500">No subscribers found.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Subscribed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.map((subscriber) => (
          <TableRow key={subscriber.id}>
            <TableCell className="font-medium">{subscriber.email}</TableCell>
            <TableCell>
              <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>{subscriber.status}</Badge>
            </TableCell>
            <TableCell>{subscriber.source}</TableCell>
            <TableCell>{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
