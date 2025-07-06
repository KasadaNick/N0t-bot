import { PostCard } from "./post-card"
import type { Post } from "@/lib/posts"
import Link from "next/link"

interface RecentPostsProps {
  posts: Post[]
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Recent Posts</h2>
            <p className="text-xl text-gray-400">Latest insights and updates</p>
          </div>
          <Link href="/blog" className="text-green-400 hover:text-green-300 font-semibold">
            View All Posts →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
