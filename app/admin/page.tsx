 "use client";

import { useMemo, useState } from "react";

type Category = {
  name: string;
  slug: string;
  description: string;
};

type Section = {
  heading: string;
  body: string[];
};

type Post = {
  title: string;
  slug: string;
  description: string;
  category: string;
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

type BlogData = {
  categories: Category[];
  posts: Post[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function emptyPost(categories: Category[]): Post {
  const first = categories[0] || { name: "Lối sống kiềm", slug: "loi-song-kiem" };
  return {
    title: "Bài viết mới",
    slug: "bai-viet-moi",
    description: "Mô tả SEO ngắn gọn cho bài viết mới.",
    category: first.slug,
    categoryName: first.name,
    date: today(),
    updated: today(),
    readingTime: "5 phút đọc",
    author: "Phạm Thị Vân",
    tags: ["từ khóa chính", "từ khóa phụ"],
    featured: false,
    content: {
      intro: "Viết đoạn mở bài tại đây.",
      sections: [
        {
          heading: "1. Ý chính đầu tiên",
          body: ["Viết nội dung đoạn 1.", "Viết nội dung đoạn 2."]
        },
        {
          heading: "2. Ý chính thứ hai",
          body: ["Viết nội dung đoạn 1.", "Viết nội dung đoạn 2."]
        }
      ],
      conclusion: "Viết kết luận tại đây."
    }
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState<BlogData | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const selectedPost = useMemo(() => {
    if (!data) return null;
    return data.posts.find((post) => post.slug === selectedSlug) || data.posts[0] || null;
  }, [data, selectedSlug]);

  async function loadPosts() {
    setError("");
    setStatus("Đang tải dữ liệu bài viết...");
    const res = await fetch(`/api/admin/posts?password=${encodeURIComponent(password)}`);
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Không đăng nhập được.");
      setStatus("");
      return;
    }

    setData(json.data);
    setLogged(true);
    setSelectedSlug(json.data.posts?.[0]?.slug || "");
    setStatus(json.warning || "Đã tải dữ liệu blog.");
  }

  function updatePost(patch: Partial<Post>) {
    if (!data || !selectedPost) return;

    const nextPosts = data.posts.map((post) => {
      if (post.slug !== selectedPost.slug) return post;
      const next = { ...post, ...patch };

      if (patch.category) {
        const category = data.categories.find((item) => item.slug === patch.category);
        if (category) next.categoryName = category.name;
      }

      return next;
    });

    const nextData = { ...data, posts: nextPosts };
    setData(nextData);

    if (patch.slug) setSelectedSlug(patch.slug);
  }

  function updateContent(patch: Partial<Post["content"]>) {
    if (!selectedPost) return;
    updatePost({ content: { ...selectedPost.content, ...patch } });
  }

  function updateSection(index: number, patch: Partial<Section>) {
    if (!selectedPost) return;
    const sections = selectedPost.content.sections.map((section, i) =>
      i === index ? { ...section, ...patch } : section
    );
    updateContent({ sections });
  }

  function addSection() {
    if (!selectedPost) return;
    updateContent({
      sections: [
        ...selectedPost.content.sections,
        { heading: `${selectedPost.content.sections.length + 1}. Ý chính mới`, body: ["Nội dung đoạn mới."] }
      ]
    });
  }

  function removeSection(index: number) {
    if (!selectedPost) return;
    updateContent({
      sections: selectedPost.content.sections.filter((_, i) => i !== index)
    });
  }

  function addPost() {
    if (!data) return;
    const post = emptyPost(data.categories);
    let slug = post.slug;
    let counter = 1;
    while (data.posts.some((item) => item.slug === slug)) {
      counter += 1;
      slug = `${post.slug}-${counter}`;
    }
    post.slug = slug;
    setData({ ...data, posts: [post, ...data.posts] });
    setSelectedSlug(slug);
  }

  function duplicatePost() {
    if (!data || !selectedPost) return;
    const copy = {
      ...selectedPost,
      title: `${selectedPost.title} - Bản sao`,
      slug: `${selectedPost.slug}-ban-sao`,
      date: today(),
      updated: today(),
      featured: false
    };
    let slug = copy.slug;
    let counter = 1;
    while (data.posts.some((item) => item.slug === slug)) {
      counter += 1;
      slug = `${copy.slug}-${counter}`;
    }
    copy.slug = slug;
    setData({ ...data, posts: [copy, ...data.posts] });
    setSelectedSlug(slug);
  }

  function deletePost() {
    if (!data || !selectedPost) return;
    const ok = window.confirm(`Xóa bài "${selectedPost.title}"?`);
    if (!ok) return;
    const nextPosts = data.posts.filter((post) => post.slug !== selectedPost.slug);
    setData({ ...data, posts: nextPosts });
    setSelectedSlug(nextPosts[0]?.slug || "");
  }

  async function saveAll() {
    if (!data) return;
    setError("");
    setStatus("Đang lưu lên GitHub...");

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, data })
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Lưu thất bại.");
      setStatus("");
      return;
    }

    setStatus(json.message || "Đã lưu thành công.");
  }

  if (!logged) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <span className="kicker">Admin Blog</span>
          <h1>Đăng nhập quản trị</h1>
          <p className="lead">Nhập mật khẩu ADMIN_PASSWORD đã cài trong Vercel để vào giao diện viết bài.</p>
          <div className="panel">
            <label>Mật khẩu admin</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
            />
            <button className="btn" onClick={loadPosts}>Đăng nhập</button>
            {error && <div className="status error">{error}</div>}
            {status && <div className="status">{status}</div>}
          </div>
        </div>
      </main>
    );
  }

  if (!data || !selectedPost) {
    return (
      <main className="section">
        <div className="container">
          <h1>Chưa có dữ liệu bài viết</h1>
          <button className="btn" onClick={addPost}>Tạo bài đầu tiên</button>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <span className="kicker">Admin Blog</span>
        <h1>Quản trị bài viết</h1>
        <p className="lead">Giao diện viết bài giống WordPress cơ bản: tạo bài, sửa SEO, sửa nội dung, lưu lên GitHub.</p>

        <div className="btn-row" style={{ marginBottom: 18 }}>
          <button className="btn" onClick={saveAll}>Lưu lên GitHub</button>
          <button className="btn secondary" onClick={addPost}>Tạo bài mới</button>
          <button className="btn secondary" onClick={duplicatePost}>Nhân bản bài</button>
          <button className="btn danger" onClick={deletePost}>Xóa bài</button>
        </div>

        {status && <div className="status ok">{status}</div>}
        {error && <div className="status error">{error}</div>}

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <strong>Danh sách bài viết</strong>
            <p className="meta">{data.posts.length} bài</p>
            {data.posts.map((post) => (
              <div
                className={`admin-post ${post.slug === selectedSlug ? "active" : ""}`}
                key={post.slug}
                onClick={() => setSelectedSlug(post.slug)}
              >
                <strong>{post.title}</strong>
                <div className="meta">/{post.slug}</div>
              </div>
            ))}
          </aside>

          <section className="admin-editor">
            <h2>Soạn bài</h2>

            <label>Tiêu đề SEO / H1</label>
            <input
              className="input"
              value={selectedPost.title}
              onChange={(event) => {
                const title = event.target.value;
                updatePost({ title });
              }}
            />

            <div className="admin-row">
              <div>
                <label>Slug URL</label>
                <input
                  className="input"
                  value={selectedPost.slug}
                  onChange={(event) => updatePost({ slug: slugify(event.target.value) })}
                />
              </div>
              <div>
                <label>Chuyên mục</label>
                <select
                  className="select"
                  value={selectedPost.category}
                  onChange={(event) => updatePost({ category: event.target.value })}
                >
                  {data.categories.map((category) => (
                    <option value={category.slug} key={category.slug}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label>Meta Description</label>
            <textarea
              className="textarea"
              value={selectedPost.description}
              onChange={(event) => updatePost({ description: event.target.value })}
            />

            <div className="admin-row">
              <div>
                <label>Ngày đăng</label>
                <input className="input" value={selectedPost.date} onChange={(event) => updatePost({ date: event.target.value })} />
              </div>
              <div>
                <label>Ngày cập nhật</label>
                <input className="input" value={selectedPost.updated} onChange={(event) => updatePost({ updated: event.target.value })} />
              </div>
            </div>

            <div className="admin-row">
              <div>
                <label>Thời gian đọc</label>
                <input className="input" value={selectedPost.readingTime} onChange={(event) => updatePost({ readingTime: event.target.value })} />
              </div>
              <div>
                <label>Tác giả</label>
                <input className="input" value={selectedPost.author} onChange={(event) => updatePost({ author: event.target.value })} />
              </div>
            </div>

            <label>Tags, cách nhau bằng dấu phẩy</label>
            <input
              className="input"
              value={selectedPost.tags.join(", ")}
              onChange={(event) => updatePost({ tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })}
            />

            <label>
              <input
                type="checkbox"
                checked={Boolean(selectedPost.featured)}
                onChange={(event) => updatePost({ featured: event.target.checked })}
              />{" "}
              Đưa ra trang chủ
            </label>

            <h2 style={{ marginTop: 28 }}>Nội dung bài viết</h2>
            <label>Mở bài</label>
            <textarea
              className="textarea"
              value={selectedPost.content.intro}
              onChange={(event) => updateContent({ intro: event.target.value })}
            />

            {selectedPost.content.sections.map((section, index) => (
              <div className="admin-section" key={`${section.heading}-${index}`}>
                <label>Tiêu đề H2</label>
                <input
                  className="input"
                  value={section.heading}
                  onChange={(event) => updateSection(index, { heading: event.target.value })}
                />

                <label>Nội dung đoạn văn, mỗi đoạn cách nhau bằng một dòng trống</label>
                <textarea
                  className="textarea"
                  value={section.body.join("\n\n")}
                  onChange={(event) =>
                    updateSection(index, {
                      body: event.target.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
                    })
                  }
                />

                <button className="btn danger" onClick={() => removeSection(index)}>Xóa mục này</button>
              </div>
            ))}

            <button className="btn secondary" onClick={addSection}>Thêm H2 mới</button>

            <label style={{ display: "block", marginTop: 20 }}>Kết luận</label>
            <textarea
              className="textarea"
              value={selectedPost.content.conclusion}
              onChange={(event) => updateContent({ conclusion: event.target.value })}
            />

            <div className="note">
              <strong>URL sau khi đăng:</strong> https://phamthivan.vn/blog/{selectedPost.slug}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
