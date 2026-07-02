import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card">
      <Link className="tag" href={`/chuyen-muc/${post.category}`}>{post.categoryName}</Link>
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.description}</p>
      <div className="meta">{post.date} · {post.readingTime}</div>
    </article>
  );
}
