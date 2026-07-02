import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Không tìm thấy chuyên mục"
    };
  }

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/chuyen-muc/${category.slug}` }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

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
