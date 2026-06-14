import ReactDOM from "react-dom/client";
import App from "./App";
import { setupPwaInstallBanner } from "./pwaInstall";
import "./styles.css";
import "./aiReply.css";
import "./followupMenu.css";
import "./pwaInstall.css";

function registerRootPwaFromTuTru() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      .then((registration) => registration.update().catch(() => null))
      .catch((error) => {
        console.warn("Không đăng ký được PWA service worker:", error);
      });
  });
}

async function verifyStoredAuthSession() {
  const token = localStorage.getItem("hontho_user_token")?.trim();
  if (!token) return;
  try {
    const response = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 401 || response.status === 403) localStorage.removeItem("hontho_user_token");
  } catch {
    // Giữ nguyên token khi mạng lỗi, tránh tự đá phiên trong lúc offline/yếu mạng.
  }
}

async function bootstrap() {
  await verifyStoredAuthSession();
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
  registerRootPwaFromTuTru();
  setupPwaInstallBanner();
}

bootstrap();
