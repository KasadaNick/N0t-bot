import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Post {
  title: string
  excerpt: string
  date: string
  readTime: string
  featured: boolean
  slug: string
  content: string
}

const postsDirectory = path.join(process.cwd(), "posts")

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    ensurePostsDirectory()
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data, content } = matter(fileContents)

        return {
          slug,
          content,
          title: data.title || "Untitled",
          excerpt: data.excerpt || "",
          date: data.date || new Date().toISOString().split("T")[0],
          readTime: data.readTime || "5 min read",
          featured: data.featured || false,
        } as Post
      })

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error("Error reading posts:", error)
    return []
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.featured)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    ensurePostsDirectory()
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      date: data.date || new Date().toISOString().split("T")[0],
      readTime: data.readTime || "5 min read",
      featured: data.featured || false,
    } as Post
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}
