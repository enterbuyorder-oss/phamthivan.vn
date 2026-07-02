import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Phạm Thị Vân để hợp tác nội dung, truyền thông, tư vấn hoặc booking chia sẻ.",
  alternates: { canonical: "/lien-he" }
};

export default function ContactPage() {
  return (
    <main className="section">
      <div className="container grid two">
        <div>
          <span className="kicker">Liên hệ</span>
          <h1>Kết nối với Vân</h1>
          <p className="lead">Trang này dùng cho hợp tác nội dung, booking chia sẻ, tư vấn hoặc kết nối công việc.</p>
          <div className="panel">
            <p><strong>Email:</strong> vanpt@enterbuy.vn</p>
            <p><strong>Website:</strong> phamthivan.vn</p>
          </div>
        </div>
      </div>
    </main>
  );
}
