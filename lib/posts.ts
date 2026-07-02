import data from "@/content/posts.json";

export type CategorySlug =
  | "loi-song-kiem"
  | "nuoc-va-suc-khoe"
  | "gia-dinh"
  | "phu-nu-40"
  | "kinh-doanh"
  | "phat-trien-ban-than";

export type Section = {
  heading: string;
  body: string[];
};

export type Post = {
  title: string;
  slug: string;
  description: string;
  category: CategorySlug | string;
  categoryName: string;
  date: string;
  updated: string;
  readingTime: string;
  author: string;
  tags: string[];
  featured?: boolean;
  content: {
    intro: string;
    sections: Section[];
    conclusion: string;
  };
};

export type Category = {
  name: string;
  slug: string;
  description: string;
};

export const categories = data.categories as Category[];
export const posts = data.posts as Post[];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getPostsByCategory(slug: string) {
  return posts.filter((post) => post.category === slug);
}

export function getFeaturedPosts() {
  return posts.filter((post) => post.featured);
}
