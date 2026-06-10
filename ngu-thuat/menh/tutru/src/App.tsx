import { FormEvent, useMemo, useState } from "react";
import {
  archiveContentTypes,
  archiveItems,
  archiveLayers,
  archiveStatuses,
  archiveTopics,
  mockChartResult,
  pillarDisplays,
  type AnalysisTab,
  type ElementLayerKey,
  type PillarDisplay
} from "./chartMock";
import { elementDistribution, formRows, type FormRow, type PillarKey } from "./tuTruContent";
import { BRANCHES, STEMS } from "./engine/stemsBranches";
import { deriveFourPillars } from "./engine/deriveFourPillars";
import type { DeriveFourPillarsInput, DeriveFourPillarsOutput, Pillar as EnginePillar } from "./engine/types";
import { buildResultContentLayer, type ResultContentLayer } from "./engine/resultContentLayer";
import { explainChartResult, type ChartExplanationOutput } from "./engine/explainChartResult";
import { tuTruKnowledgeSeed } from "./data/tuTruKnowledgeSeed";

type CalendarType = "solar" | "lunar";
type GenderType = "male" | "female";

const primaryNavItems = [
  { id: "home", label: "Trang chủ", shortLabel: "Chủ", icon: "四" },
  { id: "input", label: "Nhập thông tin", shortLabel: "Nhập", icon: "門" },
  { id: "analysis", label: "Luận trụ", shortLabel: "Luận trụ", icon: "柱" },
  { id: "cycles", label: "Dòng vận", shortLabel: "Vận", icon: "運" },
  { id: "rules", label: "Tàng thư đối chiếu", shortLabel: "Quy tắc", icon: "典" }
];

const analysisTabs: { id: AnalysisTab; label: string }[] = [
  { id: "overview", label: "Tổng quan" },
  { id: "pillars", label: "Bốn trụ" },
  { id: "elements", label: "Ngũ hành" },
  { id: "ten-gods", label: "Thập thần" }
];

const elementLayerLabels: Record<ElementLayerKey, string> = {
  global: "Toàn cục",
  stem: "Thiên Can",
  branch: "Địa Chi",
  hidden: "Tàng Can"
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type RuntimeDetail = {
  title: string;
  stem: string;
  branch: string;
  hidden: string;
  relation: string;
  note: string;
};

type KnowledgeStatusSummary = {
  glossaryCount: number;
  rulesCount: number;
  topicCount: number;
  licenseBucketCount: number;
  statusCounts: Record<string, number>;
};

type FocusReference = {
  id: string;
  label: string;
  kind: "glossary" | "rule" | "topic" | "license";
  status: string;
};

const SOURCE_KIND_LABEL: Record<FocusReference["kind"], string> = {
  glossary: "Thuật ngữ",
  rule: "Quy tắc",
  topic: "Chủ đề",
  license: "Quyền dùng nguồn"
};

const SOURCE_STATUS_LABEL: Record<string, string> = {
  candidate: "Ứng viên / Chờ duyệt",
  needs_review: "Cần đối chiếu",
  restricted: "Hạn chế sử dụng",
  rejected: "Loại bỏ",
  approved: "Đã duyệt"
};

const SEED_BUCKET_LABEL: Record<string, string> = {
  glossary_seed: "Thuật ngữ",
  rules_candidate: "Quy tắc",
  topic_map: "Chủ đề",
  license_review: "Quyền dùng nguồn"
};

const SEED_TOPIC_LABEL: Record<string, string> = {
  "Lich phap": "Lịch pháp",
  "Can Chi": "Can Chi",
  "Tu Tru": "Tứ Trụ",
  "Tang can": "Tàng can",
  "Thap than": "Thập thần",
  "Ngu hanh": "Ngũ hành",
  "Vuong suy": "Vượng suy",
  "Dai van": "Đại vận",
  "Luu nien": "Lưu niên",
  "Hop xung hinh hai pha": "Hợp xung hình hại phá",
  "Dung than": "Dụng thần"
};

function getStemElement(stemHan: string) {
  return STEMS.find((item) => item.han === stemHan)?.element ?? "—";
}

function getBranchElement(branchHan: string) {
  return BRANCHES.find((item) => item.han === branchHan)?.element ?? "—";
}

function buildPillarDisplay(key: PillarKey, label: string, pillar: EnginePillar): PillarDisplay {
  return {
    key,
    label,
    stem: pillar.stem,
    stemHan: pillar.stemHan,
    branch: pillar.branch,
    branchHan: pillar.branchHan,
    stemElement: getStemElement(pillar.stemHan),
    branchElement: getBranchElement(pillar.branchHan),
    hiddenStem: "Chưa đủ dữ liệu để diễn giải sâu hơn.",
    tenGod: key === "day" ? "Nhật chủ" : "Mức đọc hiện tại: đối chiếu cơ bản."
  };
}

function buildPillarDisplays(result: DeriveFourPillarsOutput): PillarDisplay[] {
  return [
    buildPillarDisplay("year", "Năm", result.pillars.year),
    buildPillarDisplay("month", "Tháng", result.pillars.month),
    buildPillarDisplay("day", "Ngày", result.pillars.day),
    buildPillarDisplay("hour", "Giờ", result.pillars.hour)
  ];
}

function buildRuntimeDetailCopy(result: DeriveFourPillarsOutput): Record<PillarKey, RuntimeDetail> {
  const entries: [PillarKey, EnginePillar][] = [
    ["year", result.pillars.year],
    ["month", result.pillars.month],
    ["day", result.pillars.day],
    ["hour", result.pillars.hour]
  ];

  return Object.fromEntries(
    entries.map(([key, pillar]) => {
      const stemElement = getStemElement(pillar.stemHan);
      const branchElement = getBranchElement(pillar.branchHan);

      return [
        key,
        {
          title: pillar.pillar.toUpperCase(),
          stem: `Thiên Can ${pillar.stem} (${pillar.stemHan}), hành ${stemElement}.`,
          branch: `Địa Chi ${pillar.branch} (${pillar.branchHan}), hành ${branchElement}.`,
          hidden: "Chưa đủ dữ liệu để diễn giải sâu hơn.",
          relation: `Can ${stemElement}, Chi ${branchElement}.`,
          note: "Lớp này dùng quy tắc nền, chưa dùng làm kết luận tự động."
        }
      ];
    })
  ) as Record<PillarKey, RuntimeDetail>;
}

function buildResultId(input: DeriveFourPillarsInput) {
  return `ENG-${input.birthDate.replace(/-/g, "")}-${input.birthTime.replace(":", "")}`;
}

function normalizeTimezoneInput(rawTimezone: string) {
  if (!rawTimezone) return "Asia/Ho_Chi_Minh";

  const map: Record<string, string> = {
    "UTC+07:00 (Việt Nam)": "Asia/Ho_Chi_Minh",
    "UTC+07:00 (Viá»‡t Nam)": "Asia/Ho_Chi_Minh",
    "UTC+07:00 Việt Nam": "Asia/Ho_Chi_Minh",
    "UTC+07:00": "Asia/Ho_Chi_Minh",
    "UTC+08:00": "Asia/Shanghai",
    "UTC+09:00": "Asia/Tokyo"
  };

  return map[rawTimezone] ?? rawTimezone;
}

function normalizeSearchText(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function toSourceStatusLabel(status: string) {
  return SOURCE_STATUS_LABEL[status] ?? status;
}

function toSeedTopicLabel(topic: string) {
  return SEED_TOPIC_LABEL[topic] ?? topic;
}

function toFocusReferenceTitle(reference: FocusReference) {
  if (reference.kind === "rule") {
    const matchedRule = tuTruKnowledgeSeed.rulesCandidate.find((item) => item.id === reference.id);
    if (!matchedRule) {
      return "Quy tắc đối chiếu";
    }
    return `Quy tắc ${toSeedTopicLabel(matchedRule.topic)}`;
  }

  if (reference.kind === "topic") {
    return `Chủ đề ${toSeedTopicLabel(reference.label)}`;
  }

  if (reference.kind === "license") {
    const matchedBucket = tuTruKnowledgeSeed.licenseReviewBuckets.find((item) => item.id === reference.id);
    if (matchedBucket?.id === "lic_direct_use_after_review") return "Quyền dùng nguồn: dùng có điều kiện sau đối chiếu pháp lý";
    if (matchedBucket?.id === "lic_internal_reference_only") return "Quyền dùng nguồn: chỉ tham khảo nội bộ";
    if (matchedBucket?.id === "lic_short_quote_only") return "Quyền dùng nguồn: chỉ trích ngắn khi đủ điều kiện";
    if (matchedBucket?.id === "lic_needs_permission") return "Quyền dùng nguồn: cần xin phép hoặc duyệt pháp lý";
    if (matchedBucket?.id === "lic_rejected") return "Quyền dùng nguồn: loại bỏ";
    return "Quyền dùng nguồn";
  }

  return `Thuật ngữ ${reference.label}`;
}

function toArchiveMethodLabel(item: (typeof archiveItems)[number]) {
  if (item.topic === "Thuật ngữ") {
    return "Thuật ngữ";
  }
  return "Quy tắc nền";
}

function buildKnowledgeStatusSummary(): KnowledgeStatusSummary {
  const statusCounts = [
    ...tuTruKnowledgeSeed.glossaryTerms.map((item) => item.status),
    ...tuTruKnowledgeSeed.rulesCandidate.map((item) => item.status),
    ...tuTruKnowledgeSeed.topicMap.map((item) => item.status),
    ...tuTruKnowledgeSeed.licenseReviewBuckets.map((item) => item.status)
  ].reduce<Record<string, number>>((acc, status) => {
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    glossaryCount: tuTruKnowledgeSeed.glossaryTerms.length,
    rulesCount: tuTruKnowledgeSeed.rulesCandidate.length,
    topicCount: tuTruKnowledgeSeed.topicMap.length,
    licenseBucketCount: tuTruKnowledgeSeed.licenseReviewBuckets.length,
    statusCounts
  };
}

function buildFocusReferences(content: ResultContentLayer | null): FocusReference[] {
  if (!content) {
    return [];
  }

  const tokens = new Set<string>([
    "thien can",
    "dia chi",
    "tang can",
    "nhat chu",
    "ngu hanh",
    "thap than",
    "lich phap",
    "tiet khi",
    "lap xuan",
    "gio mui"
  ]);

  content.pillars.forEach((pillar) => {
    tokens.add(normalizeSearchText(pillar.stem));
    tokens.add(normalizeSearchText(pillar.branch));
    tokens.add(normalizeSearchText(pillar.pillar));
  });
  tokens.add(normalizeSearchText(content.dayMasterSummary.name));

  const pickMatch = (text: string) => {
    const normalized = normalizeSearchText(text);
    for (const token of tokens) {
      if (token && normalized.includes(token)) {
        return true;
      }
    }
    return false;
  };

  const glossaryRefs = tuTruKnowledgeSeed.glossaryTerms
    .filter((item) => pickMatch(`${item.termVi} ${item.shortDefinition}`))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      label: item.termVi,
      kind: "glossary" as const,
      status: item.status
    }));

  const ruleRefs = tuTruKnowledgeSeed.rulesCandidate
    .filter((item) => pickMatch(`${item.topic} ${item.ruleName} ${item.meaningShort}`))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      label: `${item.topic}: ${item.ruleName}`,
      kind: "rule" as const,
      status: item.status
    }));

  const topicRefs = tuTruKnowledgeSeed.topicMap
    .filter((item) => pickMatch(item.label))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      label: item.label,
      kind: "topic" as const,
      status: item.status
    }));

  return [...glossaryRefs, ...ruleRefs, ...topicRefs].slice(0, 12);
}

function applyEngineResultToMockSurface(result: DeriveFourPillarsOutput) {
  const nextDisplays = buildPillarDisplays(result);
  const nextDetails = buildRuntimeDetailCopy(result);
  const content = buildResultContentLayer(result);
  const cardByKey = Object.fromEntries(content.pillars.map((card) => [card.key, card]));

  nextDisplays.forEach((display) => {
    const card = cardByKey[display.key];
    if (!card) return;
    display.hiddenStem =
      card.hiddenStems.length > 0
        ? card.hiddenStems.map((item) => item.stem).join(" · ")
        : "Chưa đủ dữ liệu để diễn giải sâu hơn.";
    display.tenGod = card.tenGod;
  });

  (Object.keys(nextDetails) as PillarKey[]).forEach((key) => {
    const card = cardByKey[key];
    if (!card) return;
    nextDetails[key].hidden =
      card.hiddenStems.length > 0
        ? card.hiddenStems.map((item) => `${item.stem} (${item.element})`).join(", ")
        : "Chưa đủ dữ liệu để diễn giải sâu hơn.";
    nextDetails[key].note = card.note;
  });

  pillarDisplays.splice(0, pillarDisplays.length, ...nextDisplays);
  mockChartResult.resultId = buildResultId(result.input);
  mockChartResult.dayMaster = `${content.dayMasterSummary.name} (${content.dayMasterSummary.han})`;
  mockChartResult.detailCopy.year = nextDetails.year;
  mockChartResult.detailCopy.month = nextDetails.month;
  mockChartResult.detailCopy.day = nextDetails.day;
  mockChartResult.detailCopy.hour = nextDetails.hour;
}

function SectionHeader({
  index,
  title,
  eyebrow = ""
}: {
  index: string;
  title: string;
  eyebrow?: string;
}) {
  return (
    <header className="section-header">
      <span className="section-number">{index}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </header>
  );
}

function SealButton({
  label,
  href,
  extraClass = "",
  secondary = false,
  type = "button",
  onClick
}: {
  label: string;
  href?: string;
  extraClass?: string;
  secondary?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const className = ["seal-button", extraClass, secondary ? "secondary" : ""].filter(Boolean).join(" ");

  if (href && !onClick) {
    return (
      <a className={className} href={href}>
        <span className="seal-mark" aria-hidden="true">
          璽
        </span>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      <span className="seal-mark" aria-hidden="true">
        璽
      </span>
      <span>{label}</span>
    </button>
  );
}

function RichPillarCard({ pillar }: { pillar: PillarDisplay }) {
  return (
    <article className="pillar-card pillar-card-rich">
      <p className="pillar-card-label">{pillar.label}</p>
      <div className="pillar-card-hero">
        <div className="pillar-stem">
          <span>{pillar.stem}</span>
          <strong>{pillar.stemHan}</strong>
        </div>
        <div className="pillar-branch">
          <span>{pillar.branch}</span>
          <strong>{pillar.branchHan}</strong>
        </div>
      </div>
      <dl className="pillar-card-meta">
        <div>
          <dt>Ngũ hành Can</dt>
          <dd>{pillar.stemElement}</dd>
        </div>
        <div>
          <dt>Ngũ hành Chi</dt>
          <dd>{pillar.branchElement}</dd>
        </div>
        <div>
          <dt>Tàng can chính</dt>
          <dd>{pillar.hiddenStem}</dd>
        </div>
        <div>
          <dt>Thập thần (Nhật chủ)</dt>
          <dd>{pillar.tenGod}</dd>
        </div>
      </dl>
    </article>
  );
}

function ElementDiagram({ items }: { items: typeof elementDistribution }) {
  return (
    <div className="element-orbit" aria-label="Ngũ hành phân bố">
      {items.map((item, index) => (
        <div className={`element-node ${item.className}`} style={{ ["--node-index" as string]: index }} key={item.name}>
          <span>{item.name}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function TenGodHighlightsPanel({ dayMaster = mockChartResult.dayMaster }: { dayMaster?: string }) {
  return (
    <article className="analysis-panel highlight-panel">
      <h3>Thập thần nổi bật</h3>
      <p className="panel-note">So với {dayMaster} — chỉ ghi nhận vị trí, không phán mệnh.</p>
      <ul className="highlight-list">
        {mockChartResult.tenGodHighlights.map((item) => (
          <li key={item.name}>
            <span className="highlight-name">{item.name}</span>
            <span className="highlight-meta">
              {item.count} lần · {item.positions}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ResultContentSection({
  content,
  explanation
}: {
  content: ResultContentLayer;
  explanation: ChartExplanationOutput;
}) {
  const elementTone: Record<string, string> = {
    Kim: "metal",
    Mộc: "wood",
    Thủy: "water",
    Hỏa: "fire",
    Thổ: "earth"
  };

  const pillarGuide: Record<"year" | "month" | "day" | "hour", string> = {
    year: explanation.pillarExplanations.year[0]?.body ?? content.pillars[0]?.note ?? "",
    month: explanation.pillarExplanations.month[0]?.body ?? content.pillars[1]?.note ?? "",
    day: explanation.pillarExplanations.day[0]?.body ?? content.pillars[2]?.note ?? "",
    hour: explanation.pillarExplanations.hour[0]?.body ?? content.pillars[3]?.note ?? ""
  };

  const tenGodExplainByTitle = Object.fromEntries(explanation.tenGodExplanation.map((item) => [item.title, item.body]));

  return (
    <div className="result-content-stack">
      {/* 1. BẢN ĐỘ TỨ TRỤ CỦA BẠN */}
      <article className="analysis-panel personal-map-panel">
        <h3>Bản đồ Tứ Trụ của bạn</h3>
        <p className="panel-note result-pillar-line">
          Năm {content.pillars.find((item) => item.key === "year")?.pillar} · Tháng {content.pillars.find((item) => item.key === "month")?.pillar} · Ngày {content.pillars.find((item) => item.key === "day")?.pillar} · Giờ {content.pillars.find((item) => item.key === "hour")?.pillar}
        </p>
        <p className="panel-note result-day-master">
          Nhật chủ: {content.dayMasterSummary.name} {content.dayMasterSummary.element}
        </p>
        <p className="panel-description">
          Bốn trụ trên được dựng từ ngày, giờ sinh bạn đã nhập. Nhật chủ là trục chính để đọc Ngũ hành, Thập thần và các quan hệ sinh khắc trong bản đồ này.
        </p>
      </article>

      {/* 2. NHẬN XÉT CẤU TRÚC BAN ĐẦU */}
      <article className="analysis-panel">
        <h3>Nhận xét cấu trúc ban đầu</h3>
        <div className="result-text-blocks">
          {explanation.initialStructure.map((block) => (
            <div className="result-text-block" key={block.title}>
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      </article>

      {/* 3. NGŨ HÀNH TRONG BẢN NÀY */}
      <article className="analysis-panel">
        <h3>Ngũ hành trong bản này</h3>
        <div className="result-element-cards">
          {explanation.elementProfile.map((item) => (
            <article className={`result-element-card ${elementTone[item.element] ?? "earth"}`} key={item.element}>
              <p>{item.element}</p>
              <strong>{item.count}</strong>
              <small>{item.prominence}</small>
            </article>
          ))}
        </div>
        <div className="result-text-blocks">
          {explanation.elementExplanation.map((block) => (
            <div className="result-text-block" key={block.title}>
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      </article>

      {/* 4. TÀNG CAN CẦN CHÚ Ý */}
      <article className="analysis-panel">
        <h3>Tàng can cần chú ý</h3>
        <div className="result-text-blocks">
          {explanation.hiddenStemExplanation.map((block) => (
            <div className="result-text-block" key={block.title}>
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      </article>

      {/* 5. THẬP THẦN ĐÁNG CHÚ Ý */}
      <article className="analysis-panel">
        <h3>Thập thần đáng chú ý</h3>
        <p className="panel-description">
          Thập thần là cách gọi quan hệ giữa các Thiên Can với Nhật chủ. Ở bản đọc cơ bản, phần này giúp nhận diện lớp quan hệ trong lá số, chưa dùng riêng để kết luận tính cách hay vận trình.
        </p>
        <div className="result-ten-god-list">
          {content.tenGodOverview.filter(item => item.count > 0).map((item) => (
            <div className="result-ten-god-row" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.count} lần · {item.positions}</span>
              <small>{tenGodExplainByTitle[item.name] ?? item.note}</small>
            </div>
          ))}
        </div>
      </article>

      {/* 6. BẠN NÊN XEM TIẾP */}
      <article className="analysis-panel">
        <h3>Bạn nên xem tiếp</h3>
        <div className="result-text-blocks">
          {explanation.finalReading.map((block) => (
            <div className="result-text-block" key={block.title}>
              <p>{block.body}</p>
            </div>
          ))}
        </div>
      </article>

      {/* 7. TÀNG THƯ ĐỐI CHIẾU - đưa xuống cuối */}
      <article className="analysis-panel archive-panel">
        <h3>Tàng thư đối chiếu</h3>
        <p className="panel-description">Xem quy tắc và thuật ngữ phía sau bản đọc.</p>
        {explanation.relatedKnowledgeCards.length === 0 ? (
          <p className="panel-note">Chưa có thẻ kiến thức liên quan.</p>
        ) : (
          <div className="result-text-blocks archive-blocks">
            {explanation.relatedKnowledgeCards.map((card) => (
              <div className="result-text-block archive-card" key={card.id}>
                <h4>{card.title}</h4>
                <p>{card.body}</p>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* 8. LƯU Ý QUAN TRỌNG - cảnh báo đặt cuối */}
      <article className="analysis-panel result-guardrail">
        <h3>Lưu ý quan trọng</h3>
        <p>{explanation.guardrails[0]?.body ?? content.guardrail}</p>
      </article>

      {/* 9. DẢI KỸ THUẬT - rất nhỏ ở cuối */}
      <footer className="result-tech-footer">
        <small>Máy tính {content.verification.engineVersion} · Quy tắc {content.verification.ruleSetVersion} · Bản đọc cấu trúc cơ bản</small>
      </footer>
    </div>
  );
}

function OverviewBlocks({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <p className="result-id-line">Mã kết quả #{mockChartResult.resultId}</p>
      <div className={`pillar-grid ${compact ? "pillar-grid-compact" : ""}`}>
        {pillarDisplays.map((pillar) => (
          <RichPillarCard pillar={pillar} key={pillar.key} />
        ))}
      </div>
      <div className="analysis-grid">
        <article className="analysis-panel element-panel">
          <h3>Ngũ hành phân bố</h3>
          <ElementDiagram items={mockChartResult.elementBalance} />
        </article>
        <TenGodHighlightsPanel />
      </div>
    </>
  );
}

function InputControl({
  row,
  calendarType,
  gender,
  onCalendarChange,
  onGenderChange
}: {
  row: FormRow;
  calendarType: CalendarType;
  gender: GenderType;
  onCalendarChange: (value: CalendarType) => void;
  onGenderChange: (value: GenderType) => void;
}) {
  if (row.control === "date") {
    return <input aria-label={row.label} name="birthDate" type="date" defaultValue="1990-10-12" />;
  }

  if (row.control === "time") {
    return (
      <div className="split-control">
        <select aria-label="Giờ" name="birthHour" defaultValue="14">
          {Array.from({ length: 24 }, (_, hour) => {
            const value = String(hour).padStart(2, "0");
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        <select aria-label="Phút" name="birthMinute" defaultValue="30">
          {["00", "15", "30", "45"].map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (row.control === "calendar") {
    return (
      <div className="choice-group" role="group" aria-label="Loại lịch">
        <button className={`choice ${calendarType === "solar" ? "active" : ""}`} onClick={() => onCalendarChange("solar")} type="button">
          Dương lịch
        </button>
        <button className={`choice ${calendarType === "lunar" ? "active" : ""}`} onClick={() => onCalendarChange("lunar")} type="button">
          Âm lịch
        </button>
      </div>
    );
  }

  if (row.control === "gender") {
    return (
      <div className="gender-control-wrap">
        <div className="choice-group" role="group" aria-label="Giới tính">
          <button className={`choice ${gender === "male" ? "active" : ""}`} onClick={() => onGenderChange("male")} type="button">
            Nam
          </button>
          <button className={`choice ${gender === "female" ? "active" : ""}`} onClick={() => onGenderChange("female")} type="button">
            Nữ
          </button>
        </div>
        <p className="inline-note">Dùng cho một số quy tắc an vận truyền thống. Bốn trụ gốc không đổi theo giới tính.</p>
      </div>
    );
  }

  if (row.control === "timezone") {
    return (
      <select aria-label={row.label} name="timezone" defaultValue="Asia/Ho_Chi_Minh">
        <option value="Asia/Ho_Chi_Minh">UTC+07:00 Việt Nam</option>
        <option value="Asia/Shanghai">UTC+08:00</option>
        <option value="Asia/Tokyo">UTC+09:00</option>
      </select>
    );
  }

  return <input aria-label={row.label} name="birthPlace" type="text" defaultValue="Tiền Giang, Việt Nam" placeholder="Tùy chọn" />;
}
function labelForDetail(key: "stem" | "branch" | "hidden" | "relation" | "note") {
  return {
    stem: "Thiên Can",
    branch: "Địa Chi",
    hidden: "Tàng Can",
    relation: "Ngũ hành",
    note: "Ghi chú đọc"
  }[key];
}

export default function App() {
  const [calendarType, setCalendarType] = useState<CalendarType>("solar");
  const [gender, setGender] = useState<GenderType>("male");
  const [hasChart, setHasChart] = useState(false);
  const [chartResult, setChartResult] = useState<DeriveFourPillarsOutput | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>("overview");
  const [activePillar, setActivePillar] = useState<PillarKey>("year");
  const [elementLayer, setElementLayer] = useState<ElementLayerKey>("global");

  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveTopic, setArchiveTopic] = useState("Tất cả");
  const [archiveLayer, setArchiveLayer] = useState("Tất cả");
  const [archiveStatus, setArchiveStatus] = useState("Tất cả");
  const [archiveContentType, setArchiveContentType] = useState("Tất cả");

  const activePillarData = pillarDisplays.find((pillar) => pillar.key === activePillar)!;
  const activeDetail = mockChartResult.detailCopy[activePillar];
  const layerElements = mockChartResult.elementByLayer[elementLayer];

  const filteredArchive = useMemo(() => {
    const q = archiveSearch.trim().toLowerCase();
    return archiveItems.filter((item) => {
      if (archiveTopic !== "Tất cả" && item.topic !== archiveTopic) return false;
      if (archiveLayer !== "Tất cả" && item.layer !== archiveLayer) return false;
      if (archiveStatus !== "Tất cả" && item.status !== archiveStatus) return false;
      if (archiveContentType !== "Tất cả" && item.contentType !== archiveContentType) return false;
      if (!q) return true;
      return [item.title, item.description, item.sources, item.topic, item.layer].join(" ").toLowerCase().includes(q);
    });
  }, [archiveSearch, archiveTopic, archiveLayer, archiveStatus, archiveContentType]);

  const resultContent = useMemo(() => {
    if (!chartResult) return null;
    try {
      return buildResultContentLayer(chartResult);
    } catch (error) {
      console.error("result content error", error);
      return null;
    }
  }, [chartResult]);

  const chartExplanation = useMemo(() => {
    if (!resultContent) return null;
    try {
      return explainChartResult(resultContent, tuTruKnowledgeSeed);
    } catch (error) {
      console.error("explanation error", error);
      return null;
    }
  }, [resultContent]);

  const knowledgeSummary = useMemo(() => buildKnowledgeStatusSummary(), []);
  const focusReferences = useMemo(() => {
    if (chartExplanation) {
      return chartExplanation.sourceRefs.map((item): FocusReference => ({
        id: item.id,
        label: item.title,
        kind:
          item.category === "glossary_seed"
            ? "glossary"
            : item.category === "rules_candidate"
              ? "rule"
              : item.category === "topic_map"
                ? "topic"
                : "license",
        status: item.status
      }));
    }
    return buildFocusReferences(resultContent);
  }, [chartExplanation, resultContent]);

  const handleBuildChart = (event: FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const birthDate = (form.querySelector('input[name="birthDate"]') as HTMLInputElement | null)?.value ?? "";
    const birthHour = (form.querySelector('select[name="birthHour"]') as HTMLSelectElement | null)?.value ?? "";
    const birthMinute = (form.querySelector('select[name="birthMinute"]') as HTMLSelectElement | null)?.value ?? "00";
    const rawTimezone = (form.querySelector('select[name="timezone"]') as HTMLSelectElement | null)?.value ?? "Asia/Ho_Chi_Minh";
    const birthPlace = (form.querySelector('input[name="birthPlace"]') as HTMLInputElement | null)?.value ?? "";

    const input: DeriveFourPillarsInput = {
      birthDate,
      birthTime: `${birthHour}:${birthMinute}`,
      calendarType,
      timezone: normalizeTimezoneInput(rawTimezone),
      gender,
      birthPlace
    };

    console.log("derive input", input);

    try {
      const nextChartResult = deriveFourPillars(input);
      console.log("derive result", nextChartResult);
      applyEngineResultToMockSurface(nextChartResult);
      setChartResult(nextChartResult);
      setEngineError(null);
      setHasChart(true);
      setActivePillar("year");
      setAnalysisTab("overview");
      window.setTimeout(() => scrollToSection("overview"), 50);
    } catch (error) {
      console.error("derive error", error);
      const message = error instanceof Error ? error.message : "Không thể dựng bốn trụ với dữ liệu hiện tại.";
      setChartResult(null);
      setEngineError(`Không dựng được bốn trụ: ${message}`);
      setHasChart(false);
    }
  };

  const openAnalysis = (tab: AnalysisTab) => {
    setAnalysisTab(tab);
    window.setTimeout(() => scrollToSection("analysis"), 50);
  };

  return (
    <>
      <aside className="side-nav" aria-label="Điều hướng khu vực">
        <nav>
          {primaryNavItems.map((item) => (
            <a href={`#${item.id}`} aria-label={item.label} key={item.id}>
              <span className="nav-han">{item.icon}</span>
              <span className="nav-short-label">{item.shortLabel}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main>
        <section className="screen hero-screen" id="home">
          <div className="hero-content">
            <SectionHeader index="1" title="Trang chủ" eyebrow="四 → Chủ" />
            <div className="hero-moon-area">
              <div className="hero-title-wrap">
                <h1>Tứ Trụ</h1>
                <p className="kicker">Lập trụ · Hiểu mệnh · Thuận thiên</p>
              </div>
            </div>
            <div className="hero-intro">
              <ul className="hero-points">
                <li>Dựng bốn trụ từ ngày giờ sinh.</li>
                <li>Đối chiếu Can Chi, Ngũ hành và Thập thần.</li>
                <li>Theo dõi Đại vận, Lưu niên như chu kỳ tham khảo.</li>
                <li>Giữ dẫn nguồn để học và tự quan sát.</li>
              </ul>
            </div>
            <div className="hero-cta-wrap">
              <SealButton label="Lập trụ" href="#input" extraClass="hero-cta" />
              <SealButton label="Xem cách đọc" href="#onboarding" secondary />
            </div>
          </div>
        </section>

        <section className="screen onboarding-screen" id="onboarding">
          <div className="screen-inner onboarding-inner">
            <SectionHeader index="·" title="Bắt đầu từ đâu?" eyebrow="Hướng dẫn đọc" />
            <div className="guide-steps">
              <article className="onboarding-step">
                <span className="step-number">1</span>
                <h3>Nhập ngày giờ sinh</h3>
                <p>Chọn lịch âm hoặc dương, điền đầy đủ thông tin theo giấy khai sinh.</p>
              </article>
              <article className="onboarding-step">
                <span className="step-number">2</span>
                <h3>Dựng bốn trụ</h3>
                <p>Hệ thống tính Can Chi cho năm, tháng, ngày, giờ theo lịch pháp.</p>
              </article>
              <article className="onboarding-step">
                <span className="step-number">3</span>
                <h3>Xem từng lớp thông tin</h3>
                <p>Đối chiếu Can Chi, Ngũ hành, Thập thần và dòng vận theo từng tab.</p>
              </article>
              <article className="onboarding-step">
                <span className="step-number">4</span>
                <h3>Đối chiếu nguồn</h3>
                <p>Tra Tàng thư quy tắc, ghi rõ trạng thái kiểm duyệt và nguồn ứng viên.</p>
              </article>
            </div>
            <div className="onboarding-actions">
              <SealButton label="Đi tới nhập liệu" href="#input" />
            </div>
          </div>
        </section>

        <section className="screen input-screen" id="input">
          <div className="screen-inner input-layout">
            <div>
              <SectionHeader index="2" title="Nhập thông tin" eyebrow="門 → Nhập" />
              <form className="ancient-form" onSubmit={handleBuildChart}>
                {formRows.map((row) => (
                  <label className="input-row" key={row.label}>
                    <span className="row-icon">{row.icon}</span>
                    <span className="row-copy">
                      <strong>{row.label}</strong>
                      <small>{row.note}</small>
                    </span>
                    <span className="row-control">
                      <InputControl
                        row={row}
                        calendarType={calendarType}
                        gender={gender}
                        onCalendarChange={setCalendarType}
                        onGenderChange={setGender}
                      />
                    </span>
                  </label>
                ))}
                <div className="form-actions">
                  <SealButton label="Dựng bốn trụ" type="submit" extraClass="hero-cta" />
                </div>
                {engineError ? <p className="source-footnote">{engineError}</p> : null}
              </form>
            </div>
            <aside className="step-rail" aria-label="Tiến trình">
              <div className="step active">
                <span>1</span>
                <p>Nhập thông tin</p>
              </div>
              <div className="rail-line" />
              <div className={`step ${hasChart ? "active" : ""}`}>
                <span>2</span>
                <p>Dựng & xem kết quả</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="screen overview-screen" id="overview">
          <div className="screen-inner">
            <SectionHeader index="3" title="Kết quả tổng quan" eyebrow="柱 → Sau khi dựng trụ" />
            {!hasChart ? (
              <article className="empty-state">
                <p>Chưa có bốn trụ. Vui lòng nhập ngày giờ sinh và bấm <strong>Dựng bốn trụ</strong>.</p>
                <SealButton label="Đi tới nhập liệu" href="#input" secondary />
              </article>
            ) : (
              <>
                {resultContent && chartExplanation ? (
                  <ResultContentSection content={resultContent} explanation={chartExplanation} />
                ) : (
                  <OverviewBlocks />
                )}
                <div className="overview-actions">
                  <SealButton label="Xem từng trụ" onClick={() => openAnalysis("pillars")} />
                  <SealButton label="Xem dòng vận" onClick={() => scrollToSection("cycles")} secondary />
                  <SealButton label="Đối chiếu nguồn" onClick={() => scrollToSection("rules")} secondary />
                </div>
                {!chartResult ? <p className="source-footnote">
                  Mức đọc hiện tại: đối chiếu cơ bản. Lớp này dùng quy tắc nền, cần đọc cùng toàn cục và nguồn trong mục Quy tắc.
                </p> : null}
              </>
            )}
          </div>
        </section>

        <section className="screen analysis-screen" id="analysis">
          <div className="screen-inner">
            <SectionHeader index="4" title="Luận trụ" eyebrow="柱 → Từng lớp thông tin" />
            {!hasChart ? (
              <article className="empty-state">
                <p>Dựng bốn trụ trước khi mở Luận trụ.</p>
                <SealButton label="Nhập & dựng trụ" href="#input" secondary />
              </article>
            ) : (
              <>
                <div className="analysis-tabs" role="tablist" aria-label="Luận trụ">
                  {analysisTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={analysisTab === tab.id}
                      className={analysisTab === tab.id ? "active" : ""}
                      onClick={() => setAnalysisTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {analysisTab === "overview" && (
                  <div className="analysis-tab-panel" role="tabpanel">
                    <OverviewBlocks compact />
                    <p className="source-footnote">Tab tổng quan — cùng dữ liệu với màn sau khi dựng trụ, không có đoạn luận dài.</p>
                  </div>
                )}

                {analysisTab === "pillars" && (
                  <div className="analysis-tab-panel detail-layout" role="tabpanel">
                    <nav className="pillar-tabs" aria-label="Chọn trụ">
                      {pillarDisplays.map((pillar) => (
                        <button
                          className={pillar.key === activePillar ? "active" : ""}
                          key={pillar.key}
                          onClick={() => setActivePillar(pillar.key)}
                          type="button"
                        >
                          {pillar.label}
                        </button>
                      ))}
                    </nav>
                    <article className="selected-pillar" aria-live="polite">
                      <p>{activePillarData.stem}</p>
                      <strong>{activePillarData.stemHan}</strong>
                      <span>{activePillarData.branch}</span>
                      <b>{activePillarData.branchHan}</b>
                      <small>
                        {activePillarData.stemElement} · {activePillarData.branchElement}
                      </small>
                    </article>
                    <article className="detail-copy structured-detail">
                      <h3>{activeDetail.title}</h3>
                      <section>
                        <h4>{labelForDetail("stem")}</h4>
                        <p>{activeDetail.stem}</p>
                      </section>
                      <section>
                        <h4>{labelForDetail("branch")}</h4>
                        <p>{activeDetail.branch}</p>
                      </section>
                      <section>
                        <h4>{labelForDetail("hidden")}</h4>
                        <p>{activeDetail.hidden}</p>
                        <p className="detail-extra">Tàng can chính: {activePillarData.hiddenStem}</p>
                      </section>
                      <section>
                        <h4>{labelForDetail("relation")}</h4>
                        <p>
                          Can {activePillarData.stemElement}, Chi {activePillarData.branchElement}. {activeDetail.relation}
                        </p>
                      </section>
                      <section>
                        <h4>{labelForDetail("note")}</h4>
                        <p>{activeDetail.note}</p>
                      </section>
                    </article>
                  </div>
                )}

                {analysisTab === "elements" && (
                  <div className="analysis-tab-panel" role="tabpanel">
                    <div className="filter-chip-row" role="group" aria-label="Lọc lớp ngũ hành">
                      {(Object.keys(elementLayerLabels) as ElementLayerKey[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          className={elementLayer === key ? "active" : ""}
                          onClick={() => setElementLayer(key)}
                        >
                          {elementLayerLabels[key]}
                        </button>
                      ))}
                    </div>
                    <p className="panel-note">Phân bố theo lớp {elementLayerLabels[elementLayer]} — quan sát cân bằng khí, không kết luận tốt/xấu tuyệt đối.</p>
                    <article className="analysis-panel element-panel element-panel-wide">
                      <ElementDiagram items={layerElements} />
                    </article>
                    <ul className="element-legend">
                      {layerElements.map((item) => (
                        <li key={item.name}>
                          <span className={`legend-dot ${item.className}`} />
                          {item.name}: <strong>{item.value}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisTab === "ten-gods" && (
                  <div className="analysis-tab-panel" role="tabpanel">
                    <p className="panel-note">Thập thần so với {mockChartResult.dayMaster}. Mỗi card ghi vị trí và ghi chú đối chiếu.</p>
                    <div className="ten-god-card-grid">
                      {mockChartResult.tenGodCards.map((card) => (
                        <article className="ten-god-card" key={card.key}>
                          <header>
                            <h4>{card.name}</h4>
                            <span className="ten-god-count">{card.count}</span>
                          </header>
                          <p className="ten-god-pos">{card.positions}</p>
                          <p>{card.summary}</p>
                          <p className="ten-god-note">{card.note}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="screen cycles-screen" id="cycles">
          <div className="screen-inner">
            <SectionHeader index="5" title="Dòng vận" eyebrow="運 → Đại vận & Lưu niên" />
            {!hasChart ? (
              <article className="empty-state">
                <p>Dựng bốn trụ để xem chu kỳ tham khảo.</p>
              </article>
            ) : (
              <>
                <div className="cycle-block">
                  <h3>
                    Đại vận <span>({gender === "male" ? "Nam" : "Nữ"} — dữ liệu minh họa)</span>
                  </h3>
                  <div className="luck-timeline" aria-label="Đại vận">
                    {mockChartResult.daiVan.map((cycle, index) => (
                      <article className={`cycle-card ${index === 3 ? "active" : ""}`} key={`${cycle.age}-${cycle.stem}`}>
                        <small>{cycle.age}</small>
                        <span>{cycle.years}</span>
                        <strong>{cycle.stem}</strong>
                        <b>{cycle.branch}</b>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="cycle-block">
                  <h3>Lưu niên</h3>
                  <div className="year-grid" aria-label="Lưu niên">
                    {mockChartResult.luuNien.map((year, index) => (
                      <article className={`year-card ${index === 2 ? "active" : ""}`} key={year.year}>
                        <span>{year.year}</span>
                        <strong>{year.stem}</strong>
                        <b>{year.branch}</b>
                      </article>
                    ))}
                  </div>
                </div>
                <p className="source-footnote">
                  Dòng vận hiện là dữ liệu minh họa. Phiên bản sau sẽ tính thuận/nghịch vận theo giới tính và quy tắc lịch pháp.
                </p>
                <p className="safety-note">
                  Đại vận và lưu niên chỉ là chu kỳ tham khảo để đối chiếu cổ học, không phải kết luận chắc chắn về đời người.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="screen rules-screen" id="rules">
          <div className="screen-inner">
            <SectionHeader index="6" title="Tàng thư đối chiếu" eyebrow="典 → Quy tắc & nguồn" />
            <article className="analysis-panel rules-source-panel">
              <h3>Trạng thái nguồn đối chiếu</h3>
              <p className="panel-note">
                Dữ liệu đang đọc từ <code>src/data/tuTruKnowledgeSeed.ts</code>. Bản đối chiếu nguồn đang ở mức thư mục tham khảo. Các mục ứng viên/cần đối chiếu chưa dùng làm kết luận tự động.
              </p>
              <div className="result-chip-row">
                <span className="result-chip">{SEED_BUCKET_LABEL.glossary_seed}: {knowledgeSummary.glossaryCount}</span>
                <span className="result-chip">{SEED_BUCKET_LABEL.rules_candidate}: {knowledgeSummary.rulesCount}</span>
                <span className="result-chip">{SEED_BUCKET_LABEL.topic_map}: {knowledgeSummary.topicCount}</span>
                <span className="result-chip">{SEED_BUCKET_LABEL.license_review}: {knowledgeSummary.licenseBucketCount}</span>
              </div>
              <div className="result-chip-row">
                {Object.entries(knowledgeSummary.statusCounts).map(([status, count]) => (
                  <span className="result-chip" key={status}>
                    {toSourceStatusLabel(status)}: {count}
                  </span>
                ))}
              </div>
              {focusReferences.length > 0 ? (
                <>
                  <p className="source-footnote">Ưu tiên mục liên quan chart hiện tại:</p>
                  <div className="focus-reference-list">
                    {focusReferences.map((item) => (
                      <span className="focus-reference-chip" key={item.id}>
                        {toFocusReferenceTitle(item)} · {SOURCE_KIND_LABEL[item.kind]} · {toSourceStatusLabel(item.status)} · Không dùng làm kết luận tự động
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </article>
            <div className="archive-filters">
              <label className="filter-field filter-search">
                <span>Tìm kiếm</span>
                <input
                  type="search"
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  placeholder="Tên, mô tả, nguồn..."
                />
              </label>
              <label className="filter-field">
                <span>Chủ đề</span>
                <select value={archiveTopic} onChange={(e) => setArchiveTopic(e.target.value)}>
                  {archiveTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Tầng dữ liệu</span>
                <select value={archiveLayer} onChange={(e) => setArchiveLayer(e.target.value)}>
                  {archiveLayers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Trạng thái</span>
                <select value={archiveStatus} onChange={(e) => setArchiveStatus(e.target.value)}>
                  {archiveStatuses.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Loại nội dung</span>
                <select value={archiveContentType} onChange={(e) => setArchiveContentType(e.target.value)}>
                  {archiveContentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="archive-count">{filteredArchive.length} mục phù hợp</p>
            <div className="archive-list">
              {filteredArchive.map((item) => (
                <article className="archive-card" key={item.id}>
                  <header className="archive-card-head">
                    <h3>{item.title}</h3>
                    <div className="archive-tags">
                      <span>{item.topic}</span>
                      <span>{item.layer}</span>
                      <span>{item.contentType}</span>
                      <span className={`status-${item.status === "Đã duyệt" ? "ok" : "pending"}`}>{item.status}</span>
                    </div>
                  </header>
                  <p>{item.description}</p>
                  <p className="archive-read-labels">
                    Nhãn đọc: {toArchiveMethodLabel(item)} · {item.layer} · {item.status === "Đã duyệt" ? "Quy tắc nền" : "Cần đối chiếu"} · Không dùng làm kết luận tự động
                  </p>
                  <p className="archive-sources">
                    <strong>Nguồn liên quan:</strong> {item.sources}
                  </p>
                  <p className="archive-usage">{item.usageNote}</p>
                </article>
              ))}
            </div>
            <footer className="version-seal" aria-label="Phiên bản dữ liệu">
              Máy tính v{chartResult?.meta.engineVersion ?? "0.1.0"} · Quy tắc {chartResult?.meta.ruleSetVersion ?? "core-v0.1"} · Dữ liệu sách mức ứng viên · Mã kết quả #{mockChartResult.resultId}
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
