import "./pwaInstall.css";

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const PWA_DISMISS_KEY = "cohoc_pwa_install_dismissed_at";
const PWA_SW_RELOAD_KEY = "cohoc_pwa_sw_reload_pending";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let banner: HTMLDivElement | null = null;
let installGuideModal: HTMLDivElement | null = null;

function isStandalone() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isAppleTouchDevice() {
  const nav = window.navigator as Navigator & { maxTouchPoints?: number };
  const ua = window.navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (nav.platform === "MacIntel" && Number(nav.maxTouchPoints || 0) > 1);
}

function recentlyDismissed() {
  let dismissedAt = 0;
  try { dismissedAt = Number(localStorage.getItem(PWA_DISMISS_KEY) || 0); } catch { dismissedAt = 0; }
  return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_TTL_MS;
}

function dismissForNow() {
  try { localStorage.setItem(PWA_DISMISS_KEY, String(Date.now())); } catch { return; }
}

function closeBanner() {
  if (banner) banner.remove();
  banner = null;
}

function closeInstallGuide() {
  if (installGuideModal) installGuideModal.remove();
  installGuideModal = null;
  document.body.classList.remove("pwa-guide-open");
}

function openIosInstallGuide() {
  if (installGuideModal) return;

  const modal = document.createElement("div");
  modal.className = "pwa-guide-backdrop";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Hướng dẫn cài App Cổ Học trên iPhone");
  modal.innerHTML = `
    <div class="pwa-guide-sheet">
      <div class="pwa-guide-head">
        <div>
          <span class="pwa-guide-eyebrow">iPhone install guide</span>
          <h2>Cài App Cổ Học lên màn hình chính</h2>
          <p>Dành cho iPhone tiếng Việt và tiếng Anh. Mở trang bằng Safari hoặc Chrome rồi làm theo các bước bên dưới.</p>
        </div>
        <button class="pwa-guide-x" type="button" aria-label="Đóng hướng dẫn">×</button>
      </div>

      <div class="pwa-guide-scroll">
        <div class="pwa-guide-note">
          <strong>Lưu ý nhanh:</strong> Safari thường dùng nút Chia sẻ. Chrome iPhone thường có nút <b>⋯</b> ở góc phải dưới, sau đó chọn <b>Share</b>.
        </div>

        <div class="pwa-guide-steps">
          <section class="pwa-guide-step">
            <div class="pwa-guide-visual phone-menu">
              <div class="phone-bar"></div>
              <div class="phone-page"></div>
              <div class="phone-bottom"><span></span><b>⋯</b></div>
            </div>
            <div class="pwa-guide-copy">
              <span class="pwa-step-no">Bước 1</span>
              <h3>Mở menu góc phải dưới</h3>
              <p><b>Tiếng Việt:</b> Nhấn nút <b>⋯</b> ở góc phải dưới.</p>
              <p><b>English:</b> Tap the <b>⋯</b> button at the bottom right.</p>
            </div>
          </section>

          <section class="pwa-guide-step">
            <div class="pwa-guide-visual share-menu">
              <div class="share-row"><span>↑</span><b>Chia sẻ</b></div>
              <div class="share-row"><span>↑</span><b>Share</b></div>
              <div class="share-row ghost"><span>☆</span><b>Bookmark</b></div>
            </div>
            <div class="pwa-guide-copy">
              <span class="pwa-step-no">Bước 2</span>
              <h3>Chọn Chia sẻ / Share</h3>
              <p><b>Tiếng Việt:</b> Chọn <b>Chia sẻ</b>.</p>
              <p><b>English:</b> Choose <b>Share</b>.</p>
            </div>
          </section>

          <section class="pwa-guide-step">
            <div class="pwa-guide-visual add-menu">
              <div class="share-row"><span>＋</span><b>Thêm vào Màn hình chính</b></div>
              <div class="share-row"><span>＋</span><b>Add to Home Screen</b></div>
              <div class="share-row ghost"><span>⧉</span><b>Copy Link</b></div>
            </div>
            <div class="pwa-guide-copy">
              <span class="pwa-step-no">Bước 3</span>
              <h3>Thêm vào màn hình chính</h3>
              <p><b>Tiếng Việt:</b> Chọn <b>Thêm vào Màn hình chính</b>.</p>
              <p><b>English:</b> Choose <b>Add to Home Screen</b>.</p>
            </div>
          </section>

          <section class="pwa-guide-step">
            <div class="pwa-guide-visual final-add">
              <div class="phone-top"><span>Huỷ</span><b>Thêm</b></div>
              <div class="app-icon">古</div>
              <strong>Cổ Học</strong>
            </div>
            <div class="pwa-guide-copy">
              <span class="pwa-step-no">Bước cuối</span>
              <h3>Bấm Thêm / Add</h3>
              <p><b>Tiếng Việt:</b> Bấm <b>Thêm</b> ở góc phải trên.</p>
              <p><b>English:</b> Tap <b>Add</b> in the top right corner.</p>
            </div>
          </section>
        </div>
      </div>

      <div class="pwa-guide-footer">
        <button class="pwa-guide-done" type="button">Đã hiểu</button>
      </div>
    </div>
  `;

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeInstallGuide();
  });

  modal.querySelector<HTMLButtonElement>(".pwa-guide-x")?.addEventListener("click", closeInstallGuide);
  modal.querySelector<HTMLButtonElement>(".pwa-guide-done")?.addEventListener("click", closeInstallGuide);

  document.body.appendChild(modal);
  document.body.classList.add("pwa-guide-open");
  installGuideModal = modal;
}

function markPendingSwReload() {
  try {
    sessionStorage.setItem(PWA_SW_RELOAD_KEY, "1");
  } catch {
    // Ignore storage failures.
  }
}

function requestOnceReloadAfterSwUpdate() {
  try {
    if (sessionStorage.getItem(PWA_SW_RELOAD_KEY) !== "1") return;
    sessionStorage.removeItem(PWA_SW_RELOAD_KEY);
  } catch {
    // Fall through and reload once even if sessionStorage is unavailable.
  }
  window.location.reload();
}

function createInstallBanner() {
  const appleInstall = isAppleTouchDevice();
  const browserInstall = Boolean(deferredPrompt);
  if (banner || isStandalone() || recentlyDismissed()) return;
  if (!appleInstall && !browserInstall) return;

  const box = document.createElement("div");
  box.className = "pwa-install-banner";

  const copy = document.createElement("div");
  copy.className = "pwa-install-copy";
  const title = document.createElement("strong");
  title.textContent = "Cài App Cổ Học";
  const desc = document.createElement("span");
  desc.textContent = appleInstall
    ? "Bấm Cách cài để xem hướng dẫn lớn từng bước cho iPhone."
    : "Mở nhanh Ngũ thuật, Tam thức và tài khoản như một ứng dụng.";
  copy.append(title, desc);

  const steps = document.createElement("div");
  steps.className = "pwa-install-ios-steps";
  steps.hidden = !appleInstall;
  steps.innerHTML = "<b>iPhone:</b> có hướng dẫn tiếng Việt và English trong popup lớn.";
  copy.append(steps);

  const actions = document.createElement("div");
  actions.className = "pwa-install-actions";
  const installButton = document.createElement("button");
  installButton.className = "pwa-install-primary";
  installButton.type = "button";
  installButton.textContent = appleInstall ? "Cách cài" : "Cài app";
  const closeButton = document.createElement("button");
  closeButton.className = "pwa-install-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Đóng");
  closeButton.textContent = "×";
  actions.append(installButton, closeButton);

  installButton.addEventListener("click", async () => {
    if (appleInstall) {
      openIosInstallGuide();
      return;
    }
    const promptEvent = deferredPrompt;
    if (!promptEvent) return;
    deferredPrompt = null;
    await promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
    closeBanner();
  });

  closeButton.addEventListener("click", () => {
    dismissForNow();
    closeBanner();
  });

  box.append(copy, actions);
  document.body.appendChild(box);
  banner = box;
}

async function registerRootServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost") return;

  try {
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
      updateViaCache: "none"
    });

    const sendSkipWaiting = (worker: ServiceWorker | null | undefined) => {
      if (!worker) return;
      worker.postMessage({ type: "SKIP_WAITING" });
    };

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!navigator.serviceWorker.controller) return;
      requestOnceReloadAfterSwUpdate();
    });

    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
          markPendingSwReload();
          sendSkipWaiting(installingWorker);
        }
      });
    });

    if (registration.waiting) {
      markPendingSwReload();
      sendSkipWaiting(registration.waiting);
    }

    void registration.update();
  } catch (error) {
    console.warn("Không đăng ký được service worker App Cổ Học", error);
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event as BeforeInstallPromptEvent;
  createInstallBanner();
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  closeBanner();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInstallGuide();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void registerRootServiceWorker();
    createInstallBanner();
  }, { once: true });
} else {
  void registerRootServiceWorker();
  createInstallBanner();
}
