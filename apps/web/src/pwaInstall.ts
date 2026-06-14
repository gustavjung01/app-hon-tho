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
  return window.matchMedia("(display-mode: standalone)").matches;
}

function recentlyDismissed() {
  const dismissedAt = Number(localStorage.getItem(PWA_DISMISS_KEY) || 0);
  return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_TTL_MS;
}

function closeBanner() {
  if (banner) banner.remove();
  banner = null;
}

function createInstallBanner() {
  if (banner || !deferredPrompt || isStandalone() || recentlyDismissed()) return;

  const box = document.createElement("div");
  box.className = "pwa-install-banner";

  const copy = document.createElement("div");
  copy.className = "pwa-install-copy";
  const title = document.createElement("strong");
  title.textContent = "Cài App Cổ Học";
  const desc = document.createElement("span");
  desc.textContent = "Mở nhanh toàn bộ Ngũ thuật, Tam thức và tài khoản như một ứng dụng.";
  copy.append(title, desc);

  const actions = document.createElement("div");
  actions.className = "pwa-install-actions";
  const installButton = document.createElement("button");
  installButton.className = "pwa-install-primary";
  installButton.type = "button";
  installButton.textContent = "Cài app";
  const closeButton = document.createElement("button");
  closeButton.className = "pwa-install-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Đóng");
  closeButton.textContent = "×";
  actions.append(installButton, closeButton);

  installButton.addEventListener("click", async () => {
    const promptEvent = deferredPrompt;
    if (!promptEvent) return;
    deferredPrompt = null;
    await promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
    closeBanner();
  });

  closeButton.addEventListener("click", () => {
    localStorage.setItem(PWA_DISMISS_KEY, String(Date.now()));
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
