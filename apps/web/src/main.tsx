import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function route() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function Shell({ children, activePage }: { children: React.ReactNode; activePage?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <a href="/" className="brand">
          <img src="/images/app-home/bg-app-home-hero.webp" className="brand-seal" alt="" aria-hidden="true" />
          <span className="brand-full">Cổ học App</span>
          <span className="brand-short">Cổ học</span>
        </a>
        <div className="nav-links nav-desktop">
          <a href="/nguthuat" className={activePage === "nguthuat" ? "nav-active" : ""}>
            <span className="nav-icon">☯</span> Ngũ thuật
          </a>
          <a href="/tam-thuc" className={activePage === "tamthuc" ? "nav-active" : ""}>
            <span className="nav-icon">◎</span> Tam thức
          </a>
          <a href="/account"><span className="nav-icon">👤</span> Tài khoản</a>
          <a href="/history"><span className="nav-icon">🕐</span> Lịch sử</a>
        </div>
        <button
          className="nav-hamburger"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="ham-bar" />
          <span className="ham-bar" />
          <span className="ham-bar" />
        </button>
      </nav>
      {menuOpen && (
        <div className="nav-dropdown" onClick={() => setMenuOpen(false)}>
          <a href="/nguthuat" className={activePage === "nguthuat" ? "nav-active" : ""}>
            <span className="nav-icon">☯</span> Ngũ thuật
          </a>
          <a href="/tam-thuc" className={activePage === "tamthuc" ? "nav-active" : ""}>
            <span className="nav-icon">◎</span> Tam thức
          </a>
          <a href="/account"><span className="nav-icon">👤</span> Tài khoản</a>
          <a href="/history"><span className="nav-icon">🕐</span> Lịch sử</a>
        </div>
      )}
      {children}
      <footer className="site-footer">
        <span className="footer-seal">☯</span>
        <span>Cổ học – Tra cứu và thực hành có kiểm soát.</span>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <div className="home-hero" style={{ backgroundImage: "url('/images/app-home/bg-app-home-hero.webp')" }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <div className="ornament">◆</div>
          <h1>Khu ứng dụng Cổ học</h1>
          <p className="lead">
            Không gian ứng dụng cổ học – nơi tra cứu, thực hành<br />
            và tham khảo có kiểm soát, thận trọng và hệ thống.
          </p>
        </div>
      </div>

      <div className="home-portals-wrap">
        <div className="home-portals">
          <a className="portal-card portal-nguthuat" href="/nguthuat"
            style={{ backgroundImage: "url('/images/app-home/portal-nguthuat.webp')" }}>
            <div className="portal-overlay" />
            <div className="portal-content">
              <div className="portal-symbol">☯</div>
              <h2>Ngũ thuật</h2>
              <div className="portal-divider">◆</div>
              <p className="portal-sub">Sơn · Y · Mệnh · Bốc · Tướng</p>
              <div className="portal-divider-line" />
              <span className="portal-btn">Vào Ngũ thuật <span>›</span></span>
            </div>
          </a>
          <a className="portal-card portal-tamthuc" href="/tam-thuc"
            style={{ backgroundImage: "url('/images/app-home/portal-tamthuc.webp')" }}>
            <div className="portal-overlay" />
            <div className="portal-content">
              <div className="portal-symbol">◎</div>
              <h2>Tam thức</h2>
              <div className="portal-divider">◆</div>
              <p className="portal-sub">Kỳ Môn · Thái Ất · Lục Nhâm</p>
              <div className="portal-divider-line" />
              <span className="portal-btn">Vào Tam thức <span>›</span></span>
            </div>
          </a>
        </div>
      </div>

      <div className="home-cards-wrap">
        <div className="home-cards">
          <div className="info-card">
            <img src="/images/app-home/card-account.webp" className="info-card-img" alt="Tài khoản" />
            <div className="info-card-body">
              <h3>Tài khoản</h3>
              <p>Quản lý thông tin cá nhân, bảo mật và tuỳ chọn sử dụng.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
          <div className="info-card">
            <img src="/images/app-home/card-history.webp" className="info-card-img" alt="Lịch sử" />
            <div className="info-card-body">
              <h3>Lịch sử tra cứu</h3>
              <p>Xem lại các lần tra cứu, thực hành và ghi chú.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
          <div className="info-card">
            <img src="/images/app-home/card-credits.webp" className="info-card-img" alt="Tín dụng" />
            <div className="info-card-body">
              <h3>Tín dụng</h3>
              <p>Quản lý tín dụng, gói dịch vụ và lịch sử giao dịch.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const nguThuatCards = [
  {
    key: "son",
    title: "Sơn",
    sub: "Phong thủy an cư",
    desc: "Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống.",
    icon: "/images/nguthuat/icon-son.webp",
    art: "/images/nguthuat/home-cards/ui-nguthuat-card-son-art.png",
    href: "/nguthuat/son",
  },
  {
    key: "y",
    title: "Y",
    sub: "Y học cổ học",
    desc: "Kiến thức dưỡng sinh, mùa tiết, thân thể và khí huyết tham khảo.",
    icon: "/images/nguthuat/icon-y.webp",
    art: "/images/nguthuat/home-cards/ui-nguthuat-card-y-art.png",
    href: "/nguthuat/y",
  },
  {
    key: "menh",
    title: "Mệnh",
    sub: "Tứ Trụ",
    desc: "Lập bốn trụ từ ngày giờ sinh, đọc Can Chi, Ngũ hành và Thập thần.",
    icon: "/images/nguthuat/icon-menh.webp",
    art: "/images/nguthuat/home-cards/ui-nguthuat-card-menh-art.png",
    href: "/nguthuat/menh",
  },
  {
    key: "boc",
    title: "Bốc",
    sub: "Mai Hoa · 64 quẻ",
    desc: "Lập quẻ tham khảo, học tượng số và cách đọc có giới hạn.",
    icon: "/images/nguthuat/icon-boc.webp",
    art: "/images/nguthuat/home-cards/ui-nguthuat-card-boc-art.png",
    href: "/nguthuat/boc",
  },
  {
    key: "tuong",
    title: "Tướng",
    sub: "Xem tướng tham khảo",
    desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người.",
    icon: "/images/nguthuat/icon-tuong.webp",
    art: "/images/nguthuat/home-cards/ui-nguthuat-card-tuong-art.png",
    href: "/nguthuat/tuong",
  },
];

function NguThuatHub() {
  return (
    <Shell activePage="nguthuat">
      <div className="page-hero" style={{ backgroundImage: "url('/images/nguthuat/bg-nguthuat-hero.webp')" }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb"><a href="/">🏠</a> / <a href="/">Trang chủ</a> / <span>Ngũ thuật</span></div>
          <div className="ornament">◆</div>
          <h1>Ngũ thuật</h1>
          <p className="lead">
            Cổng ứng dụng thực hành có kiểm soát, hỗ trợ tra cứu, tham khảo<br />
            và thực hành theo tri thức cổ học.
          </p>
        </div>
      </div>

      <div className="branch-cards-wrap">
        <div className="branch-cards five">
          {nguThuatCards.map((card) => (
            <a key={card.key} className="branch-card" href={card.href}>
              <div className="branch-card-inner">
                <div className="branch-card-art">
                  <img src={card.art} className="branch-card-art-img" alt={card.title} />
                </div>
                <h2>{card.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-sub">{card.sub}</p>
                <p className="branch-desc">{card.desc}</p>
                <span className="branch-btn">Mở mục <span>›</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="principles-bar">
        <div className="principle">
          <div className="principle-icon">🛡</div>
          <div>
            <strong>Tra cứu có kiểm soát</strong>
            <p>Nội dung được biên soạn chọn lọc, hệ thống kiểm soát đầu vào và đầu ra, hạn chế diễn giải cực đoan.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">📖</div>
          <div>
            <strong>Minh bạch nguồn tham khảo</strong>
            <p>Dựa trên sách cổ, tài liệu học thuật và hệ thống chú giải rõ ràng, có trích dẫn nguồn.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">⚖</div>
          <div>
            <strong>Không phán đoán cực đoan</strong>
            <p>Ứng dụng hỗ trợ tham khảo và thực hành, không thay thế tư duy độc lập và trách nhiệm cá nhân.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

interface NguThuatBranchApp {
  key: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  image?: string;
  note?: string;
  status?: "ready" | "comingSoon";
}

interface NguThuatBranchLandingConfig {
  title: string;
  subtitle: string;
  desc: string;
  heroImage: string;
  icon: string;
  apps: NguThuatBranchApp[];
}

const NGU_THUAT_BRANCH_LANDINGS: Record<string, NguThuatBranchLandingConfig> = {
  "/nguthuat/son": {
    title: "Sơn",
    subtitle: "Phong thủy an cư",
    desc: "Cổng nhánh Sơn tập trung vào phong thủy an cư, hướng nhà, Bát trạch và bố cục không gian sống.",
    heroImage: "/images/nguthuat/son/ui-son-hero-bg-phong-thuy.png",
    icon: "/images/nguthuat/icon-son.webp",
    apps: [
      {
        key: "phong-thuy",
        title: "Phong thủy an cư",
        desc: "Tra cứu hướng nhà, Đông Tây tứ mệnh, Bát trạch và phân vùng bố trí không gian theo tri thức cổ học.",
        href: "/nguthuat/son/phongthu",
        cta: "Mở Phong thủy",
        image: "/images/nguthuat/son/ui-son-phong-thuy-an-cu-card.png",
      },
    ],
  },
  "/nguthuat/y": {
    title: "Y",
    subtitle: "Y học cổ học",
    desc: "Cổng nhánh Y phục vụ tham khảo dưỡng sinh, tiết khí, khí huyết và cách ứng dụng thận trọng trong đời sống.",
    heroImage: "/images/nguthuat/y/ui-y-hero-bg-yhoc.png",
    icon: "/images/nguthuat/icon-y.webp",
    apps: [
      {
        key: "y-hoc",
        title: "Y học cổ học",
        desc: "Mở hệ thống tham khảo dưỡng sinh, tiết khí và cân bằng cơ thể theo góc nhìn y học cổ truyền.",
        href: "/nguthuat/y/yhoc",
        cta: "Mở Y học",
        image: "/images/nguthuat/y/ui-y-yhoc-co-hoc-card.png",
      },
    ],
  },
  "/nguthuat/boc": {
    title: "Bốc",
    subtitle: "Mai Hoa Dịch số",
    desc: "Cổng nhánh Bốc hướng đến lập quẻ tham khảo, học cách đọc quẻ và đặt giới hạn diễn giải rõ ràng.",
    heroImage: "/images/nguthuat/boc/ui-boc-hero-bg-maihoa.png",
    icon: "/images/nguthuat/icon-boc.webp",
    apps: [
      {
        key: "mai-hoa",
        title: "Mai Hoa Dịch số",
        desc: "Vào công cụ lập quẻ và tham khảo cách đọc 64 quẻ theo hướng học hiểu, không khẳng định tuyệt đối.",
        href: "/nguthuat/boc/maihoa",
        cta: "Mở Mai Hoa",
        image: "/images/nguthuat/boc/ui-boc-mai-hoa-card.png",
      },
    ],
  },
  "/nguthuat/menh": {
    title: "Mệnh",
    subtitle: "Can Chi và cấu trúc mệnh",
    desc: "Cổng nhánh Mệnh là nơi quy tụ các công cụ đọc mệnh theo dữ liệu ngày giờ sinh và hệ thống Can Chi.",
    heroImage: "/images/nguthuat/menh/ui-menh-hero-bg-luan-menh.png",
    icon: "/images/nguthuat/icon-menh.webp",
    apps: [
      {
        key: "tu-tru",
        title: "Tứ Trụ",
        desc: "Lưu ý: Tứ Trụ là app con full page, mở trong không gian riêng để tra cứu chi tiết.",
        href: "/nguthuat/menh/tutru/",
        cta: "Mở Tứ Trụ",
        image: "/images/nguthuat/menh/ui-menh-tu-tru-card.png",
        note: "App con full page",
      },
      {
        key: "tu-vi",
        title: "Tử Vi",
        desc: "Ứng dụng Tử Vi sẽ được chuẩn bị sau, phục vụ học hiểu hệ thống cung, sao và vận hạn theo hướng tham khảo.",
        href: "/nguthuat/menh/tu-vi",
        cta: "Sắp mở",
        image: "/images/nguthuat/menh/ui-menh-tu-vi-card.png",
        note: "Đang chuẩn bị",
        status: "comingSoon",
      },
    ],
  },
  "/nguthuat/tuong": {
    title: "Tướng",
    subtitle: "Quan sát và học hiểu",
    desc: "Cổng nhánh Tướng tập trung vào hướng học quan sát, tôn trọng bối cảnh và tránh định kiến với con người.",
    heroImage: "/images/nguthuat/tuong/ui-tuong-hero-bg-xem-tuong.png",
    icon: "/images/nguthuat/icon-tuong.webp",
    apps: [
      {
        key: "xem-tuong",
        title: "Xem tướng tham khảo",
        desc: "Vào mục học tập và tham khảo cách quan sát hình tướng theo tinh thần thận trọng và có giới hạn.",
        href: "/nguthuat/tuong/xem-tuong",
        cta: "Mở Xem tướng",
        image: "/images/nguthuat/tuong/ui-tuong-xem-tuong-card.png",
      },
    ],
  },
};

function NguThuatBranchLanding({ cfg }: { cfg: NguThuatBranchLandingConfig }) {
  return (
    <Shell activePage="nguthuat">
      <div className="page-hero" style={{ backgroundImage: `url('${cfg.heroImage}')` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <a href="/">🏠</a> / <a href="/">Trang chủ</a> / <a href="/nguthuat">Ngũ thuật</a> / <span>{cfg.title}</span>
          </div>
          <div className="ornament">◆</div>
          <h1>{cfg.title}</h1>
          <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: ".08em", marginBottom: "16px" }}>{cfg.subtitle}</p>
          <p className="lead">{cfg.desc}</p>
        </div>
      </div>

      <div className="branch-cards-wrap">
        <div className={`branch-cards branch-cards-gateway${cfg.apps.length > 1 ? " branch-cards-gateway-two" : ""}`}>
          {cfg.apps.map((app) => (
            <a
              key={app.key}
              className={`branch-card branch-card-gateway${app.status === "comingSoon" ? " branch-card-soon" : ""}`}
              href={app.href}
            >
              <div className="branch-card-inner">
                {app.image ? (
                  <div className="branch-gateway-art">
                    <img src={app.image} className="branch-gateway-art-img" alt={app.title} />
                  </div>
                ) : (
                  <img src={cfg.icon} className="branch-icon" alt={cfg.title} />
                )}
                <h2>{app.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-desc">{app.desc}</p>
                {app.status === "comingSoon" ? <p className="branch-gateway-state">Đang chuẩn bị</p> : null}
                {app.note ? <p className="branch-gateway-note">{app.note}</p> : null}
                <span className={`branch-btn${app.status === "comingSoon" ? " branch-btn-soon" : ""}`}>
                  {app.cta} <span>›</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="placeholder-body branch-landing-actions">
        <div className="placeholder-btn-row">
          <a className="ph-btn-primary" href="/nguthuat">← Quay về Ngũ thuật</a>
          <a className="ph-btn-secondary" href="/">Về trang chủ App</a>
        </div>
      </div>
    </Shell>
  );
}

const tamThucCards = [
  {
    key: "ky-mon",
    title: "Kỳ Môn",
    sub: "Kỳ Môn Độn Giáp",
    desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị.",
    icon: "/images/tam-thuc/icon-ky-mon.webp",
    href: "/tam-thuc/ky-mon",
  },
  {
    key: "thai-at",
    title: "Thái Ất",
    sub: "Thái Ất Thần Số",
    desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất.",
    icon: "/images/tam-thuc/icon-thai-at.webp",
    href: "/tam-thuc/thai-at",
  },
  {
    key: "luc-nham",
    title: "Lục Nhâm",
    sub: "Đại Lục Nhâm",
    desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế.",
    icon: "/images/tam-thuc/icon-luc-nham.webp",
    href: "/tam-thuc/luc-nham",
  },
];

function TamThucHub() {
  return (
    <Shell activePage="tamthuc">
      <div className="page-hero" style={{ backgroundImage: "url('/images/tam-thuc/bg-tamthuc-hero.webp')" }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb"><a href="/">🏠</a> / <a href="/">Trang chủ</a> / <span>Tam thức</span></div>
          <div className="ornament">◆</div>
          <h1>Tam thức</h1>
          <p className="lead">
            Khu vực hệ thống hoá các bộ môn Tam thức – thực dụng, ứng nghiệm,<br />
            phục vụ tra cứu, tham khảo và ứng dụng thực hành.
          </p>
        </div>
      </div>

      <div className="branch-cards-wrap">
        <div className="branch-cards three">
          {tamThucCards.map((card) => (
            <a key={card.key} className="branch-card branch-card-lg" href={card.href}>
              <div className="branch-card-inner">
                <img src={card.icon} className="branch-icon branch-icon-lg" alt={card.title} />
                <h2>{card.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-desc">{card.desc}</p>
                <span className="branch-btn">Khám phá <span>›</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="principles-bar">
        <div className="principle">
          <div className="principle-icon">📚</div>
          <div>
            <strong>Tham khảo có hệ thống</strong>
            <p>Tổng hợp kiến thức cổ học một cách có cấu trúc, dễ tra cứu và đối chiếu.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">✒</div>
          <div>
            <strong>Giữ ngôn từ thận trọng</strong>
            <p>Không khẳng định tuyệt đối, ưu tiên cách diễn giải khách quan.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">🧘</div>
          <div>
            <strong>Ưu tiên học hiểu trước khi ứng dụng</strong>
            <p>Hiểu đúng bản chất, vận dụng đúng bối cảnh, tránh mê tín và lệ thuộc.</p>
          </div>
        </div>
      </div>

      <div className="tamthuc-footer-quote">
        <span className="lotus">🪷</span>
        <em>Học để hiểu đạo lý, dùng để thuận tự nhiên, hành sự có căn cứ, tâm an mà trí sáng.</em>
        <span className="lotus">🪷</span>
      </div>
    </Shell>
  );
}

interface PlaceholderConfig {
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  parent: string;
  parentHref: string;
  grandParent?: string;
  grandParentHref?: string;
}

function PlaceholderPage({ cfg }: { cfg: PlaceholderConfig }) {
  const { title, subtitle, icon, desc, parent, parentHref, grandParent, grandParentHref } = cfg;
  return (
    <Shell>
      <div className="placeholder-hero">
        <div className="breadcrumb">
          <a href="/">🏠</a>
          {" / "}
          {grandParent && grandParentHref
            ? <><a href={grandParentHref}>{grandParent}</a>{" / "}</>
            : null}
          <a href={parentHref}>{parent}</a>
          {" / "}
          <span>{title}</span>
        </div>
        <div className="placeholder-icon">{icon}</div>
        <h1>{title}</h1>
        {subtitle && <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: ".08em", marginBottom: "16px" }}>{subtitle}</p>}
        <p className="lead">{desc}</p>
      </div>
      <div className="placeholder-body">
        <div className="placeholder-notice">
          <strong>Ứng dụng đang được chuẩn bị</strong>
          Nội dung sẽ được biên soạn theo hướng tra cứu có kiểm soát, không phán đoán cực đoan.
          Thông tin mang tính tham khảo, không thay thế phán xét độc lập của người dùng.
        </div>
        <div className="placeholder-btn-row">
          <a className="ph-btn-primary" href={parentHref}>← Quay về {parent}</a>
          <a className="ph-btn-secondary" href="/">Về trang chủ App</a>
        </div>
      </div>
    </Shell>
  );
}

function TuTruRedirect() {
  React.useEffect(() => {
    window.location.replace('/nguthuat/menh/tutru/');
  }, []);
  return null;
}

const PLACEHOLDER_ROUTES: Record<string, PlaceholderConfig> = {
  "/nguthuat/son/phongthu": {
    title: "Sơn - Phong thủy an cư",
    subtitle: "Phong thủy · Bát trạch · Phi tinh",
    icon: "🏔",
    desc: "Tra cứu phong thủy an cư, Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống theo tri thức cổ học.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  // Note: /nguthuat/boc/maihoa now has a standalone app - redirects in staticAppRedirects
  "/nguthuat/menh/tu-vi": {
    title: "Tử Vi - Đang chuẩn bị",
    subtitle: "Tử Vi · Cung sao · Tham khảo",
    icon: "✦",
    desc: "Ứng dụng Tử Vi đang được chuẩn bị, phục vụ học hiểu hệ thống cung, sao và vận hạn theo hướng tham khảo. Nội dung không dùng để kết luận số phận tuyệt đối.",
    parent: "Mệnh",
    parentHref: "/nguthuat/menh",
    grandParent: "Ngũ thuật",
    grandParentHref: "/nguthuat",
  },
  "/nguthuat/tuong/xem-tuong": {
    title: "Tướng - Xem tướng tham khảo",
    subtitle: "Tướng học · Quan sát · Học hỏi",
    icon: "👁",
    desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người. Nội dung mang tính tham khảo học thuật.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/ky-mon": {
    title: "Kỳ Môn",
    subtitle: "Kỳ Môn Độn Giáp",
    icon: "🧭",
    desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị theo Kỳ Môn Độn Giáp.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/thai-at": {
    title: "Thái Ất",
    subtitle: "Thái Ất Thần Số",
    icon: "🌙",
    desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất. Tham khảo có kiểm soát.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/luc-nham": {
    title: "Lục Nhâm",
    subtitle: "Đại Lục Nhâm",
    icon: "⚖",
    desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế theo Đại Lục Nhâm.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/account": {
    title: "Tài khoản",
    subtitle: "",
    icon: "👤",
    desc: "Quản lý thông tin cá nhân, bảo mật và tuỳ chọn sử dụng. Tính năng đang được phát triển.",
    parent: "Trang chủ",
    parentHref: "/",
  },
  "/history": {
    title: "Lịch sử tra cứu",
    subtitle: "",
    icon: "🕐",
    desc: "Xem lại các lần tra cứu, thực hành và ghi chú. Tính năng đang được phát triển.",
    parent: "Trang chủ",
    parentHref: "/",
  },
};

function App() {
  const path = route();
  if (path === "/nguthuat") return <NguThuatHub />;
  if (path === "/tam-thuc") return <TamThucHub />;
  const nguThuatLanding = NGU_THUAT_BRANCH_LANDINGS[path];
  if (nguThuatLanding) return <NguThuatBranchLanding cfg={nguThuatLanding} />;
  if (path === "/nguthuat/menh/tutru") return <TuTruRedirect />;
  const ph = PLACEHOLDER_ROUTES[path];
  if (ph) return <PlaceholderPage cfg={ph} />;
  return <Home />;
}

const staticAppRedirects: Record<string, string> = {
  "/nguthuat/y/yhoc": "/nguthuat/y/yhoc/index.html",
  "/nguthuat/y/yhoc/": "/nguthuat/y/yhoc/index.html",
  "/nguthuat/boc/maihoa": "/nguthuat/boc/maihoa/index.html",
  "/nguthuat/boc/maihoa/": "/nguthuat/boc/maihoa/index.html",
};

const staticTarget = staticAppRedirects[window.location.pathname];

if (staticTarget) {
  window.location.replace(staticTarget);
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
