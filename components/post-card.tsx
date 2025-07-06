import Link from "next/link"
import { Calendar, Clock, Star } from "lucide-react"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors ${featured ? "border-2 border-green-500" : "border border-gray-700"}`}
    >
      {featured && (
        <div className="flex items-center gap-2 text-green-400 mb-3">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Featured</span>
        </div>
      )}

      <Link href={`/blog/${post.slug}`}>
        <h3 className="text-xl font-bold mb-3 hover:text-green-400 transition-colors">{post.title}</h3>
      </Link>

      <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  )
}
