import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://phamthivan.vn"),
  title: {
    default: "Phạm Thị Vân - Sống khỏe, chủ động và truyền cảm hứng",
    template: "%s | Phạm Thị Vân"
  },
  description: "Website thương hiệu cá nhân Phạm Thị Vân: lối sống kiềm, nước và sức khỏe, gia đình, kinh doanh và phát triển bản thân.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Phạm Thị Vân",
    description: "Sống khỏe, chủ động và truyền cảm hứng cho gia đình Việt.",
    url: "https://phamthivan.vn",
    siteName: "Phạm Thị Vân",
    locale: "vi_VN",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
