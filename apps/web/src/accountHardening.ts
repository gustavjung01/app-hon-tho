const replacements: Array<[string, string]> = [
  ["Đăng nhập Clerk và lưu phiên làm việc cho các ứng dụng Cổ học.", "Đăng nhập để lưu lá số, lịch sử hỏi đáp và dùng các ứng dụng Cổ học."],
  ["Đăng nhập để dùng ứng dụng Cổ học và lưu phiên làm việc.", "Đăng nhập để lưu lá số, lịch sử hỏi đáp và dùng các ứng dụng Cổ học."],
  ["Đăng nhập để lưu phiên làm việc cho các ứng dụng Cổ học.", "Đăng nhập để lưu lá số và lịch sử sử dụng."],
  ["Đã đăng nhập. Phiên làm việc đã sẵn sàng cho Tứ Trụ và các ứng dụng Cổ học.", "Đã đăng nhập. Bạn có thể dùng Tứ Trụ và các ứng dụng Cổ học."],
  ["Chưa lấy được phiên đăng nhập. Hãy đăng nhập lại.", "Chưa xác nhận được đăng nhập. Hãy thử đăng nhập lại."],
  ["Clerk đã tải nhưng chưa có SignIn UI để hiển thị.", "Chưa mở được khung đăng nhập. Vui lòng tải lại trang."],
  ["Không nạp được Clerk.", "Không mở được đăng nhập."]
];

const privilegedRoles = new Set(["super_admin", "admin", "operator", "reviewer"]);

function cleanCopy() {
  if (window.location.pathname.replace(/\/$/, "") !== "/account") return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    let text = node.nodeValue || "";
    replacements.forEach(([from, to]) => {
      text = text.replaceAll(from, to);
    });
    node.nodeValue = text;
  });
}

function addAccountNotice(kind: "denied" | "login") {
  if (window.location.pathname.replace(/\/$/, "") !== "/account") return;
  if (document.querySelector(".account-safe-notice")) return;
  const body = document.querySelector(".placeholder-body");
  if (!body) return;
  const box = document.createElement("div");
  box.className = "placeholder-notice account-safe-notice";
  const title = document.createElement("strong");
  title.textContent = "Khu quản trị không mở cho tài khoản thường";
  const text = document.createElement("p");
  text.textContent = kind === "denied" ? "Tài khoản này không có quyền quản trị." : "Vui lòng đăng nhập bằng tài khoản có quyền quản trị.";
  box.append(title, text);
  body.prepend(box);
}

async function guardAdminPath() {
  const path = window.location.pathname.replace(/\/$/, "");
  if (path !== "/admin" && !path.startsWith("/admin/")) return;
  const token = localStorage.getItem("hontho_user_token")?.trim() || "";
  if (!token) {
    window.location.replace("/account?admin=login");
    return;
  }
  try {
    const response = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("auth");
    const data = await response.json().catch(() => ({}));
    const role = String(data?.user?.role || "");
    if (!privilegedRoles.has(role)) window.location.replace("/account?admin=denied");
  } catch {
    localStorage.removeItem("hontho_user_token");
    window.location.replace("/account?admin=login");
  }
}

const accountPath = window.location.pathname.replace(/\/$/, "") === "/account";
if (accountPath) {
  const observer = new MutationObserver(() => {
    cleanCopy();
    const reason = new URLSearchParams(window.location.search).get("admin");
    if (reason === "denied" || reason === "login") addAccountNotice(reason);
  });
  cleanCopy();
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.setTimeout(() => observer.disconnect(), 15000);
}

void guardAdminPath();

export {};
