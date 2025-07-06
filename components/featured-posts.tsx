import { PostCard } from "./post-card"
import type { Post } from "@/lib/posts"

interface FeaturedPostsProps {
  posts: Post[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Posts</h2>
          <p className="text-xl text-gray-400">Our most important insights on invisible CAPTCHA technology</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} featured />
          ))}
        </div>
      </div>
    </section>
  )
}
