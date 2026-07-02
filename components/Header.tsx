import Link from "next/link";

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/blog", label: "Blog" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/admin", label: "Admin" }
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <span className="brand-mark">V</span>
          <span>Phạm Thị Vân</span>
        </Link>
        <nav className="menu">
          {nav.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
