import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./accountHistory.css";

declare global {
  interface Window {
    Clerk?: any;
  }
}

function route() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function navClass(activePage: string | undefined, page: string) {
  return activePage === page ? "nav-active" : "";
}

function Shell({ children, activePage }: { children: React.ReactNode; activePage?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <a href="/" className="brand">
          <img src="/images/app-home/bg-app-home-hero.webp" className="brand-seal" alt="" aria-hidden="true" />
          <span className="brand-full">Cổ học</span>
          <span className="brand-short">Cổ học</span>
        </a>
        <div className="nav-links nav-desktop">
          <a href="/nguthuat" className={navClass(activePage, "nguthuat")}>
            <span className="nav-icon">☯</span> Ngũ thuật
          </a>
          <a href="/tam-thuc" className={navClass(activePage, "tamthuc")}>
            <span className="nav-icon">◎</span> Tam thức
          </a>
          <a href="/account" className={navClass(activePage, "account")}><span className="nav-icon">👤</span> Tài khoản</a>
          <a href="/history" className={navClass(activePage, "history")}><span className="nav-icon">🕐</span> Lịch sử</a>
        </div>
        <button className="nav-hamburger" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span className="ham-bar" />
          <span className="ham-bar" />
          <span className="ham-bar" />
        </button>
      </nav>
      {menuOpen && (
        <div className="nav-dropdown" onClick={() => setMenuOpen(false)}>
          <a href="/nguthuat" className={navClass(activePage, "nguthuat")}><span className="nav-icon">☯</span> Ngũ thuật</a>
          <a href="/tam-thuc" className={navClass(activePage, "tamthuc")}><span className="nav-icon">◎</span> Tam thức</a>
          <a href="/account" className={navClass(activePage, "account")}><span className="nav-icon">👤</span> Tài khoản</a>
          <a href="/history" className={navClass(activePage, "history")}><span className="nav-icon">🕐</span> Lịch sử</a>
        </div>
      )}
      {children}
      <footer className="site-footer">
        <span className="footer-seal">☯</span>
        <span>Cổ học - Tra cứu và thực hành có kiểm soát.</span>
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
            Không gian ứng dụng cổ học - nơi tra cứu, thực hành<br />
            và tham khảo có kiểm soát, thận trọng và hệ thống.
          </p>
        </div>
      </div>

      <div className="home-portals-wrap">
        <div className="home-portals">
          <a className="portal-card portal-nguthuat" href="/nguthuat" style={{ backgroundImage: "url('/images/app-home/portal-nguthuat.webp')" }}>
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
          <a className="portal-card portal-tamthuc" href="/tam-thuc" style={{ backgroundImage: "url('/images/app-home/portal-tamthuc.webp')" }}>
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
          <InfoCard image="/images/app-home/card-account.webp" title="Tài khoản" desc="Đăng nhập Clerk và lưu phiên làm việc cho các ứng dụng Cổ học." href="/account" />
          <InfoCard image="/images/app-home/card-history.webp" title="Lịch sử tra cứu" desc="Xem lại các lần tra cứu, thực hành và ghi chú." href="/history" />
          <InfoCard image="/images/app-home/card-credits.webp" title="Tín dụng" desc="Quản lý tín dụng, gói dịch vụ và lịch sử giao dịch." />
        </div>
      </div>
    </Shell>
  );
}

function InfoCard({ image, title, desc, href }: { image: string; title: string; desc: string; href?: string }) {
  const body = (
    <>
      <img src={image} className="info-card-img" alt={title} />
      <div className="info-card-body">
        <h3>{title}</h3>
        <p>{desc}</p>
        <span className="coming-soon">{href ? "Mở" : "🕐 Sắp ra mắt"}</span>
      </div>
    </>
  );
  return href ? <a className="info-card" href={href}>{body}</a> : <div className="info-card">{body}</div>;
}

function decodePublishableKeyDomain(key: string) {
  const encoded = key.replace(/^pk_(test|live)_/, "").trim();
  if (!encoded) return "clerk.hontho.com";
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return atob(padded).replace(/\$$/, "") || "clerk.hontho.com";
  } catch {
    return "clerk.hontho.com";
  }
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Không tải được ${src}`)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Không tải được ${src}`));
    document.head.appendChild(script);
  });
}

type AccountStatus = "loading" | "signed-in" | "signed-out" | "error";
type HistoryStatus = "loading" | "ready" | "empty" | "error";

interface AccountProfile {
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface HistoryRecord {
  id: string;
  title: string;
  app: string;
  summary: string;
  createdAt?: string;
  href?: string;
}

function readPrimaryEmail(user: any) {
  const primaryId = user?.primaryEmailAddressId;
  const emails = Array.isArray(user?.emailAddresses) ? user.emailAddresses : [];
  const primary = emails.find((item: any) => item?.id === primaryId) || emails[0];
  return String(primary?.emailAddress || user?.primaryEmailAddress?.emailAddress || "");
}

function readAccountProfile(user: any): AccountProfile | null {
  const clerkUserId = String(user?.id || "");
  if (!clerkUserId) return null;
  const firstName = String(user?.firstName || "").trim();
  const lastName = String(user?.lastName || "").trim();
  const fullName = String(user?.fullName || "").trim();
  const name = fullName || [firstName, lastName].filter(Boolean).join(" ") || "Tài khoản Cổ học";
  return {
    clerkUserId,
    name,
    email: readPrimaryEmail(user),
    imageUrl: user?.imageUrl ? String(user.imageUrl) : undefined
  };
}

function safeNextPath(fallback = "/") {
  const raw = new URLSearchParams(window.location.search).get("next") || fallback;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return fallback;
}

function redirectToAccount(next = window.location.pathname) {
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  window.location.replace(`/account?next=${encodeURIComponent(safeNext)}`);
}

function clearAccountSession() {
  localStorage.removeItem("hontho_user_token");
  localStorage.removeItem("hontho_user_clerk_id");
  localStorage.removeItem("user-clerk-id");
  localStorage.removeItem("hontho_user_profile");
}

function storeAccountProfile(profile: AccountProfile) {
  localStorage.removeItem("hontho_user_token");
  localStorage.setItem("hontho_user_clerk_id", profile.clerkUserId);
  localStorage.setItem("user-clerk-id", profile.clerkUserId);
  localStorage.setItem("hontho_user_profile", JSON.stringify(profile));
  localStorage.setItem("hontho_api_base", "/api");
}

async function loadClerkClient() {
  const cfg = await fetch("/api/admin/public-config").then((res) => res.json());
  const publishableKey = String(cfg?.clerkPublishableKey || "");
  if (!publishableKey) throw new Error("Chưa có cấu hình đăng nhập Clerk.");
  const clerkDomain = decodePublishableKeyDomain(publishableKey);

  await loadScript(`https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await loadScript(`https://${clerkDomain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
    "data-clerk-publishable-key": publishableKey
  });

  const globalClerk = window.Clerk;
  let instance = globalClerk;
  if (typeof globalClerk === "function") {
    instance = new globalClerk(publishableKey);
    await instance.load();
  } else if (globalClerk?.load) {
    await globalClerk.load({ publishableKey });
  } else {
    throw new Error("Clerk script đã tải nhưng không khởi tạo được.");
  }

  localStorage.removeItem("hontho_user_token");
  return instance;
}

function AccountPage() {
  const nextPath = safeNextPath("/nguthuat/menh/tutru/");
  const signInBoxRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLDivElement | null>(null);
  const userProfileRef = useRef<HTMLDivElement | null>(null);
  const mountedModeRef = useRef<"sign-in" | "user-button" | null>(null);
  const [status, setStatus] = useState<AccountStatus>("loading");
  const [message, setMessage] = useState("Đang nạp trang tài khoản...");
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [clerk, setClerk] = useState<any>(null);
  const [profileManagerOpen, setProfileManagerOpen] = useState(false);

  function resetMounts() {
    if (signInBoxRef.current) signInBoxRef.current.innerHTML = "";
    if (userButtonRef.current) userButtonRef.current.innerHTML = "";
    mountedModeRef.current = null;
  }

  async function syncSession(instance: any) {
    const account = readAccountProfile(instance?.user);
    if (!instance?.session || !account) {
      clearAccountSession();
      setProfile(null);
      setStatus("signed-out");
      setMessage("Đăng nhập để đồng bộ lịch sử tra cứu và quản lý tài khoản Cổ Học.");
      return null;
    }

    storeAccountProfile(account);
    setProfile(account);
    setStatus("signed-in");
    setMessage("Đã đăng nhập. Phiên tài khoản đang hoạt động an toàn trên trình duyệt.");
    return account;
  }

  async function mountAccountUi(instance: any) {
    if (!signInBoxRef.current || !userButtonRef.current) return;
    const signedIn = Boolean(instance?.user && instance?.session);

    if (signedIn) {
      if (mountedModeRef.current !== "user-button") {
        resetMounts();
        if (typeof instance.mountUserButton === "function") {
          instance.mountUserButton(userButtonRef.current, { afterSignOutUrl: "/account" });
          mountedModeRef.current = "user-button";
        }
      }
      return;
    }

    if (mountedModeRef.current !== "sign-in") {
      resetMounts();
      if (typeof instance.mountSignIn === "function") {
        instance.mountSignIn(signInBoxRef.current, {
          routing: "hash",
          afterSignInUrl: nextPath,
          afterSignUpUrl: nextPath
        });
        mountedModeRef.current = "sign-in";
      } else {
        setStatus("error");
        setMessage("Clerk đã tải nhưng chưa có SignIn UI để hiển thị.");
      }
    }
  }

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function boot() {
      try {
        const instance = await loadClerkClient();
        if (cancelled) return;

        setClerk(instance);
        const refresh = async () => {
          await syncSession(instance);
          await mountAccountUi(instance);
        };

        if (typeof instance?.addListener === "function") {
          const maybeUnsubscribe = instance.addListener(() => {
            void refresh();
          });
          if (typeof maybeUnsubscribe === "function") unsubscribe = maybeUnsubscribe;
        }

        await refresh();
      } catch (error) {
        if (cancelled) return;
        clearAccountSession();
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Không nạp được Clerk.");
      }
    }

    void boot();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
      resetMounts();
      if (userProfileRef.current) userProfileRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    if (!profileManagerOpen || !clerk || status !== "signed-in" || !userProfileRef.current) return;
    userProfileRef.current.innerHTML = "";
    if (typeof clerk.mountUserProfile === "function") {
      clerk.mountUserProfile(userProfileRef.current, { routing: "hash" });
    }
    return () => {
      if (userProfileRef.current) userProfileRef.current.innerHTML = "";
    };
  }, [profileManagerOpen, clerk, status]);

  async function handleSignOut() {
    if (clerk?.signOut) await clerk.signOut();
    clearAccountSession();
    setProfile(null);
    setProfileManagerOpen(false);
    setStatus("signed-out");
    setMessage("Đã đăng xuất. Dữ liệu phiên cũ đã được xoá khỏi trình duyệt.");
    await mountAccountUi(clerk);
  }

  function handleManageProfile() {
    if (clerk?.openUserProfile) {
      clerk.openUserProfile();
      return;
    }
    setProfileManagerOpen((value) => !value);
  }

  return (
    <Shell activePage="account">
      <div className="account-hero">
        <div className="breadcrumb"><a href="/">🏠</a> / <span>Tài khoản</span></div>
        <div className="placeholder-icon">👤</div>
        <h1>Tài khoản Cổ Học</h1>
        <p className="lead">Đăng nhập, quản lý hồ sơ và giữ lịch sử tra cứu trong phiên Clerk an toàn.</p>
      </div>

      <div className="account-body">
        <div className="account-grid">
          <section className="account-card">
            {status === "signed-in" && profile ? (
              <>
                <div className="account-profile-row">
                  {profile.imageUrl ? (
                    <img src={profile.imageUrl} alt="" className="account-avatar" />
                  ) : (
                    <div className="account-avatar account-avatar-fallback">👤</div>
                  )}
                  <div>
                    <h2 className="account-name">{profile.name}</h2>
                    <p className="account-email">{profile.email || "Chưa có email chính"}</p>
                    <span className="status-pill"><span className="status-dot" /> Đang đăng nhập</span>
                  </div>
                </div>
                <div ref={userButtonRef} className="account-user-button" />
                <div className="account-actions">
                  <button className="ph-btn-primary" type="button" onClick={handleManageProfile}>Quản lý hồ sơ</button>
                  <a className="ph-btn-secondary" href="/history">Lịch sử tra cứu</a>
                  <span className="ph-btn-secondary account-action-disabled">Tín dụng</span>
                  <a className="ph-btn-secondary" href={nextPath}>Quay lại app đang dùng</a>
                  <button className="ph-btn-secondary" type="button" onClick={handleSignOut}>Đăng xuất</button>
                </div>
                {profileManagerOpen ? <div ref={userProfileRef} className="account-manager" /> : null}
              </>
            ) : (
              <>
                <h2 className="account-name">{status === "loading" ? "Đang kiểm tra phiên đăng nhập" : "Đăng nhập tài khoản"}</h2>
                <p className="account-muted">{message}</p>
                <div ref={signInBoxRef} className="account-widget-wrap auth-widget" />
                <div className="account-actions">
                  <a className="ph-btn-secondary" href="/">Trang chủ</a>
                  <a className="ph-btn-secondary" href="/nguthuat/menh/tutru/">Vào Tứ Trụ</a>
                </div>
              </>
            )}
          </section>

          <aside className="account-panel">
            <h2>Trạng thái phiên</h2>
            <p className="account-muted">{message}</p>
            <ul>
              <li>✓ Không hiển thị dữ liệu phiên kỹ thuật trên giao diện.</li>
              <li>✓ Không lưu chuỗi phiên đăng nhập vào localStorage.</li>
              <li>✓ Quản lý hồ sơ bằng giao diện chính thức của Clerk.</li>
            </ul>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function normalizeHistoryPayload(raw: any): HistoryRecord[] {
  const source = Array.isArray(raw)
    ? raw
    : raw?.items || raw?.history || raw?.records || raw?.data || raw?.results || [];

  if (!Array.isArray(source)) return [];

  return source.map((item: any, index: number) => {
    const app = String(item?.app || item?.type || item?.module || "Cổ Học");
    const title = String(item?.title || item?.name || item?.question || item?.query || `${app} #${index + 1}`);
    const summary = String(item?.summary || item?.description || item?.note || item?.resultSummary || "Đã lưu một lần tra cứu.");
    const createdAt = String(item?.createdAt || item?.created_at || item?.time || item?.timestamp || "");
    const href = item?.href || item?.url || item?.path;
    return {
      id: String(item?.id || item?._id || item?.historyId || `${createdAt}-${index}`),
      app,
      title,
      summary,
      createdAt,
      href: typeof href === "string" && href.startsWith("/") ? href : undefined
    };
  });
}

async function fetchHistoryRecords(token: string): Promise<HistoryRecord[]> {
  const endpoints = ["/api/user/history", "/api/history", "/api/me/history"];
  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (res.status === 404) continue;
    if (res.status === 401 || res.status === 403) {
      throw new Error("Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.");
    }
    if (!res.ok) {
      throw new Error("Chưa tải được lịch sử tra cứu.");
    }
    return normalizeHistoryPayload(await res.json());
  }
  return [];
}

function formatHistoryDate(value?: string) {
  if (!value) return "Chưa rõ thời gian";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function HistoryPage() {
  const [status, setStatus] = useState<HistoryStatus>("loading");
  const [message, setMessage] = useState("Đang kiểm tra phiên đăng nhập...");
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [profile, setProfile] = useState<AccountProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const instance = await loadClerkClient();
        if (cancelled) return;

        const account = readAccountProfile(instance?.user);
        if (!instance?.session || !account) {
          redirectToAccount("/history");
          return;
        }

        storeAccountProfile(account);
        setProfile(account);
        setMessage("Đang tải lịch sử tra cứu...");

        const token = await instance.session.getToken().catch(() => "");
        if (!token) {
          redirectToAccount("/history");
          return;
        }

        const items = await fetchHistoryRecords(token);
        if (cancelled) return;

        setRecords(items);
        setStatus(items.length > 0 ? "ready" : "empty");
        setMessage(items.length > 0 ? "Lịch sử tra cứu của bạn." : "Chưa có lịch sử tra cứu nào được lưu.");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Không tải được lịch sử tra cứu.");
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Shell activePage="history">
      <div className="history-hero">
        <div className="breadcrumb"><a href="/">🏠</a> / <span>Lịch sử tra cứu</span></div>
        <div className="placeholder-icon">🕐</div>
        <h1>Lịch sử tra cứu</h1>
        <p className="lead">Phiên đăng nhập chỉ được dùng trong bộ nhớ khi tải dữ liệu, không hiển thị trên giao diện.</p>
      </div>

      <div className="history-body">
        <section className="history-card">
          {profile ? (
            <p className="history-meta">Tài khoản: {profile.name}{profile.email ? ` · ${profile.email}` : ""}</p>
          ) : null}

          {status === "loading" ? (
            <div className="history-empty">
              <div className="history-empty-icon">⌛</div>
              <h2>Đang nạp lịch sử</h2>
              <p className="account-muted">{message}</p>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="history-empty">
              <div className="history-empty-icon">⚠️</div>
              <h2>Chưa tải được lịch sử</h2>
              <p className="account-muted">{message}</p>
              <div className="history-actions center">
                <a className="ph-btn-primary" href="/account?next=/history">Kiểm tra đăng nhập</a>
                <a className="ph-btn-secondary" href="/">Trang chủ</a>
              </div>
            </div>
          ) : null}

          {status === "empty" ? (
            <div className="history-empty">
              <div className="history-empty-icon">🪶</div>
              <h2>Chưa có lịch sử</h2>
              <p className="account-muted">Khi bạn tra cứu trong các ứng dụng Cổ Học, các mục được lưu sẽ xuất hiện tại đây.</p>
              <div className="history-actions center">
                <a className="ph-btn-primary" href="/nguthuat/menh/tutru/">Bắt đầu với Tứ Trụ</a>
                <a className="ph-btn-secondary" href="/account">Tài khoản</a>
              </div>
            </div>
          ) : null}

          {status === "ready" ? (
            <>
              <div className="history-list">
                {records.map((item) => {
                  const body = (
                    <>
                      <h3>{item.title}</h3>
                      <p className="history-meta">{item.app} · {formatHistoryDate(item.createdAt)}</p>
                      <p className="account-muted">{item.summary}</p>
                    </>
                  );
                  return item.href ? (
                    <a key={item.id} className="history-item" href={item.href}>{body}</a>
                  ) : (
                    <div key={item.id} className="history-item">{body}</div>
                  );
                })}
              </div>
              <div className="history-actions">
                <a className="ph-btn-secondary" href="/nguthuat/menh/tutru/">Tra cứu thêm</a>
                <a className="ph-btn-secondary" href="/account">Tài khoản</a>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </Shell>
  );
}

const nguThuatCards = [
  { key: "son", title: "Sơn", sub: "Phong thủy an cư", desc: "Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống.", art: "/images/nguthuat/home-cards/ui-nguthuat-card-son-art.png", href: "/nguthuat/son" },
  { key: "y", title: "Y", sub: "Y học cổ học", desc: "Kiến thức dưỡng sinh, mùa tiết, thân thể và khí huyết tham khảo.", art: "/images/nguthuat/home-cards/ui-nguthuat-card-y-art.png", href: "/nguthuat/y" },
  { key: "menh", title: "Mệnh", sub: "Tứ Trụ", desc: "Lập bốn trụ từ ngày giờ sinh, đọc Can Chi, Ngũ hành và Thập thần.", art: "/images/nguthuat/home-cards/ui-nguthuat-card-menh-art.png", href: "/nguthuat/menh" },
  { key: "boc", title: "Bốc", sub: "Mai Hoa · 64 quẻ", desc: "Lập quẻ tham khảo, học tượng số và cách đọc có giới hạn.", art: "/images/nguthuat/home-cards/ui-nguthuat-card-boc-art.png", href: "/nguthuat/boc" },
  { key: "tuong", title: "Tướng", sub: "Xem tướng tham khảo", desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người.", art: "/images/nguthuat/home-cards/ui-nguthuat-card-tuong-art.png", href: "/nguthuat/tuong" },
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
          <p className="lead">Cổng ứng dụng thực hành có kiểm soát, hỗ trợ tra cứu, tham khảo<br />và thực hành theo tri thức cổ học.</p>
        </div>
      </div>
      <div className="branch-cards-wrap">
        <div className="branch-cards five">
          {nguThuatCards.map((card) => <BranchCard key={card.key} {...card} cta="Mở mục" />)}
        </div>
      </div>
      <Principles items={[
        ["🛡", "Tra cứu có kiểm soát", "Nội dung được biên soạn chọn lọc, hệ thống kiểm soát đầu vào và đầu ra, hạn chế diễn giải cực đoan."],
        ["📖", "Minh bạch nguồn tham khảo", "Dựa trên sách cổ, tài liệu học thuật và hệ thống chú giải rõ ràng, có trích dẫn nguồn."],
        ["⚖", "Không phán đoán cực đoan", "Ứng dụng hỗ trợ tham khảo và thực hành, không thay thế tư duy độc lập và trách nhiệm cá nhân."],
      ]} />
    </Shell>
  );
}

type BranchCardProps = { title: string; sub?: string; desc: string; art: string; href: string; cta?: string };
function BranchCard({ title, sub, desc, art, href, cta = "Khám phá" }: BranchCardProps) {
  return (
    <a className="branch-card" href={href}>
      <div className="branch-card-inner">
        <div className="branch-card-art"><img src={art} className="branch-card-art-img" alt={title} /></div>
        <h2>{title}</h2>
        <div className="branch-divider">◆</div>
        {sub ? <p className="branch-sub">{sub}</p> : null}
        <p className="branch-desc">{desc}</p>
        <span className="branch-btn">{cta} <span>›</span></span>
      </div>
    </a>
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
  "/nguthuat/son": { title: "Sơn", subtitle: "Phong thủy an cư", desc: "Cổng nhánh Sơn tập trung vào phong thủy an cư, hướng nhà, Bát trạch và bố cục không gian sống.", heroImage: "/images/nguthuat/son/ui-son-hero-bg-phong-thuy.png", icon: "/images/nguthuat/icon-son.webp", apps: [{ key: "phong-thuy", title: "Phong thủy an cư", desc: "Tra cứu hướng nhà, Đông Tây tứ mệnh, Bát trạch và phân vùng bố trí không gian theo tri thức cổ học.", href: "/nguthuat/son/phongthu", cta: "Mở Phong thủy", image: "/images/nguthuat/son/ui-son-phong-thuy-an-cu-card.png" }] },
  "/nguthuat/y": { title: "Y", subtitle: "Y học cổ học", desc: "Cổng nhánh Y phục vụ tham khảo dưỡng sinh, tiết khí, khí huyết và cách ứng dụng thận trọng trong đời sống.", heroImage: "/images/nguthuat/y/ui-y-hero-bg-yhoc.png", icon: "/images/nguthuat/icon-y.webp", apps: [{ key: "y-hoc", title: "Y học cổ học", desc: "Mở hệ thống tham khảo dưỡng sinh, tiết khí và cân bằng cơ thể theo góc nhìn y học cổ truyền.", href: "/nguthuat/y/yhoc", cta: "Mở Y học", image: "/images/nguthuat/y/ui-y-yhoc-co-hoc-card.png" }] },
  "/nguthuat/boc": { title: "Bốc", subtitle: "Mai Hoa Dịch số", desc: "Cổng nhánh Bốc hướng đến lập quẻ tham khảo, học cách đọc quẻ và đặt giới hạn diễn giải rõ ràng.", heroImage: "/images/nguthuat/boc/ui-boc-hero-bg-maihoa.png", icon: "/images/nguthuat/icon-boc.webp", apps: [{ key: "mai-hoa", title: "Mai Hoa Dịch số", desc: "Vào công cụ lập quẻ và tham khảo cách đọc 64 quẻ theo hướng học hiểu, không khẳng định tuyệt đối.", href: "/nguthuat/boc/maihoa", cta: "Mở Mai Hoa", image: "/images/nguthuat/boc/ui-boc-mai-hoa-card.png" }] },
  "/nguthuat/menh": { title: "Mệnh", subtitle: "Can Chi và cấu trúc mệnh", desc: "Cổng nhánh Mệnh là nơi quy tụ các công cụ đọc mệnh theo dữ liệu ngày giờ sinh và hệ thống Can Chi.", heroImage: "/images/nguthuat/menh/ui-menh-hero-bg-luan-menh.png", icon: "/images/nguthuat/icon-menh.webp", apps: [
    { key: "tu-tru", title: "Tứ Trụ", desc: "Lưu ý: Tứ Trụ là app con full page, mở trong không gian riêng để tra cứu chi tiết.", href: "/nguthuat/menh/tutru/", cta: "Mở Tứ Trụ", image: "/images/nguthuat/menh/ui-menh-tu-tru-card.png", note: "App con full page" },
    { key: "tu-vi", title: "Tử Vi", desc: "Ứng dụng Tử Vi sẽ được chuẩn bị sau, phục vụ học hiểu hệ thống cung, sao và vận hạn theo hướng tham khảo.", href: "/nguthuat/menh/tu-vi", cta: "Sắp mở", image: "/images/nguthuat/menh/ui-menh-tu-vi-card.png", note: "Đang chuẩn bị", status: "comingSoon" },
  ] },
  "/nguthuat/tuong": { title: "Tướng", subtitle: "Quan sát và học hiểu", desc: "Cổng nhánh Tướng tập trung vào hướng học quan sát, tôn trọng bối cảnh và tránh định kiến với con người.", heroImage: "/images/nguthuat/tuong/ui-tuong-hero-bg-xem-tuong.png", icon: "/images/nguthuat/icon-tuong.webp", apps: [{ key: "xem-tuong", title: "Xem tướng tham khảo", desc: "Vào mục học tập và tham khảo cách quan sát hình tướng theo tinh thần thận trọng và có giới hạn.", href: "/nguthuat/tuong/xem-tuong", cta: "Mở Xem tướng", image: "/images/nguthuat/tuong/ui-tuong-xem-tuong-card.png" }] },
};

function NguThuatBranchLanding({ cfg }: { cfg: NguThuatBranchLandingConfig }) {
  return (
    <Shell activePage="nguthuat">
      <div className="page-hero" style={{ backgroundImage: `url('${cfg.heroImage}')` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb"><a href="/">🏠</a> / <a href="/">Trang chủ</a> / <a href="/nguthuat">Ngũ thuật</a> / <span>{cfg.title}</span></div>
          <div className="ornament">◆</div>
          <h1>{cfg.title}</h1>
          <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: ".08em", marginBottom: "16px" }}>{cfg.subtitle}</p>
          <p className="lead">{cfg.desc}</p>
        </div>
      </div>
      <div className="branch-cards-wrap">
        <div className={`branch-cards branch-cards-gateway${cfg.apps.length > 1 ? " branch-cards-gateway-two" : ""}`}>
          {cfg.apps.map((app) => (
            <a key={app.key} className={`branch-card branch-card-gateway${app.status === "comingSoon" ? " branch-card-soon" : ""}`} href={app.href}>
              <div className="branch-card-inner">
                {app.image ? <div className="branch-gateway-art"><img src={app.image} className="branch-gateway-art-img" alt={app.title} /></div> : <img src={cfg.icon} className="branch-icon" alt={cfg.title} />}
                <h2>{app.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-desc">{app.desc}</p>
                {app.status === "comingSoon" ? <p className="branch-gateway-state">Đang chuẩn bị</p> : null}
                {app.note ? <p className="branch-gateway-note">{app.note}</p> : null}
                <span className={`branch-btn${app.status === "comingSoon" ? " branch-btn-soon" : ""}`}>{app.cta} <span>›</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="placeholder-body branch-landing-actions">
        <div className="placeholder-btn-row">
          <a className="ph-btn-primary" href="/nguthuat">← Quay về Ngũ thuật</a>
          <a className="ph-btn-secondary" href="/">Về trang chủ</a>
        </div>
      </div>
    </Shell>
  );
}

const tamThucCards = [
  { key: "ky-mon", title: "Kỳ Môn", sub: "Kỳ Môn Độn Giáp", desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị.", art: "/images/tam-thuc/card-ky-mon.svg", href: "/tam-thuc/ky-mon" },
  { key: "thai-at", title: "Thái Ất", sub: "Thái Ất Thần Số", desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất.", art: "/images/tam-thuc/card-thai-at.svg", href: "/tam-thuc/thai-at" },
  { key: "luc-nham", title: "Lục Nhâm", sub: "Đại Lục Nhâm", desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế.", art: "/images/tam-thuc/card-luc-nham.svg", href: "/tam-thuc/luc-nham" },
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
          <p className="lead">Khu vực hệ thống hoá các bộ môn Tam thức - thực dụng, ứng nghiệm,<br />phục vụ tra cứu, tham khảo và ứng dụng thực hành.</p>
        </div>
      </div>
      <div className="branch-cards-wrap"><div className="branch-cards three">{tamThucCards.map((card) => <BranchCard key={card.key} {...card} cta="Khám phá" />)}</div></div>
      <Principles items={[
        ["📚", "Tham khảo có hệ thống", "Tổng hợp kiến thức cổ học một cách có cấu trúc, dễ tra cứu và đối chiếu."],
        ["✒", "Giữ ngôn từ thận trọng", "Không khẳng định tuyệt đối, ưu tiên cách diễn giải khách quan."],
        ["🧘", "Ưu tiên học hiểu trước khi ứng dụng", "Hiểu đúng bản chất, vận dụng đúng bối cảnh, tránh mê tín và lệ thuộc."],
      ]} />
      <div className="tamthuc-footer-quote"><span className="lotus">🪷</span><em>Học để hiểu đạo lý, dùng để thuận tự nhiên, hành sự có căn cứ, tâm an mà trí sáng.</em><span className="lotus">🪷</span></div>
    </Shell>
  );
}

function Principles({ items }: { items: [string, string, string][] }) {
  return <div className="principles-bar">{items.map(([icon, title, desc]) => <div className="principle" key={title}><div className="principle-icon">{icon}</div><div><strong>{title}</strong><p>{desc}</p></div></div>)}</div>;
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
        <div className="breadcrumb"><a href="/">🏠</a>{" / "}{grandParent && grandParentHref ? <><a href={grandParentHref}>{grandParent}</a>{" / "}</> : null}<a href={parentHref}>{parent}</a>{" / "}<span>{title}</span></div>
        <div className="placeholder-icon">{icon}</div>
        <h1>{title}</h1>
        {subtitle && <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: ".08em", marginBottom: "16px" }}>{subtitle}</p>}
        <p className="lead">{desc}</p>
      </div>
      <div className="placeholder-body">
        <div className="placeholder-notice"><strong>Ứng dụng đang được chuẩn bị</strong>Nội dung sẽ được biên soạn theo hướng tra cứu có kiểm soát, không phán đoán cực đoan. Thông tin mang tính tham khảo, không thay thế phán xét độc lập của người dùng.</div>
        <div className="placeholder-btn-row"><a className="ph-btn-primary" href={parentHref}>← Quay về {parent}</a><a className="ph-btn-secondary" href="/">Về trang chủ</a></div>
      </div>
    </Shell>
  );
}

function TuTruRedirect() {
  React.useEffect(() => {
    window.location.replace("/nguthuat/menh/tutru/");
  }, []);
  return null;
}

const PLACEHOLDER_ROUTES: Record<string, PlaceholderConfig> = {
  "/nguthuat/son/phongthu": { title: "Sơn - Phong thủy an cư", subtitle: "Phong thủy · Bát trạch · Phi tinh", icon: "🏔", desc: "Tra cứu phong thủy an cư, Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống theo tri thức cổ học.", parent: "Ngũ thuật", parentHref: "/nguthuat", grandParent: "Trang chủ", grandParentHref: "/" },
  "/nguthuat/menh/tu-vi": { title: "Tử Vi - Đang chuẩn bị", subtitle: "Tử Vi · Cung sao · Tham khảo", icon: "✦", desc: "Ứng dụng Tử Vi đang được chuẩn bị, phục vụ học hiểu hệ thống cung, sao và vận hạn theo hướng tham khảo. Nội dung không dùng để kết luận số phận tuyệt đối.", parent: "Mệnh", parentHref: "/nguthuat/menh", grandParent: "Ngũ thuật", grandParentHref: "/nguthuat" },
  "/nguthuat/tuong/xem-tuong": { title: "Tướng - Xem tướng tham khảo", subtitle: "Tướng học · Quan sát · Học hỏi", icon: "👁", desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người. Nội dung mang tính tham khảo học thuật.", parent: "Ngũ thuật", parentHref: "/nguthuat", grandParent: "Trang chủ", grandParentHref: "/" },
  "/tam-thuc/ky-mon": { title: "Kỳ Môn", subtitle: "Kỳ Môn Độn Giáp", icon: "🧭", desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị theo Kỳ Môn Độn Giáp.", parent: "Tam thức", parentHref: "/tam-thuc", grandParent: "Trang chủ", grandParentHref: "/" },
  "/tam-thuc/thai-at": { title: "Thái Ất", subtitle: "Thái Ất Thần Số", icon: "🌙", desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất. Tham khảo có kiểm soát.", parent: "Tam thức", parentHref: "/tam-thuc", grandParent: "Trang chủ", grandParentHref: "/" },
  "/tam-thuc/luc-nham": { title: "Lục Nhâm", subtitle: "Đại Lục Nhâm", icon: "⚖", desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế theo Đại Lục Nhâm.", parent: "Tam thức", parentHref: "/tam-thuc", grandParent: "Trang chủ", grandParentHref: "/" },
};

function App() {
  const path = route();
  if (path === "/nguthuat") return <NguThuatHub />;
  if (path === "/tam-thuc") return <TamThucHub />;
  if (path === "/account") return <AccountPage />;
  if (path === "/history") return <HistoryPage />;
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
