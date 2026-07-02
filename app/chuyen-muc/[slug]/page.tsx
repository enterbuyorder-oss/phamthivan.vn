import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/chuyen-muc/${category.slug}` }
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return notFound();
  const categoryPosts = getPostsByCategory(category.slug);

  return (
    <main className="section">
      <div className="container">
        <span className="kicker">Chuyên mục</span>
        <h1>{category.name}</h1>
        <p className="lead">{category.description}</p>
        <div className="grid">
          {categoryPosts.map((post) => <PostCard post={post} key={post.slug} />)}
        </div>
      </div>
    </main>
  );
}
