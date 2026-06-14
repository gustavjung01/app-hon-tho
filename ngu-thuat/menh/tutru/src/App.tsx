import { FormEvent, useMemo, useState, type ReactNode } from "react";
import homeTuTruImage from "../../../../home-tu-tru.png";
import { deriveFourPillars } from "./engine/deriveFourPillars";
import { buildResultContentLayer, type ResultContentLayer } from "./engine/resultContentLayer";
import type { CalendarType, DeriveFourPillarsInput, DeriveFourPillarsOutput, GenderType } from "./engine/types";

declare global {
  interface Window {
    Clerk?: {
      load?: (options?: unknown) => Promise<void>;
      openSignIn?: (options?: unknown) => void;
      session?: { getToken: (options?: unknown) => Promise<string | null> } | null;
      user?: { primaryEmailAddress?: { emailAddress?: string }; emailAddresses?: Array<{ emailAddress?: string }> } | null;
    };
    HonThoAuth?: {
      getToken?: (options?: { force?: boolean; allowCached?: boolean }) => Promise<string>;
      signIn?: (options?: { nextPath?: string }) => void | Promise<void>;
    };
    __internal_ClerkUICtor?: unknown;
  }
}

const elementOrder = ["Mộc", "Hỏa", "Thổ", "Kim", "Thủy"] as const;
const elementClass: Record<string, string> = { Mộc: "wood", Hỏa: "fire", Thổ: "earth", Kim: "metal", Thủy: "water" };
const ACCOUNT_RETURN_URL = "/account?next=/nguthuat/menh/tutru/";

class AuthSessionError extends Error {
  constructor(message: string, public expired = false) {
    super(message);
    this.name = "AuthSessionError";
  }
}

type InterpretStatus = "idle" | "saving" | "running" | "done" | "error";
type InterpretationState = { status: InterpretStatus; message?: string; appRunId?: string; conversationId?: string; reply?: string; provider?: string; model?: string; authAction?: boolean };
type ChatMessage = { role: "assistant" | "user"; content: string };
type AiReplyResponse = { message: { content: string }; provider: string; model: string };

function cx(...items: Array<string | false | null | undefined>) { return items.filter(Boolean).join(" "); }
function toGenderLabel(gender: GenderType) { if (gender === "male") return "Nam"; if (gender === "female") return "Nữ"; return "Khác"; }
function getApiBase() { return (localStorage.getItem("hontho_api_base") || "/api").replace(/\/$/, ""); }
function storedToken() { return localStorage.getItem("hontho_user_token")?.trim() || ""; }
function saveToken(token: string) { localStorage.setItem("hontho_user_token", token); localStorage.setItem("hontho_api_base", "/api"); }
function clearToken() { localStorage.removeItem("hontho_user_token"); }

function clerkDomainFromPublishableKey(key: string) {
  const encoded = String(key || "").replace(/^pk_(test|live)_/, "").trim();
  if (!encoded) throw new Error("Thiếu Clerk publishable key.");
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded).replace(/\$$/, "");
}

function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<void>((resolve, reject) => {
    const old = document.querySelector(`script[src="${src}"]`);
    if (old) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không tải được đăng nhập Clerk."));
    document.head.appendChild(script);
  });
}

async function ensureClerkLoaded() {
  if (window.Clerk?.openSignIn || window.Clerk?.session) return window.Clerk;
  const cfg = await fetch("/api/admin/public-config").then((response) => response.json().catch(() => ({})));
  const publishableKey = String(cfg.clerkPublishableKey || "");
  if (!publishableKey) return window.Clerk || null;
  const domain = clerkDomainFromPublishableKey(publishableKey);
  await loadScript(`https://${domain}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await loadScript(`https://${domain}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, { "data-clerk-publishable-key": publishableKey });
  if (window.Clerk?.load) await window.Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
  return window.Clerk || null;
}

async function getClerkToken() {
  try {
    const bridgeToken = await window.HonThoAuth?.getToken?.({ force: true, allowCached: false });
    if (bridgeToken) {
      saveToken(bridgeToken);
      return bridgeToken;
    }
  } catch {
    // Fallback to local Clerk loading below.
  }
  try {
    const clerk = await ensureClerkLoaded();
    const token = await clerk?.session?.getToken?.({ skipCache: true });
    if (token) {
      saveToken(token);
      return token;
    }
  } catch {
    // Fallback below handles cached token or user-facing login error.
  }
  return "";
}

async function getFreshAuthToken(forceClerk = false) {
  if (forceClerk) clearToken();
  const liveToken = await getClerkToken();
  if (liveToken) return liveToken;
  const cached = storedToken();
  if (!forceClerk && cached) return cached;
  throw new AuthSessionError("Phiên đăng nhập đã hết hạn hoặc chưa sẵn sàng. Bấm Đăng nhập để mở lại phiên trong trang này.", true);
}

function parseApiError(response: Response, data: any) {
  const message = typeof data?.error === "string" ? data.error : "API chưa xử lý được yêu cầu.";
  const detail = typeof data?.detail === "string" ? data.detail : "";
  if (response.status >= 500 && message.includes("AI provider")) return new Error(detail || "Cố vấn Tứ Trụ chưa trả lời được. Vui lòng thử lại sau khi kiểm tra cấu hình luận.");
  return new Error(`${message}${detail ? ` ${detail}` : ""}`.trim());
}

async function apiRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const run = async (token: string) => fetch(`${getApiBase()}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let token = await getFreshAuthToken(false);
  let response = await run(token);
  if (response.status === 401) {
    clearToken();
    token = await getFreshAuthToken(true);
    response = await run(token);
  }

  const data = await response.json().catch(() => ({ error: response.statusText }));
  if (response.status === 401) {
    clearToken();
    throw new AuthSessionError("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại trong trang này.", true);
  }
  if (!response.ok) throw parseApiError(response, data);
  return data as T;
}

function buildInputFromForm(form: HTMLFormElement, calendarType: CalendarType, gender: GenderType, isLeapMonth: boolean): DeriveFourPillarsInput {
  const data = new FormData(form);
  const birthDate = String(data.get("birthDate") ?? "").trim();
  const birthHour = String(data.get("birthHour") ?? "00").padStart(2, "0");
  const birthMinute = String(data.get("birthMinute") ?? "00").padStart(2, "0");
  const timezone = String(data.get("timezone") ?? "Asia/Ho_Chi_Minh");
  const birthPlace = String(data.get("birthPlace") ?? "").trim();
  return { birthDate, birthTime: `${birthHour}:${birthMinute}`, calendarType, timezone, gender, birthPlace: birthPlace || undefined, isLeapMonth: calendarType === "lunar" ? isLeapMonth : false, dayBoundaryMode: "zi-hour-rollover" };
}

function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return <header className="section-title"><p>{eyebrow}</p><h2>{title}</h2>{note ? <span>{note}</span> : null}</header>;
}

function InputPanel({ calendarType, gender, isLeapMonth, error, onCalendarChange, onGenderChange, onLeapMonthChange, onSubmit }: { calendarType: CalendarType; gender: GenderType; isLeapMonth: boolean; error: string | null; onCalendarChange: (value: CalendarType) => void; onGenderChange: (value: GenderType) => void; onLeapMonthChange: (value: boolean) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="panel input-panel" id="lap-phieu">
      <SectionTitle eyebrow="Nhập liệu" title="Lập mệnh bàn" note="Ngày giờ sinh được quy đổi theo lịch pháp trước khi an bốn trụ." />
      <form className="birth-form" onSubmit={onSubmit}>
        <div className="choice-line" role="group" aria-label="Loại lịch">
          <button className={cx("choice", calendarType === "solar" && "active")} type="button" onClick={() => onCalendarChange("solar")}>Dương lịch</button>
          <button className={cx("choice", calendarType === "lunar" && "active")} type="button" onClick={() => onCalendarChange("lunar")}>Âm lịch</button>
        </div>
        <div className="form-grid">
          <label><span>{calendarType === "lunar" ? "Ngày âm lịch" : "Ngày dương lịch"}</span><input name="birthDate" type="date" defaultValue="1990-10-12" required /><small>{calendarType === "lunar" ? "Tự quy đổi sang ngày dương trước khi an trụ." : "Dùng trực tiếp làm ngày sinh dương lịch."}</small></label>
          <label><span>Giờ sinh</span><div className="time-grid"><select name="birthHour" defaultValue="14" aria-label="Giờ sinh">{Array.from({ length: 24 }, (_, hour) => { const value = String(hour).padStart(2, "0"); return <option key={value} value={value}>{value}</option>; })}</select><select name="birthMinute" defaultValue="30" aria-label="Phút sinh">{Array.from({ length: 60 }, (_, minute) => { const value = String(minute).padStart(2, "0"); return <option key={value} value={value}>{value}</option>; })}</select></div><small>Từ 23:00 tính theo quy tắc giờ Tý đổi ngày cho trụ ngày.</small></label>
          <label><span>Giới tính</span><div className="choice-line compact" role="group" aria-label="Giới tính"><button className={cx("choice", gender === "male" && "active")} type="button" onClick={() => onGenderChange("male")}>Nam</button><button className={cx("choice", gender === "female" && "active")} type="button" onClick={() => onGenderChange("female")}>Nữ</button><button className={cx("choice", gender === "other" && "active")} type="button" onClick={() => onGenderChange("other")}>Khác</button></div><small>Dùng để xác định chiều thuận, nghịch Đại vận.</small></label>
          <label><span>Múi giờ</span><select name="timezone" defaultValue="Asia/Ho_Chi_Minh"><option value="Asia/Ho_Chi_Minh">UTC+07:00 Việt Nam</option><option value="Asia/Shanghai">UTC+08:00</option><option value="Asia/Tokyo">UTC+09:00</option></select><small>Lập trụ theo giờ địa phương của múi giờ đã chọn.</small></label>
          <label className="wide"><span>Nơi sinh</span><input name="birthPlace" type="text" defaultValue="Tiền Giang, Việt Nam" placeholder="Tùy chọn" /><small>Ghi lên phiếu để đối chiếu. Tọa độ địa lý sẽ đưa vào lớp sau.</small></label>
          {calendarType === "lunar" ? <label className="wide checkbox-row"><input type="checkbox" checked={isLeapMonth} onChange={(event) => onLeapMonthChange(event.target.checked)} /><span>Tháng nhuận âm lịch</span></label> : null}
        </div>
        <button className="primary-action" type="submit">Dựng lá phiếu</button>
        {error ? <p className="error-box">{error}</p> : null}
      </form>
    </section>
  );
}

function InputSummary({ result, content }: { result: DeriveFourPillarsOutput; content: ResultContentLayer }) {
  const metaRows = [["Ngày nhập", `${content.inputSummary.birthDate} · ${content.inputSummary.calendarType}`], ["Ngày dương dùng để tính", result.meta.normalizedSolarDate ?? content.inputSummary.birthDate], ["Giờ sinh", content.inputSummary.birthTime], ["Múi giờ", content.inputSummary.timezone], ["Giới tính", toGenderLabel(result.majorLuck.gender)], ["Nơi sinh", content.inputSummary.birthPlace ?? "Không ghi"], ["Tiết khí tháng", result.meta.monthSolarTerm ? `${result.meta.monthSolarTerm} · ${result.meta.monthSolarTermUtc}` : "Đã an theo tiết khí"], ["Quy tắc ngày", result.meta.isLateZiHour ? "23:00 trở đi đã chuyển ngày theo giờ Tý" : "Không chạm mốc giờ Tý đổi ngày"]];
  return <section className="panel summary-panel"><SectionTitle eyebrow="Thông tin phiếu" title="Dữ liệu đã dùng để an trụ" /><dl className="summary-grid">{metaRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>;
}

function PillarOverview({ content }: { content: ResultContentLayer }) {
  return (
    <section className="panel chart-panel" id="la-so">
      <SectionTitle eyebrow="Lá số" title="Bảng Tứ Trụ" note="Chỉ hiển thị các phần đã được an từ lịch, tiết khí và Can Chi." />
      <section className={`day-master-card element-${elementClass[content.dayMasterSummary.element] || "wood"}`}><div><p>Nhật chủ</p><strong>{content.dayMasterSummary.name}</strong><span>{content.dayMasterSummary.han} · {content.dayMasterSummary.element}</span></div><p>{content.dayMasterSummary.note}</p></section>
      <div className="pillar-card-grid" aria-label="Tổng quan bốn trụ">{content.pillars.map((card) => <article className={cx("pillar-oracle-card", `pillar-${card.key}`, `element-${elementClass[card.stemElement] || "wood"}`)} key={card.key}><p>{card.label}</p><h3>{card.pillar}</h3><strong>{card.pillarHan}</strong><dl><div><dt>Thiên can</dt><dd>{card.stem} · {card.stemHan} · {card.stemElement}</dd></div><div><dt>Địa chi</dt><dd>{card.branch} · {card.branchHan}</dd></div><div><dt>Thập thần</dt><dd>{card.tenGod}</dd></div></dl><small>{card.note}</small></article>)}</div>
    </section>
  );
}

function ElementBalance({ content }: { content: ResultContentLayer }) {
  const maxCount = Math.max(...elementOrder.map((element) => content.elementBalance.counts[element] ?? 0), 1);
  return <section className="panel element-panel"><SectionTitle eyebrow="Ngũ hành" title="Phân bố Can, Chi và Tàng can" /><div className="element-grid">{elementOrder.map((element) => { const count = content.elementBalance.counts[element] ?? 0; return <article className={cx("element-card", `element-${elementClass[element]}`)} key={element}><header><span>{element}</span><strong>{count}</strong></header><div className="bar"><span style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }} /></div></article>; })}</div><p className="note-line">{content.elementBalance.note}</p></section>;
}

function TenGodPanel({ content }: { content: ResultContentLayer }) {
  const computed = content.tenGodOverview.filter((item) => item.status === "computed" && item.count > 0);
  return <section className="panel ten-god-panel"><SectionTitle eyebrow="Thập thần" title="Các Thập thần đã xuất hiện" note="Ẩn các mục chưa xuất hiện để phiếu gọn và dễ đọc." /><div className="ten-god-grid">{computed.map((item) => <article className="ten-god-card" key={item.name}><header><strong>{item.name}</strong><span>{item.count}</span></header><p>{item.positions}</p><small>{item.note}</small></article>)}</div></section>;
}

function MajorLuckPanel({ content }: { content: ResultContentLayer }) {
  return <section className="panel major-luck-panel" id="dai-van"><SectionTitle eyebrow="Đại vận" title="Dòng vận mười bước" note={`${content.majorLuck.directionLabel} · ${content.majorLuck.startAgeLabel}`} /><div className="major-luck-summary"><p>{content.majorLuck.directionRule}</p><p>Khởi vận từ: <strong>{content.majorLuck.startTerm}</strong></p><p>{content.majorLuck.note}</p></div><div className="table-wrap"><table className="luck-table"><thead><tr><th>#</th><th>Đại vận</th><th>Tuổi</th><th>Năm dương lịch</th><th>Ngày bắt đầu</th><th>Ngũ hành</th></tr></thead><tbody>{content.majorLuck.cycles.map((cycle) => <tr key={`${cycle.index}-${cycle.pillarHan}`}><td>{cycle.index}</td><td><strong>{cycle.pillar}</strong><small>{cycle.pillarHan}</small></td><td>{cycle.ageLabel}</td><td>{cycle.years}</td><td>{cycle.startDate}</td><td>{cycle.stemElement} / {cycle.branchElement}</td></tr>)}</tbody></table></div></section>;
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

function renderChatContent(content: string): ReactNode {
  const lines = content.split(/\r?\n/);
  return lines.map((raw, index) => {
    const line = raw.trim();
    if (!line) return <div className="chat-md-gap" key={index} />;
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) return <h4 className="chat-md-heading" key={index}>{renderInlineMarkdown(heading[2])}</h4>;
    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) return <p className="chat-md-bullet" key={index}>{renderInlineMarkdown(bullet[1])}</p>;
    return <p className="chat-md-p" key={index}>{renderInlineMarkdown(line)}</p>;
  });
}

function followupExtraInstruction(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("thiếu dữ liệu") || normalized.includes("chưa đủ dữ liệu")) {
    return "Đây là câu hỏi audit dữ liệu. Trả lời theo cấu trúc: Đã có gì; Thiếu gì; Vì sao thiếu đó quan trọng; Ưu tiên bổ sung module nào tiếp theo; Người dùng nên hỏi câu gì tiếp. Bám sát lá phiếu hiện tại, không trả lời chung chung.";
  }
  return "Đây là lượt hỏi tiếp. Trả lời đúng câu hỏi mới nhất, không lặp lại toàn bộ bài tổng luận. Nếu câu hỏi rộng, hãy gợi ý các hướng đào sâu dựa trên chính lá phiếu. Kết bằng một câu hỏi mở tự nhiên.";
}

function InterpretationPanel({ state, onInterpret, onOpenChat, onLogin }: { state: InterpretationState; onInterpret: () => void; onOpenChat: () => void; onLogin: () => void }) {
  const isBusy = state.status === "saving" || state.status === "running";
  return (
    <section className="panel interpretation-panel" id="luan">
      <SectionTitle eyebrow="Luận" title="Cố vấn Tứ Trụ" note="Luận mở trong khung chat riêng, có thể hỏi tiếp dựa trên lá phiếu." />
      <div className="interpretation-actions">
        <button className="primary-action" type="button" onClick={onInterpret} disabled={isBusy}>{state.status === "saving" ? "Đang chuẩn bị..." : state.status === "running" ? "Đang luận..." : "Luận với Cố vấn"}</button>
        <button className={cx("history-link", "inline-link", storedToken() && "signed-in")} type="button" onClick={onLogin}>{storedToken() ? "Đã đăng nhập" : state.authAction ? "Đăng nhập lại" : "Đăng nhập"}</button>
        <a className="history-link" href="/">Trang chủ</a>
      </div>
      {state.message ? <p className={cx("interpretation-status", state.status === "error" && "error-text")}>{state.message}</p> : null}
      {state.authAction ? <p className="interpretation-status"><button className="inline-text-button" type="button" onClick={onLogin}>Mở đăng nhập tại chỗ</button></p> : null}
      {state.reply ? <div className="chat-open-row"><button className="primary-action" type="button" onClick={onOpenChat}>Mở khung chat</button><span>Cố vấn sẽ hỏi tiếp theo lá phiếu, không chỉ trả lời một chiều.</span></div> : null}
    </section>
  );
}

function ChatModal({ open, messages, question, busy, status, onClose, onQuestionChange, onAsk, onSuggest }: { open: boolean; messages: ChatMessage[]; question: string; busy: boolean; status?: string; onClose: () => void; onQuestionChange: (value: string) => void; onAsk: () => void; onSuggest: (value: string) => void }) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  if (!open) return null;
  const suggestions = ["Luận sâu Nhật chủ", "Nói kỹ phần Ngũ hành", "Phân tích Thập thần nổi bật", "Đại vận đầu cần chú ý gì?", "Phần nào còn thiếu dữ liệu?"];
  return (
    <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Chat luận Tứ Trụ">
      <div className="chat-card">
        <header className="chat-head"><div><p>Cố vấn Tứ Trụ</p><h3>Hỏi tiếp trên lá phiếu này</h3></div><button type="button" onClick={onClose}>Đóng</button></header>
        <div className="chat-body">{messages.map((item, index) => <article className={cx("chat-bubble", item.role)} key={`${item.role}-${index}`}><span>{item.role === "user" ? "Bạn" : "Cố vấn"}</span><div className="chat-content">{renderChatContent(item.content)}</div></article>)}</div>
        <div className="chat-suggestion-shell">
          <button className="chat-suggest-toggle" type="button" aria-expanded={suggestionsOpen} onClick={() => setSuggestionsOpen((value) => !value)}>
            Hỏi thêm <span>{suggestionsOpen ? "⌃" : "⌄"}</span>
          </button>
          {suggestionsOpen ? (
            <div className="chat-suggestions">
              {suggestions.map((item) => <button type="button" key={item} onClick={() => { onSuggest(item); setSuggestionsOpen(false); }}>{item}</button>)}
            </div>
          ) : null}
        </div>
        <form className="chat-form" onSubmit={(event) => { event.preventDefault(); onAsk(); }}>
          <textarea value={question} onChange={(event) => onQuestionChange(event.target.value)} placeholder="Ví dụ: Luận sâu phần Nhật chủ và liên hệ với Ngũ hành..." />
          <button className="primary-action" type="submit" disabled={busy || !question.trim()}>{busy ? "Đang hỏi..." : "Hỏi tiếp"}</button>
        </form>
        {status ? <p className="chat-status">{status}</p> : null}
      </div>
    </div>
  );
}

function ResultSheet({ result, content, interpretation, onInterpret, onOpenChat, onLogin }: { result: DeriveFourPillarsOutput; content: ResultContentLayer; interpretation: InterpretationState; onInterpret: () => void; onOpenChat: () => void; onLogin: () => void }) {
  return <div className="result-stack"><InputSummary result={result} content={content} /><PillarOverview content={content} /><ElementBalance content={content} /><TenGodPanel content={content} /><MajorLuckPanel content={content} /><section className="panel"><SectionTitle eyebrow="Lưu ý" title="Giới hạn diễn giải" note={content.guardrail} /></section><InterpretationPanel state={interpretation} onInterpret={onInterpret} onOpenChat={onOpenChat} onLogin={onLogin} /></div>;
}

export default function App() {
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [gender, setGender] = useState<GenderType>("male");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [chartInput, setChartInput] = useState<DeriveFourPillarsInput | null>(null);
  const [chartResult, setChartResult] = useState<DeriveFourPillarsOutput | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretationState>({ status: "idle" });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatStatus, setChatStatus] = useState("");

  const resultContent = useMemo(() => { if (!chartResult) return null; try { return buildResultContentLayer(chartResult); } catch { return null; } }, [chartResult]);

  const handleLogin = async () => {
    try {
      const token = await getFreshAuthToken(true);
      if (token) {
        setInterpretation((prev) => ({ ...prev, message: "Đã làm mới phiên đăng nhập trong app." }));
        return;
      }
    } catch {
      // Open Clerk below.
    }
    try {
      if (window.HonThoAuth?.signIn) {
        await window.HonThoAuth.signIn({ nextPath: "/nguthuat/menh/tutru/" });
        return;
      }
      const clerk = await ensureClerkLoaded();
      if (clerk?.openSignIn) clerk.openSignIn({ afterSignInUrl: location.href, afterSignUpUrl: location.href });
      else location.href = ACCOUNT_RETURN_URL;
    } catch {
      location.href = ACCOUNT_RETURN_URL;
    }
  };

  const handleBuildChart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const input = buildInputFromForm(event.currentTarget, calendarType, gender, isLeapMonth);
      const result = deriveFourPillars(input);
      setChartInput(input);
      setChartResult(result);
      setChartError(null);
      setInterpretation({ status: "idle" });
      setChatMessages([]);
      setChatOpen(false);
      window.setTimeout(() => document.getElementById("la-so")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không dựng được lá phiếu với dữ liệu hiện tại.";
      setChartInput(null);
      setChartResult(null);
      setChartError(message);
      setInterpretation({ status: "idle" });
    }
  };

  const handleInterpretChart = async () => {
    if (!chartInput || !chartResult || !resultContent) { setInterpretation({ status: "error", message: "Chưa có lá số để luận." }); return; }
    try {
      const title = `Luận Tứ Trụ ${chartInput.birthDate} ${chartInput.birthTime}`;
      setInterpretation({ status: "saving", message: "Đang chuẩn bị lá phiếu cho Cố vấn Tứ Trụ..." });
      const saved = await apiRequest<{ appRun: { id: string } }>("/nguthuat/tutru/app-runs", { method: "POST", body: { input: chartInput, result: chartResult, contentLayer: resultContent, title } });
      setInterpretation({ status: "running", appRunId: saved.appRun.id, message: "Cố vấn Tứ Trụ đang đọc lá phiếu và viết phần luận..." });
      const conversation = await apiRequest<{ conversation: { id: string } }>("/conversations", { method: "POST", body: { appKey: "tu_tru", title, sourceAppRunId: saved.appRun.id, initialMessage: "Hãy luận tổng quan lá số Tứ Trụ đã an theo dữ liệu engine. Không xác nhận lại dữ liệu. Không nhắc dữ liệu kỹ thuật. Bắt đầu bằng ## Tổng quan và kết bằng các câu hỏi gợi mở theo lá phiếu." } });
      const ai = await apiRequest<AiReplyResponse>(`/conversations/${conversation.conversation.id}/ai-reply`, { method: "POST", body: { extraInstruction: "Viết bài luận sâu, không sơ sài. Mỗi mục có quan sát, diễn giải, liên hệ chéo và giới hạn. Chủ động đề xuất 3 câu hỏi tiếp theo dựa trên chính điểm nổi bật của lá phiếu, không dùng câu mẫu chung chung." } });
      setInterpretation({ status: "done", appRunId: saved.appRun.id, conversationId: conversation.conversation.id, provider: ai.provider, model: ai.model, message: "Cố vấn Tứ Trụ đã mở khung luận. Bạn có thể hỏi tiếp ngay trên lá phiếu này.", reply: ai.message.content });
      setChatMessages([{ role: "assistant", content: ai.message.content }, { role: "assistant", content: "Bạn muốn đào sâu theo hướng nào: Nhật chủ, Ngũ hành, Thập thần hay Đại vận?" }]);
      setChatOpen(true);
    } catch (error) {
      if (error instanceof AuthSessionError) { setInterpretation({ status: "error", message: error.message, authAction: true }); return; }
      const message = error instanceof Error ? error.message : "Không gọi được phần luận.";
      setInterpretation({ status: "error", message });
    }
  };

  const handleAskFollowup = async () => {
    const question = chatQuestion.trim();
    if (!question || !interpretation.conversationId) return;
    setChatQuestion("");
    setChatBusy(true);
    setChatStatus("Cố vấn đang đọc câu hỏi tiếp theo...");
    setChatMessages((items) => [...items, { role: "user", content: question }]);
    try {
      const ai = await apiRequest<AiReplyResponse>(`/conversations/${interpretation.conversationId}/ai-reply`, { method: "POST", body: { message: question, extraInstruction: followupExtraInstruction(question) } });
      setChatMessages((items) => [...items, { role: "assistant", content: ai.message.content }]);
      setInterpretation((prev) => ({ ...prev, status: "done", reply: ai.message.content, provider: ai.provider, model: ai.model }));
      setChatStatus("");
    } catch (error) {
      const message = error instanceof AuthSessionError ? `${error.message} Bấm Đăng nhập rồi gửi lại câu hỏi.` : error instanceof Error ? error.message : "Không hỏi tiếp được.";
      setChatStatus(message);
    } finally {
      setChatBusy(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="hero-panel compact-hero">
        <nav className="top-nav" aria-label="Điều hướng Tứ Trụ"><a href="/">Trang chủ</a><a href="#lap-phieu">Nhập liệu</a><a href="#la-so">Lá số</a><a href="#dai-van">Đại vận</a><a href="#luan">Luận</a><button className={cx(storedToken() && "signed-in")} type="button" onClick={handleLogin}>{storedToken() ? "Đã đăng nhập" : "Đăng nhập"}</button></nav>
        <img className="home-hero-card" src={homeTuTruImage} alt="Mệnh Bàn" style={{ width: "100%", display: "block", marginTop: "18px", borderRadius: "18px", border: "1px solid rgba(255, 220, 137, 0.36)", boxShadow: "0 22px 60px rgba(0, 0, 0, 0.46)" }} />
      </header>
      <InputPanel calendarType={calendarType} gender={gender} isLeapMonth={isLeapMonth} error={chartError} onCalendarChange={setCalendarType} onGenderChange={setGender} onLeapMonthChange={setIsLeapMonth} onSubmit={handleBuildChart} />
      {chartResult && resultContent ? <ResultSheet result={chartResult} content={resultContent} interpretation={interpretation} onInterpret={handleInterpretChart} onOpenChat={() => setChatOpen(true)} onLogin={handleLogin} /> : <section className="panel empty-panel"><h2>Chưa có lá phiếu</h2><p>Nhập ngày giờ sinh rồi bấm Dựng lá phiếu. Chưa có dữ liệu thì trang không dựng kết quả mẫu.</p></section>}
      <ChatModal open={chatOpen} messages={chatMessages} question={chatQuestion} busy={chatBusy} status={chatStatus} onClose={() => setChatOpen(false)} onQuestionChange={setChatQuestion} onAsk={handleAskFollowup} onSuggest={setChatQuestion} />
    </main>
  );
}
