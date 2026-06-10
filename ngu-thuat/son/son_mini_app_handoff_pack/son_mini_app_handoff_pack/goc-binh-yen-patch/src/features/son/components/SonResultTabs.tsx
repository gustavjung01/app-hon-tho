import { sonSourceRows, sonGlossary, sonRuleSamples, sonTabs } from "../data/sonContent";
import type { SonComputedSummary, SonModuleId, SonViewId } from "../types";
import { SonChip } from "./SonActionButton";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SonTabNav({ activeView, setActiveView }: { activeView: SonViewId; setActiveView: (id: SonViewId) => void }) {
  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto pb-2">
      {sonTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveView(tab.id as SonViewId)}
          className={cx(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
            activeView === tab.id
              ? "border-[#f0cf80] bg-[#f0cf80]/18 text-[#ffe7ad]"
              : "border-[#d7b987]/25 bg-black/10 text-[#cdbb91] hover:border-[#d7b987]/55"
          )}
        >
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}

export function SonOverviewPanel({ moduleId, summary }: { moduleId: SonModuleId; summary: SonComputedSummary }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <article className="rounded-[1.5rem] border border-[#d7b987]/25 bg-black/16 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[#b9c3a6]">{moduleId === "bat-trach" ? "Bát trạch" : "Phi tinh"}</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#f8e6c4]">{summary.title}</h2>
        <p className="mt-3 text-base leading-8 text-[#d2c19a]">{summary.headline}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <SonChip active>{summary.confidence}</SonChip>
          <SonChip>không phán tuyệt đối</SonChip>
          <SonChip>cần nguồn kiểm duyệt</SonChip>
        </div>
      </article>

      <article className="rounded-[1.5rem] border border-[#d7b987]/25 bg-[#f5ead5]/8 p-5">
        <p className="text-sm font-semibold text-[#f1d9a6]">Dữ liệu đang dùng</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {summary.facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className="rounded-xl border border-[#d7b987]/20 bg-black/14 px-3 py-2 text-sm text-[#ead6aa]">
              <span className="block text-xs uppercase tracking-[0.16em] text-[#cdbb91]">{fact.label}</span>
              <span className="mt-1 block font-semibold">{fact.value}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export function SonAnalysisPanel({ summary }: { summary: SonComputedSummary }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <h2 className="text-2xl font-semibold text-[#f8e6c4]">Phân tích</h2>
        <p className="mt-3 leading-7 text-[#d2c19a]">
          Phần này giải nghĩa vì sao app đưa ra gợi ý. Khi chưa có rule thật, mọi dòng đều được đóng nhãn preview để tránh hiểu lầm.
        </p>
      </div>
      <div className="grid gap-3">
        {summary.notices.map((line, index) => (
          <div key={line} className="flex gap-3 rounded-2xl border border-[#d7b987]/22 bg-black/14 p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#d6ad68]/18 text-sm font-semibold text-[#f0cf80]">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-[#ead6aa]">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SonSuggestionsPanel({ summary }: { summary: SonComputedSummary }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#f8e6c4]">Gợi ý điều chỉnh nhẹ</h2>
      <p className="mt-2 text-sm leading-7 text-[#d2c19a]">
        Ưu tiên việc có thể làm ngay: dọn sạch, tăng sáng, thông thoáng, giảm nhiễu, giữ yên khu cần tĩnh.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {summary.primarySuggestions.map((item) => (
          <div key={item} className="rounded-[1.25rem] border border-[#d7b987]/25 bg-[#263a31]/36 p-4">
            <p className="text-sm leading-7 text-[#ead6aa]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SonSourcesPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
      <div>
        <h2 className="text-2xl font-semibold text-[#f8e6c4]">Quy tắc & nguồn</h2>
        <p className="mt-3 leading-7 text-[#d2c19a]">
          Đây là tủ nguồn của app Sơn. Bản ZIP chỉ để sẵn chỗ, chưa thay thế nghiên cứu chuyên sâu và kiểm duyệt license.
        </p>
        <div className="mt-4 rounded-2xl border border-[#f0cf80]/25 bg-[#f0cf80]/10 p-4 text-xs leading-6 text-[#f4dfb7]">
          Cấm copy nguyên văn sách còn bản quyền. Nguồn chưa rõ quyền phải đánh dấu needs_review.
        </div>
      </div>

      <div className="grid gap-4">
        <section className="rounded-[1.25rem] border border-[#d7b987]/25 bg-black/14 p-4">
          <h3 className="font-semibold text-[#f1d9a6]">Thuật ngữ</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {sonGlossary.map((item) => (
              <div key={item.term} className="rounded-xl border border-[#d7b987]/18 bg-[#f5ead5]/8 p-3">
                <p className="font-semibold text-[#f8e6c4]">{item.term}</p>
                <p className="mt-1 text-xs leading-5 text-[#d2c19a]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[#d7b987]/25 bg-black/14 p-4">
          <h3 className="font-semibold text-[#f1d9a6]">Rule object mẫu</h3>
          <div className="mt-3 grid gap-2">
            {sonRuleSamples.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-[#d7b987]/18 bg-[#f5ead5]/8 p-3 text-xs leading-5 text-[#d2c19a]">
                <p className="font-semibold text-[#f8e6c4]">{rule.id}</p>
                <p>{rule.explanationPlain}</p>
                <p className="mt-1 text-[#f0cf80]">severity: {rule.severity} · confidence: {rule.confidence}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[#d7b987]/25 bg-black/14 p-4">
          <h3 className="font-semibold text-[#f1d9a6]">Bảng nguồn placeholder</h3>
          <div className="mt-3 grid gap-2">
            {sonSourceRows.map((row) => (
              <div key={row.name} className="rounded-xl border border-[#d7b987]/18 bg-[#f5ead5]/8 p-3 text-xs leading-5 text-[#d2c19a]">
                <p className="font-semibold text-[#f8e6c4]">{row.name}</p>
                <p>{row.type} · {row.license} · {row.use}</p>
                <p className="text-[#f0cf80]">{row.risk}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
