import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Card = {
  key: string;
  han: string;
  title: string;
  subtitle: string;
  href: string;
  status: "Đang thử nghiệm" | "Sắp mở" | "Đang chuẩn bị";
  note: string;
};

const nguThuatCards: Card[] = [
  {
    key: "son",
    han: "山",
    title: "Sơn · Phong thủy an cư",
    subtitle: "Hướng nhà, bố cục không gian, Bát trạch và Phi tinh theo cách đọc có kiểm soát.",
    href: "/nguthuat/son/phongthu",
    status: "Sắp mở",
    note: "Dành cho không gian sống, hướng, khí và cách bố trí."
  },
  {
    key: "y",
    han: "醫",
    title: "Y · Y học cổ học",
    subtitle: "Dưỡng sinh, mùa tiết, khí huyết và các lớp kiến thức thân thể tham khảo.",
    href: "/nguthuat/y/yhoc",
    status: "Sắp mở",
    note: "Không thay thế tư vấn y tế, chỉ dùng như lớp học cổ học."
  },
  {
    key: "menh",
    han: "命",
    title: "Mệnh · Tứ Trụ",
    subtitle: "Lập bốn trụ từ ngày giờ sinh, đọc Can Chi, Ngũ hành, Tàng can và Thập thần.",
    href: "/nguthuat/menh/tutru",
    status: "Đang thử nghiệm",
    note: "App con đầu tiên của khu Ngũ thuật."
  },
  {
    key: "boc",
    han: "卜",
    title: "Bốc · Mai Hoa Dịch Số",
    subtitle: "Khu học và mô phỏng quẻ, tượng, số, 64 quẻ theo tinh thần tham khảo.",
    href: "/nguthuat/boc/maihoa",
    status: "Sắp mở",
    note: "Không dùng để quyết định thay người đọc."
  },
  {
    key: "tuong",
    han: "相",
    title: "Tướng · Xem tướng tham khảo",
    subtitle: "Học quan sát hình tướng, khí sắc và biểu hiện theo cách không định kiến.",
    href: "/nguthuat/tuong/xem-tuong",
    status: "Sắp mở",
    note: "Không phán xét con người qua ngoại hình."
  }
];

const tamThucCards: Card[] = [
  {
    key: "ky-mon",
    han: "奇",
    title: "Kỳ Môn",
    subtitle: "Khu học và thực hành bố cục Kỳ Môn theo lớp thời gian, cửa, sao và cung.",
    href: "/tam-thuc/ky-mon",
    status: "Sắp mở",
    note: "Giai đoạn đầu chỉ dựng khung tra cứu, chưa luận sâu."
  },
  {
    key: "thai-at",
    han: "太",
    title: "Thái Ất",
    subtitle: "Khu tham khảo Thái Ất theo hướng học cổ pháp, không phán đoán cực đoan.",
    href: "/tam-thuc/thai-at",
    status: "Sắp mở",
    note: "Giữ vai trò nhánh nghiên cứu sau."
  },
  {
    key: "luc-nham",
    han: "六",
    title: "Lục Nhâm",
    subtitle: "Khu mô phỏng và tra cứu Lục Nhâm, đặt trong hệ Tam thức của Hồn Thơ.",
    href: "/tam-thuc/luc-nham",
    status: "Sắp mở",
    note: "Sẽ mở rộng khi có dữ liệu và luật đọc đủ chắc."
  }
];

function currentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function App() {
  const path = currentPath();

  if (path === "/") return <AppHome />;
  if (path === "/nguthuat") return <NguThuatHome />;
  if (path === "/tam-thuc") return <TamThucHome />;

  const allCards = [...nguThuatCards, ...tamThucCards];
  const matched = allCards.find((item) => item.href === path);
  if (matched) return <PlaceholderPage card={matched} />;

  if (path === "/account") return <SimplePage title="Tài khoản" subtitle="Khu đăng nhập, hồ sơ và thông tin người dùng sẽ được nối sau." />;
  if (path === "/credits") return <SimplePage title="Tín dụng" subtitle="Khu số dư, nạp tín dụng và lịch sử giao dịch sẽ được nối sau." />;
  if (path === "/history") return <SimplePage title="Lịch sử tra cứu" subtitle="Khu lưu hồ sơ và xem lại các bản đọc đã tạo." />;

  return <NotFound />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell">
      <nav className="top-nav">
        <a className="brand" href="/">
          <span className="brand-mark">HT</span>
          <span>Hồn Thơ App</span>
        </a>
        <div className="nav-links">
          <a href="/nguthuat">Ngũ thuật</a>
          <a href="/tam-thuc">Tam thức</a>
          <a href="/account">Tài khoản</a>
          <a href="/credits">Tín dụng</a>
          <a href="/history">Lịch sử</a>
        </div>
      </nav>
      {children}
    </main>
  );
}

function AppHome() {
  return (
    <Shell>
      <section className="hero app-hero">
        <div className="moon-seal">玄</div>
        <p className="eyebrow">app.hontho.com</p>
        <h1>Khu ứng dụng Hồn Thơ</h1>
        <p className="lead">
          Một cổng chung cho các mini-app cổ học: Ngũ thuật, Tam thức, tài khoản, tín dụng và lịch sử tra cứu.
        </p>
        <div className="hero-actions">
          <a className="seal-button" href="/nguthuat">Mở Ngũ thuật</a>
          <a className="ghost-button" href="/tam-thuc">Mở Tam thức</a>
        </div>
      </section>

      <section className="portal-grid">
        <PortalCard
          han="五"
          title="Ngũ thuật"
          href="/nguthuat"
          text="Sơn · Y · Mệnh · Bốc · Tướng. Năm nhánh ứng dụng được gom vào một khu để dùng chung tài khoản, tín dụng và lịch sử."
        />
        <PortalCard
          han="三"
          title="Tam thức"
          href="/tam-thuc"
          text="Kỳ Môn · Thái Ất · Lục Nhâm. Khu thực hành và tra cứu sẽ mở dần sau, cùng chung nền app.hontho.com."
        />
      </section>

      <section className="soft-panel">
        <h2>Vì sao tách sang khu app?</h2>
        <div className="reason-grid">
          <p>Web Hồn Thơ chính dùng cho nội dung, bài viết và SEO.</p>
          <p>Khu app dùng cho nhập liệu, lưu hồ sơ, lịch sử tra cứu và tín dụng.</p>
          <p>Người dùng chỉ cần một tài khoản cho nhiều mini-app sau này.</p>
        </div>
      </section>
    </Shell>
  );
}

function NguThuatHome() {
  return (
    <Shell>
      <section className="hero branch-hero">
        <p className="eyebrow">Sơn · Y · Mệnh · Bốc · Tướng</p>
        <h1>Ngũ thuật ứng dụng</h1>
        <p className="lead">
          Năm cửa nhìn vào cổ học phương Đông. Mỗi nhánh là một mini-app riêng, nhưng cùng nằm trong một khu quản lý.
        </p>
      </section>

      <section className="cards-grid five">
        {nguThuatCards.map((card) => <BranchCard card={card} key={card.key} />)}
      </section>
    </Shell>
  );
}

function TamThucHome() {
  return (
    <Shell>
      <section className="hero branch-hero">
        <p className="eyebrow">Kỳ Môn · Thái Ất · Lục Nhâm</p>
        <h1>Tam thức</h1>
        <p className="lead">
          Ba nhánh cổ pháp được đặt trong khu app riêng để sau này có thể tra cứu, lưu hồ sơ và mở rộng thành công cụ thực hành.
        </p>
      </section>

      <section className="cards-grid three">
        {tamThucCards.map((card) => <BranchCard card={card} key={card.key} />)}
      </section>

      <section className="soft-panel">
        <h2>Giai đoạn đầu</h2>
        <p>
          Tam thức hiện là khu giữ chỗ trong kiến trúc app. Khi có dữ liệu và quy tắc đủ chắc, từng nhánh sẽ được mở thành app riêng.
        </p>
      </section>
    </Shell>
  );
}

function PortalCard({ han, title, text, href }: { han: string; title: string; text: string; href: string }) {
  return (
    <a href={href} className="portal-card">
      <span className="han">{han}</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <b>Vào khu này</b>
    </a>
  );
}

function BranchCard({ card }: { card: Card }) {
  return (
    <a href={card.href} className="branch-card">
      <div className="branch-top">
        <span className="branch-han">{card.han}</span>
        <span className="status">{card.status}</span>
      </div>
      <h2>{card.title}</h2>
      <p>{card.subtitle}</p>
      <small>{card.note}</small>
    </a>
  );
}

function PlaceholderPage({ card }: { card: Card }) {
  return (
    <Shell>
      <section className="placeholder">
        <span className="branch-han big">{card.han}</span>
        <p className="eyebrow">{card.status}</p>
        <h1>{card.title}</h1>
        <p className="lead">{card.subtitle}</p>
        <div className="notice">
          Đây là route giữ chỗ. Sau này mini-app thật sẽ được gắn vào đúng vị trí này, không để từng app đứng riêng lẻ.
        </div>
        <div className="hero-actions">
          <a className="ghost-button" href={card.href.startsWith("/tam-thuc") ? "/tam-thuc" : "/nguthuat"}>Về trang nhánh</a>
          <a className="seal-button" href="/">Về khu app</a>
        </div>
      </section>
    </Shell>
  );
}

function SimplePage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Shell>
      <section className="placeholder">
        <p className="eyebrow">Đang chuẩn bị</p>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
      </section>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <section className="placeholder">
        <p className="eyebrow">404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="lead">Đường dẫn này chưa có trong khu ứng dụng Hồn Thơ.</p>
        <div className="hero-actions">
          <a className="seal-button" href="/">Về trang chủ app</a>
        </div>
      </section>
    </Shell>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
