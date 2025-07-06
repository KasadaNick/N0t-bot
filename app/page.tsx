import { getAllPosts, getFeaturedPosts } from "@/lib/posts"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { FeaturedPosts } from "@/components/featured-posts"
import { RecentPosts } from "@/components/recent-posts"
import { NewsletterSection } from "@/components/newsletter-section"

export default async function HomePage() {
  const allPosts = await getAllPosts()
  const featuredPosts = await getFeaturedPosts()
  const recentPosts = allPosts.slice(0, 6)

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      {featuredPosts.length > 0 && <FeaturedPosts posts={featuredPosts} />}
      <RecentPosts posts={recentPosts} />
      <NewsletterSection />
    </div>
  )
}
