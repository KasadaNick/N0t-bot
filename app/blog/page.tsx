import { getAllPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { CaptchaExperiencePopup } from "@/components/captcha-experience-popup"

export const metadata = {
  title: "Blog | n0t.bot",
  description: "All blog posts about invisible CAPTCHA technology and human verification.",
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-400">
            Insights on invisible CAPTCHA technology and human verification systems.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* The CAPTCHA Experience Popup */}
      <CaptchaExperiencePopup />
    </>
  )
}
