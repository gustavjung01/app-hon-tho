import "./pwaInstall.css";

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

const PWA_DISMISS_KEY = "cohoc_pwa_install_dismissed_at";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7;
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let banner: HTMLDivElement | null = null;

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
    ? "Trên iPhone, bấm Chia sẻ rồi chọn Thêm vào Màn hình chính."
    : "Mở nhanh Ngũ thuật, Tam thức và tài khoản như một ứng dụng.";
  copy.append(title, desc);

  const steps = document.createElement("div");
  steps.className = "pwa-install-ios-steps";
  steps.hidden = !appleInstall;
  steps.innerHTML = "<b>iPhone:</b> bấm <span>Chia sẻ</span> trong Safari, rồi chọn <span>Thêm vào Màn hình chính</span>.";
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
      steps.hidden = false;
      installButton.textContent = "Đã rõ";
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
    await navigator.serviceWorker.register("/service-worker.js", { scope: "/" });
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void registerRootServiceWorker();
    createInstallBanner();
  }, { once: true });
} else {
  void registerRootServiceWorker();
  createInstallBanner();
}
