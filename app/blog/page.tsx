import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { posts, categories } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Phạm Thị Vân về lối sống kiềm, nước và sức khỏe, gia đình, kinh doanh và phát triển bản thân.",
  alternates: { canonical: "/blog" }
};

export default function BlogPage() {
  return (
    <main className="section">
      <div className="container">
        <span className="kicker">Blog chuẩn SEO</span>
        <h1>Blog Phạm Thị Vân</h1>
        <p className="lead">
          Nơi lưu lại các bài viết chuyên sâu, có cấu trúc rõ ràng, dễ đọc và phù hợp để phát triển SEO dài hạn.
        </p>

        <div className="category-grid" style={{ marginBottom: 34 }}>
          {categories.map((category) => (
            <Link className="category-card" href={`/chuyen-muc/${category.slug}`} key={category.slug}>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>

        <div className="grid">
          {posts.map((post) => <PostCard post={post} key={post.slug} />)}
        </div>
      </div>
    </main>
  );
}
