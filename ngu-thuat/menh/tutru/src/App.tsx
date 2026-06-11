import { FormEvent, useMemo, useState } from "react";
import homeTuTruImage from "../../../../home-tu-tru.png";
import { deriveFourPillars } from "./engine/deriveFourPillars";
import { buildResultContentLayer, type ResultContentLayer } from "./engine/resultContentLayer";
import type { CalendarType, DeriveFourPillarsInput, DeriveFourPillarsOutput, GenderType } from "./engine/types";

const elementOrder = ["Mộc", "Hỏa", "Thổ", "Kim", "Thủy"] as const;
const elementClass: Record<string, string> = {
  Mộc: "wood",
  Hỏa: "fire",
  Thổ: "earth",
  Kim: "metal",
  Thủy: "water"
};

type InterpretStatus = "idle" | "saving" | "running" | "done" | "error";

type InterpretationState = {
  status: InterpretStatus;
  message?: string;
  appRunId?: string;
  conversationId?: string;
  reply?: string;
  provider?: string;
  model?: string;
};

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function toGenderLabel(gender: GenderType) {
  if (gender === "male") return "Nam";
  if (gender === "female") return "Nữ";
  return "Khác";
}

function getApiBase() {
  return (localStorage.getItem("hontho_api_base") || "/api").replace(/\/$/, "");
}

function getAuthToken() {
  return localStorage.getItem("hontho_user_token") || "";
}

async function apiRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getAuthToken().trim();
  if (!token) {
    throw new Error("Chưa đăng nhập. Vào /account đăng nhập trước, sau đó quay lại bấm Luận.");
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({ error: response.statusText }));
  if (!response.ok) {
    const message = typeof data?.error === "string" ? data.error : "API chưa xử lý được yêu cầu.";
    const detail = typeof data?.detail === "string" ? ` ${data.detail}` : "";
    throw new Error(`${message}${detail}`.trim());
  }
  return data as T;
}

function buildInputFromForm(
  form: HTMLFormElement,
  calendarType: CalendarType,
  gender: GenderType,
  isLeapMonth: boolean
): DeriveFourPillarsInput {
  const data = new FormData(form);
  const birthDate = String(data.get("birthDate") ?? "").trim();
  const birthHour = String(data.get("birthHour") ?? "00").padStart(2, "0");
  const birthMinute = String(data.get("birthMinute") ?? "00").padStart(2, "0");
  const timezone = String(data.get("timezone") ?? "Asia/Ho_Chi_Minh");
  const birthPlace = String(data.get("birthPlace") ?? "").trim();

  return {
    birthDate,
    birthTime: `${birthHour}:${birthMinute}`,
    calendarType,
    timezone,
    gender,
    birthPlace: birthPlace || undefined,
    isLeapMonth: calendarType === "lunar" ? isLeapMonth : false,
    dayBoundaryMode: "zi-hour-rollover"
  };
}

function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <header className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {note ? <span>{note}</span> : null}
    </header>
  );
}

function InputPanel({
  calendarType,
  gender,
  isLeapMonth,
  error,
  onCalendarChange,
  onGenderChange,
  onLeapMonthChange,
  onSubmit
}: {
  calendarType: CalendarType;
  gender: GenderType;
  isLeapMonth: boolean;
  error: string | null;
  onCalendarChange: (value: CalendarType) => void;
  onGenderChange: (value: GenderType) => void;
  onLeapMonthChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="panel input-panel" id="lap-phieu">
      <SectionTitle eyebrow="Nhập liệu" title="Lập mệnh bàn" note="Ngày giờ sinh được quy đổi theo lịch pháp trước khi an bốn trụ." />
      <form className="birth-form" onSubmit={onSubmit}>
        <div className="choice-line" role="group" aria-label="Loại lịch">
          <button className={cx("choice", calendarType === "solar" && "active")} type="button" onClick={() => onCalendarChange("solar")}>Dương lịch</button>
          <button className={cx("choice", calendarType === "lunar" && "active")} type="button" onClick={() => onCalendarChange("lunar")}>Âm lịch</button>
        </div>

        <div className="form-grid">
          <label>
            <span>{calendarType === "lunar" ? "Ngày âm lịch" : "Ngày dương lịch"}</span>
            <input name="birthDate" type="date" defaultValue="1990-10-12" required />
            <small>{calendarType === "lunar" ? "Tự quy đổi sang ngày dương trước khi an trụ." : "Dùng trực tiếp làm ngày sinh dương lịch."}</small>
          </label>

          <label>
            <span>Giờ sinh</span>
            <div className="time-grid">
              <select name="birthHour" defaultValue="14" aria-label="Giờ sinh">
                {Array.from({ length: 24 }, (_, hour) => {
                  const value = String(hour).padStart(2, "0");
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
              <select name="birthMinute" defaultValue="30" aria-label="Phút sinh">
                {Array.from({ length: 60 }, (_, minute) => {
                  const value = String(minute).padStart(2, "0");
                  return <option key={value} value={value}>{value}</option>;
                })}
              </select>
            </div>
            <small>Từ 23:00 tính theo quy tắc giờ Tý đổi ngày cho trụ ngày.</small>
          </label>

          <label>
            <span>Giới tính</span>
            <div className="choice-line compact" role="group" aria-label="Giới tính">
              <button className={cx("choice", gender === "male" && "active")} type="button" onClick={() => onGenderChange("male")}>Nam</button>
              <button className={cx("choice", gender === "female" && "active")} type="button" onClick={() => onGenderChange("female")}>Nữ</button>
              <button className={cx("choice", gender === "other" && "active")} type="button" onClick={() => onGenderChange("other")}>Khác</button>
            </div>
            <small>Dùng để xác định chiều thuận, nghịch Đại vận.</small>
          </label>

          <label>
            <span>Múi giờ</span>
            <select name="timezone" defaultValue="Asia/Ho_Chi_Minh">
              <option value="Asia/Ho_Chi_Minh">UTC+07:00 Việt Nam</option>
              <option value="Asia/Shanghai">UTC+08:00</option>
              <option value="Asia/Tokyo">UTC+09:00</option>
            </select>
            <small>Lập trụ theo giờ địa phương của múi giờ đã chọn.</small>
          </label>

          <label className="wide">
            <span>Nơi sinh</span>
            <input name="birthPlace" type="text" defaultValue="Tiền Giang, Việt Nam" placeholder="Tùy chọn" />
            <small>Ghi lên phiếu để đối chiếu. Tọa độ địa lý sẽ đưa vào lớp sau.</small>
          </label>

          {calendarType === "lunar" ? (
            <label className="wide checkbox-row">
              <input type="checkbox" checked={isLeapMonth} onChange={(event) => onLeapMonthChange(event.target.checked)} />
              <span>Tháng nhuận âm lịch</span>
            </label>
          ) : null}
        </div>

        <button className="primary-action" type="submit">Dựng lá phiếu</button>
        {error ? <p className="error-box">{error}</p> : null}
      </form>
    </section>
  );
}

function InputSummary({ result, content }: { result: DeriveFourPillarsOutput; content: ResultContentLayer }) {
  const metaRows = [
    ["Ngày nhập", `${content.inputSummary.birthDate} · ${content.inputSummary.calendarType}`],
    ["Ngày dương dùng để tính", result.meta.normalizedSolarDate ?? content.inputSummary.birthDate],
    ["Giờ sinh", content.inputSummary.birthTime],
    ["Múi giờ", content.inputSummary.timezone],
    ["Giới tính", toGenderLabel(result.majorLuck.gender)],
    ["Nơi sinh", content.inputSummary.birthPlace ?? "Không ghi"],
    ["Tiết khí tháng", result.meta.monthSolarTerm ? `${result.meta.monthSolarTerm} · ${result.meta.monthSolarTermUtc}` : "Đã an theo tiết khí"],
    ["Quy tắc ngày", result.meta.isLateZiHour ? "23:00 trở đi đã chuyển ngày theo giờ Tý" : "Không chạm mốc giờ Tý đổi ngày"]
  ];

  return (
    <section className="panel summary-panel">
      <SectionTitle eyebrow="Thông tin phiếu" title="Dữ liệu đã dùng để an trụ" />
      <dl className="summary-grid">
        {metaRows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PillarOverview({ content }: { content: ResultContentLayer }) {
  return (
    <section className="panel chart-panel" id="la-so">
      <SectionTitle eyebrow="Lá số" title="Bảng Tứ Trụ" note="Chỉ hiển thị các phần đã được an từ lịch, tiết khí và Can Chi." />
      <section className={`day-master-card element-${elementClass[content.dayMasterSummary.element] || "wood"}`}>
        <div>
          <p>Nhật chủ</p>
          <strong>{content.dayMasterSummary.name}</strong>
          <span>{content.dayMasterSummary.han} · {content.dayMasterSummary.element}</span>
        </div>
        <p>{content.dayMasterSummary.note}</p>
      </section>
      <div className="pillar-card-grid" aria-label="Tổng quan bốn trụ">
        {content.pillars.map((card) => (
          <article className={cx("pillar-oracle-card", `pillar-${card.key}`, `element-${elementClass[card.stemElement] || "wood"}`)} key={card.key}>
            <p>{card.label}</p>
            <h3>{card.pillar}</h3>
            <strong>{card.pillarHan}</strong>
            <dl>
              <div><dt>Thiên can</dt><dd>{card.stem} · {card.stemHan} · {card.stemElement}</dd></div>
              <div><dt>Địa chi</dt><dd>{card.branch} · {card.branchHan}</dd></div>
              <div><dt>Thập thần</dt><dd>{card.tenGod}</dd></div>
            </dl>
            <small>{card.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ElementBalance({ content }: { content: ResultContentLayer }) {
  const maxCount = Math.max(...elementOrder.map((element) => content.elementBalance.counts[element] ?? 0), 1);
  return (
    <section className="panel element-panel">
      <SectionTitle eyebrow="Ngũ hành" title="Phân bố Can, Chi và Tàng can" />
      <div className="element-grid">
        {elementOrder.map((element) => {
          const count = content.elementBalance.counts[element] ?? 0;
          return (
            <article className={cx("element-card", `element-${elementClass[element]}`)} key={element}>
              <header><span>{element}</span><strong>{count}</strong></header>
              <div className="bar"><span style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }} /></div>
            </article>
          );
        })}
      </div>
      <p className="note-line">{content.elementBalance.note}</p>
    </section>
  );
}

function TenGodPanel({ content }: { content: ResultContentLayer }) {
  const computed = content.tenGodOverview.filter((item) => item.status === "computed" && item.count > 0);
  return (
    <section className="panel ten-god-panel">
      <SectionTitle eyebrow="Thập thần" title="Các Thập thần đã xuất hiện" note="Ẩn các mục chưa xuất hiện để phiếu gọn và dễ đọc." />
      <div className="ten-god-grid">
        {computed.map((item) => (
          <article className="ten-god-card" key={item.name}>
            <header><strong>{item.name}</strong><span>{item.count}</span></header>
            <p>{item.positions}</p>
            <small>{item.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function MajorLuckPanel({ content }: { content: ResultContentLayer }) {
  return (
    <section className="panel major-luck-panel" id="dai-van">
      <SectionTitle eyebrow="Đại vận" title="Dòng vận mười bước" note={`${content.majorLuck.directionLabel} · ${content.majorLuck.startAgeLabel}`} />
      <div className="major-luck-summary">
        <p>{content.majorLuck.directionRule}</p>
        <p>Khởi vận từ: <strong>{content.majorLuck.startTerm}</strong></p>
        <p>{content.majorLuck.note}</p>
      </div>
      <div className="table-wrap">
        <table className="luck-table">
          <thead><tr><th>#</th><th>Đại vận</th><th>Tuổi</th><th>Năm dương lịch</th><th>Ngày bắt đầu</th><th>Ngũ hành</th></tr></thead>
          <tbody>
            {content.majorLuck.cycles.map((cycle) => (
              <tr key={`${cycle.index}-${cycle.pillarHan}`}>
                <td>{cycle.index}</td>
                <td><strong>{cycle.pillar}</strong><small>{cycle.pillarHan}</small></td>
                <td>{cycle.ageLabel}</td>
                <td>{cycle.years}</td>
                <td>{cycle.startDate}</td>
                <td>{cycle.stemElement} / {cycle.branchElement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InterpretationPanel({ state, onInterpret }: { state: InterpretationState; onInterpret: () => void }) {
  const isBusy = state.status === "saving" || state.status === "running";
  return (
    <section className="panel interpretation-panel" id="luan">
      <SectionTitle
        eyebrow="Luận"
        title="Luận tổng quan theo dữ liệu đã an"
        note="Lưu dữ liệu trước, sau đó gọi đúng agent đang active cho app này."
      />
      <div className="interpretation-actions">
        <button className="primary-action" type="button" onClick={onInterpret} disabled={isBusy}>
          {state.status === "saving" ? "Đang lưu..." : state.status === "running" ? "Đang luận..." : "Luận"}
        </button>
        <a className="history-link" href="/account">Đăng nhập</a>
        <a className="history-link" href="/">Trang chủ</a>
      </div>
      {state.message ? <p className={cx("interpretation-status", state.status === "error" && "error-text")}>{state.message}</p> : null}
      {state.appRunId || state.conversationId ? (
        <div className="interpretation-meta">
          {state.appRunId ? <span>App run: {state.appRunId}</span> : null}
          {state.conversationId ? <span>Conversation: {state.conversationId}</span> : null}
          {state.provider ? <span>{state.provider} · {state.model}</span> : null}
        </div>
      ) : null}
      {state.reply ? <div className="ai-reply-box">{state.reply}</div> : null}
    </section>
  );
}

function ResultSheet({
  result,
  content,
  interpretation,
  onInterpret
}: {
  result: DeriveFourPillarsOutput;
  content: ResultContentLayer;
  interpretation: InterpretationState;
  onInterpret: () => void;
}) {
  return (
    <div className="result-stack">
      <InputSummary result={result} content={content} />
      <PillarOverview content={content} />
      <ElementBalance content={content} />
      <TenGodPanel content={content} />
      <MajorLuckPanel content={content} />
      <section className="panel">
        <SectionTitle eyebrow="Lưu ý" title="Giới hạn diễn giải" note={content.guardrail} />
      </section>
      <InterpretationPanel state={interpretation} onInterpret={onInterpret} />
    </div>
  );
}

export default function App() {
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [gender, setGender] = useState<GenderType>("male");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [chartInput, setChartInput] = useState<DeriveFourPillarsInput | null>(null);
  const [chartResult, setChartResult] = useState<DeriveFourPillarsOutput | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretationState>({ status: "idle" });

  const resultContent = useMemo(() => {
    if (!chartResult) return null;
    try {
      return buildResultContentLayer(chartResult);
    } catch (error) {
      console.error("result content error", error);
      return null;
    }
  }, [chartResult]);

  const handleBuildChart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const input = buildInputFromForm(event.currentTarget, calendarType, gender, isLeapMonth);
      const result = deriveFourPillars(input);
      setChartInput(input);
      setChartResult(result);
      setChartError(null);
      setInterpretation({ status: "idle" });
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
    if (!chartInput || !chartResult || !resultContent) {
      setInterpretation({ status: "error", message: "Chưa có lá số để luận." });
      return;
    }

    try {
      const title = `Luận Tứ Trụ ${chartInput.birthDate} ${chartInput.birthTime}`;
      setInterpretation({ status: "saving", message: "Đang lưu dữ liệu trước khi gọi agent..." });

      const saved = await apiRequest<{ appRun: { id: string } }>("/nguthuat/tutru/app-runs", {
        method: "POST",
        body: {
          input: chartInput,
          result: chartResult,
          contentLayer: resultContent,
          title
        }
      });

      setInterpretation({ status: "running", appRunId: saved.appRun.id, message: "Đã lưu dữ liệu. Đang tạo hội thoại và gọi agent đang active cho app tu_tru..." });

      const conversation = await apiRequest<{ conversation: { id: string } }>("/conversations", {
        method: "POST",
        body: {
          appKey: "tu_tru",
          title,
          sourceAppRunId: saved.appRun.id,
          initialMessage: "Hãy luận tổng quan lá số Tứ Trụ này theo dữ liệu engine đã lưu. Chỉ dùng app_run, bốn trụ, Ngũ hành, Tàng can, Thập thần và Đại vận đã có. Không tự tính lại lá số, không bịa dụng thần, vượng suy hoặc lưu niên nếu dữ liệu chưa cung cấp."
        }
      });

      const ai = await apiRequest<{
        message: { content: string };
        provider: string;
        model: string;
      }>(`/conversations/${conversation.conversation.id}/ai-reply`, {
        method: "POST",
        body: {
          extraInstruction: "Trả lời thành các mục ngắn: Tổng quan, Nhật chủ, Ngũ hành, Thập thần, Đại vận, Phần chưa đủ dữ liệu. Không phán tuyệt đối."
        }
      });

      setInterpretation({
        status: "done",
        appRunId: saved.appRun.id,
        conversationId: conversation.conversation.id,
        provider: ai.provider,
        model: ai.model,
        message: "Đã lưu dữ liệu, tạo hội thoại và nhận phần luận.",
        reply: ai.message.content
      });
      window.setTimeout(() => document.getElementById("luan")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không gọi được phần luận.";
      setInterpretation({ status: "error", message });
    }
  };

  return (
    <main className="page-shell">
      <header className="hero-panel compact-hero">
        <nav className="top-nav" aria-label="Điều hướng Tứ Trụ">
          <a href="/">Trang chủ</a>
          <a href="#lap-phieu">Nhập liệu</a>
          <a href="#la-so">Lá số</a>
          <a href="#dai-van">Đại vận</a>
          <a href="#luan">Luận</a>
        </nav>
        <img
          className="home-hero-card"
          src={homeTuTruImage}
          alt="Mệnh Bàn"
          style={{
            width: "100%",
            display: "block",
            marginTop: "18px",
            borderRadius: "18px",
            border: "1px solid rgba(255, 220, 137, 0.36)",
            boxShadow: "0 22px 60px rgba(0, 0, 0, 0.46)"
          }}
        />
      </header>

      <InputPanel
        calendarType={calendarType}
        gender={gender}
        isLeapMonth={isLeapMonth}
        error={chartError}
        onCalendarChange={setCalendarType}
        onGenderChange={setGender}
        onLeapMonthChange={setIsLeapMonth}
        onSubmit={handleBuildChart}
      />

      {chartResult && resultContent ? (
        <ResultSheet result={chartResult} content={resultContent} interpretation={interpretation} onInterpret={handleInterpretChart} />
      ) : (
        <section className="panel empty-panel">
          <h2>Chưa có lá phiếu</h2>
          <p>Nhập ngày giờ sinh rồi bấm Dựng lá phiếu. Chưa có dữ liệu thì trang không dựng kết quả mẫu.</p>
        </section>
      )}
    </main>
  );
}
