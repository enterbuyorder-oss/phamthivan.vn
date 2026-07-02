import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Câu chuyện thương hiệu cá nhân Phạm Thị Vân.",
  alternates: { canonical: "/gioi-thieu" }
};

export default function AboutPage() {
  return (
    <main className="article">
      <span className="kicker">Giới thiệu</span>
      <h1>Phạm Thị Vân</h1>
      <div className="article-meta">Doanh nhân · Người chia sẻ lối sống lành mạnh · Người truyền cảm hứng</div>
      <p>Website này là ngôi nhà nội dung riêng của Vân, nơi hệ thống hóa trải nghiệm, bài học và góc nhìn về sức khỏe, gia đình, kinh doanh và phát triển bản thân.</p>
      <h2>Những điều Vân thường chia sẻ</h2>
      <ul>
        <li>Lối sống kiềm, ăn uống lành mạnh và dinh dưỡng thật.</li>
        <li>Nước và sức khỏe gia đình.</li>
        <li>Làm mẹ, đồng hành cùng con và xây dựng gia đình tích cực.</li>
        <li>Hành trình doanh nhân, thương hiệu cá nhân và phát triển bản thân.</li>
      </ul>
    </main>
  );
}
