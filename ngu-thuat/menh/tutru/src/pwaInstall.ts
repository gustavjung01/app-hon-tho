type BeforeInstallPromptChoice = { outcome: "accepted" | "dismissed"; platform: string };

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
};

const DISMISS_KEY = "tu_tru_pwa_install_dismissed";

function isStandaloneMode() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIosSafari() {
  const ua = window.navigator.userAgent;
  const isAppleDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isAppleDevice && isSafari;
}

function wasDismissed() {
  return localStorage.getItem(DISMISS_KEY) === "1";
}

function dismissBanner(root: HTMLElement) {
  localStorage.setItem(DISMISS_KEY, "1");
  root.remove();
}

function makeBanner(mode: "prompt" | "ios", onInstall?: () => void) {
  const old = document.querySelector(".pwa-install-banner");
  if (old) old.remove();

  const root = document.createElement("aside");
  root.className = `pwa-install-banner ${mode === "ios" ? "ios-guide" : "install-ready"}`;
  root.setAttribute("aria-label", "Cài App Cổ Học");

  const icon = document.createElement("img");
  icon.src = `${import.meta.env.BASE_URL}icons/app-co-hoc-icon.svg`;
  icon.alt = "";
  icon.loading = "lazy";

  const copy = document.createElement("div");
  copy.className = "pwa-install-copy";
  const title = document.createElement("strong");
  title.textContent = "Cài App Cổ Học";
  const desc = document.createElement("span");
  desc.textContent = mode === "ios" ? "iPhone: bấm Chia sẻ, chọn Thêm vào Màn hình chính." : "Mở nhanh như app, có icon riêng ngoài màn hình chính.";
  copy.append(title, desc);

  const actions = document.createElement("div");
  actions.className = "pwa-install-actions";

  const installButton = document.createElement("button");
  installButton.type = "button";
  installButton.className = "pwa-install-primary";
  installButton.textContent = mode === "ios" ? "Xem cách cài" : "Cài app";
  installButton.addEventListener("click", () => {
    if (mode === "ios") {
      root.classList.toggle("show-ios-steps");
      return;
    }
    onInstall?.();
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "pwa-install-close";
  closeButton.textContent = "Để sau";
  closeButton.addEventListener("click", () => dismissBanner(root));

  actions.append(installButton, closeButton);
  root.append(icon, copy, actions);

  if (mode === "ios") {
    const steps = document.createElement("p");
    steps.className = "pwa-install-ios-steps";
    steps.textContent = "Safari → nút Chia sẻ → Thêm vào Màn hình chính → Thêm.";
    root.append(steps);
  }

  document.body.appendChild(root);
  return root;
}

export function setupPwaInstallBanner() {
  if (typeof window === "undefined") return;
  if (isStandaloneMode() || wasDismissed()) return;

  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    const root = makeBanner("prompt", async () => {
      if (!deferredPrompt) return;
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      if (choice?.outcome === "accepted") root?.remove();
    });
  });

  window.addEventListener("appinstalled", () => {
    localStorage.setItem(DISMISS_KEY, "1");
    document.querySelector(".pwa-install-banner")?.remove();
  });

  window.addEventListener("load", () => {
    if (document.querySelector(".pwa-install-banner")) return;
    if (isStandaloneMode() || wasDismissed()) return;
    if (isIosSafari()) makeBanner("ios");
  });
}
