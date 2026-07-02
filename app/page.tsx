import Link from "next/link";
import { categories, getFeaturedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";

export default function HomePage() {
  const featured = getFeaturedPosts();
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Phạm Thị Vân",
          url: "https://phamthivan.vn",
          jobTitle: "Doanh nhân, nhà sáng tạo nội dung",
          description: "Người chia sẻ lối sống lành mạnh, nước và sức khỏe, gia đình và phát triển bản thân."
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="kicker">Thương hiệu cá nhân</span>
            <h1>Sống khỏe, chủ động và truyền cảm hứng mỗi ngày</h1>
            <p className="lead">
              Nơi Vân chia sẻ trải nghiệm thật về lối sống kiềm, nước và sức khỏe, gia đình, kinh doanh và hành trình phát triển bản thân.
            </p>
            <div className="btn-row">
              <Link className="btn" href="/blog">Đọc Blog</Link>
              <Link className="btn secondary" href="/admin">Vào Admin</Link>
            </div>
          </div>
          <div className="panel">
            <h2>Thông điệp chính</h2>
            <p>Sức khỏe không chỉ đến từ một sản phẩm, mà đến từ cách mỗi người chọn uống nước, ăn uống, vận động, nghỉ ngơi, yêu thương và sống có ý nghĩa.</p>
            <ul>
              <li>Lối sống kiềm và dinh dưỡng thật</li>
              <li>Nước sạch, nước tốt và sức khỏe gia đình</li>
              <li>Làm mẹ, làm vợ, làm doanh nhân một cách chủ động</li>
              <li>Chạy bộ, yoga, kỷ luật và phát triển bản thân</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <div>
              <span className="kicker">Bài viết nổi bật</span>
              <h2>Những chủ đề Vân đang chia sẻ</h2>
              <p className="lead">Các bài viết mẫu đã có sẵn để chị chỉnh sửa và phát triển thành blog SEO dài hạn.</p>
            </div>
            <Link href="/blog">Xem tất cả bài viết</Link>
          </div>
          <div className="grid">
            {featured.map((post) => <PostCard post={post} key={post.slug} />)}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <h2>Chuyên mục nội dung</h2>
          <p className="lead">Mỗi chuyên mục là một trụ cột SEO cho thương hiệu cá nhân phamthivan.vn.</p>
          <div className="category-grid">
            {categories.map((category) => (
              <Link className="category-card" href={`/chuyen-muc/${category.slug}`} key={category.slug}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
