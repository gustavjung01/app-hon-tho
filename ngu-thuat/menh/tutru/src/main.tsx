import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./aiReply.css";

function registerTuTruPwa() {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const serviceWorkerUrl = `${normalizedBase}service-worker.js`;

    navigator.serviceWorker.register(serviceWorkerUrl, { scope: normalizedBase }).catch((error) => {
      console.warn("Không đăng ký được PWA service worker:", error);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
registerTuTruPwa();
