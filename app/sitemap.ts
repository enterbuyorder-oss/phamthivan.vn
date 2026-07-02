import type { MetadataRoute } from "next";
import { categories, posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://phamthivan.vn";

  const staticRoutes = ["", "/blog", "/gioi-thieu", "/lien-he", "/admin"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated)
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/chuyen-muc/${category.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
