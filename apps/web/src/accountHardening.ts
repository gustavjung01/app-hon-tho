const replacements: Array<[string, string]> = [
  ["Đăng nhập Clerk và lưu phiên làm việc cho các ứng dụng Cổ học.", "Đăng nhập để lưu lá số, lịch sử hỏi đáp và dùng các ứng dụng Cổ học."],
  ["Đăng nhập để dùng ứng dụng Cổ học và lưu phiên làm việc.", "Đăng nhập để lưu lá số, lịch sử hỏi đáp và dùng các ứng dụng Cổ học."],
  ["Đăng nhập để lưu phiên làm việc cho các ứng dụng Cổ học.", "Đăng nhập để lưu lá số và lịch sử sử dụng."],
  ["Đã đăng nhập. Phiên làm việc đã sẵn sàng cho Tứ Trụ và các ứng dụng Cổ học.", "Đã đăng nhập. Bạn có thể dùng Tứ Trụ và các ứng dụng Cổ học."],
  ["Chưa lấy được phiên đăng nhập. Hãy đăng nhập lại.", "Chưa xác nhận được đăng nhập. Hãy thử đăng nhập lại."],
  ["Clerk đã tải nhưng chưa có SignIn UI để hiển thị.", "Chưa mở được khung đăng nhập. Vui lòng tải lại trang."],
  ["Không nạp được Clerk.", "Không mở được đăng nhập."]
];

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

if (window.location.pathname.replace(/\/$/, "") === "/account") {
  const observer = new MutationObserver(cleanCopy);
  cleanCopy();
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.setTimeout(() => observer.disconnect(), 15000);
}

export {};
