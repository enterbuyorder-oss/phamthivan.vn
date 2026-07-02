import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, posts } from "@/lib/posts";
import JsonLd from "@/components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Không tìm thấy bài viết"
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://phamthivan.vn/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author]
    }
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  return (
    <main className="article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated,
          author: { "@type": "Person", name: post.author, url: "https://phamthivan.vn/gioi-thieu" },
          mainEntityOfPage: `https://phamthivan.vn/blog/${post.slug}`
        }}
      />
      <Link className="tag" href={`/chuyen-muc/${post.category}`}>{post.categoryName}</Link>
      <h1>{post.title}</h1>
      <div className="article-meta">
        Tác giả: {post.author} · Cập nhật: {post.updated} · {post.readingTime}
      </div>

      <p><strong>{post.description}</strong></p>
      <p>{post.content.intro}</p>

      <div className="toc">
        <strong>Mục lục</strong>
        <ol>
          {post.content.sections.map((section) => <li key={section.heading}>{section.heading}</li>)}
        </ol>
      </div>

      {post.content.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      <div className="note">
        <strong>Kết luận:</strong> {post.content.conclusion}
      </div>
    </main>
  );
}
