import type { ResultContentLayer } from "./resultContentLayer";
import { matchKnowledgeForChart, type KnowledgeMatch } from "./matchKnowledgeForChart";

type ElementName = string;

export interface ExplanationBlock {
  title: string;
  body: string;
  level: "basic" | "reference" | "needs_review";
  tags: string[];
  sourceIds?: string[];
}

export interface SourceRef {
  id: string;
  title: string;
  category: "glossary_seed" | "rules_candidate" | "topic_map" | "license_review";
  status: string;
}

export interface ElementProfileItem {
  element: ElementName;
  count: number;
  prominence: "nổi bật" | "trung bình" | "ít xuất hiện";
  relation: string;
  note: string;
}

export interface ChartExplanationOutput {
  overview: ExplanationBlock[];
  initialStructure: ExplanationBlock[];
  pillarExplanations: {
    year: ExplanationBlock[];
    month: ExplanationBlock[];
    day: ExplanationBlock[];
    hour: ExplanationBlock[];
  };
  elementExplanation: ExplanationBlock[];
  elementProfile: ElementProfileItem[];
  tenGodExplanation: ExplanationBlock[];
  hiddenStemExplanation: ExplanationBlock[];
  finalReading: ExplanationBlock[];
  guardrails: ExplanationBlock[];
  sourceRefs: SourceRef[];
  knowledgeQueryKeys: string[];
  relatedKnowledgeCards: KnowledgeMatch[];
}

type KnowledgeSeedInput = {
  glossaryTerms: Array<{ id: string; termVi: string; shortDefinition: string; status: string }>;
  rulesCandidate: Array<{ id: string; topic: string; ruleName: string; meaningShort: string; status: string }>;
  topicMap: Array<{ id: string; label: string; status: string }>;
  licenseReviewBuckets: Array<{ id: string; label: string; status: string }>;
};

type CanonicalElement = "kim" | "moc" | "thuy" | "hoa" | "tho";

const GENERATES: Record<CanonicalElement, CanonicalElement> = {
  moc: "hoa",
  hoa: "tho",
  tho: "kim",
  kim: "thuy",
  thuy: "moc"
};

const CONTROLS: Record<CanonicalElement, CanonicalElement> = {
  moc: "tho",
  tho: "thuy",
  thuy: "hoa",
  hoa: "kim",
  kim: "moc"
};

const CANONICAL_TO_LABEL: Record<CanonicalElement, string> = {
  kim: "Kim",
  moc: "Mộc",
  thuy: "Thủy",
  hoa: "Hỏa",
  tho: "Thổ"
};

const TEN_GOD_SHORT_NOTES: Record<string, string> = {
  "ty-kien": "lớp đồng hành cùng hành với Nhật chủ, tạo khí cùng chiều trong bản đồ.",
  "kiep-tai": "lớp đồng hành khác cực, mang tính đối ứng cạnh tranh cần đọc theo vị trí.",
  "thuc-than": "lớp sinh xuất từ Nhật chủ, biểu đạt hướng phát tán khí.",
  "thuong-quan": "lớp sinh xuất khác cực, biểu hiện và phóng xuất khí theo ngữ cảnh.",
  "chinh-tai": "lớp quan hệ tài theo quy ước, cần đọc trong tổng thể không gian trụ.",
  "thien-tai": "lớp quan hệ tài linh hoạt, xuất hiện theo vị trí và nhịp khí.",
  "chinh-quan": "lớp quy tắc tạo áp lực lên Nhật chủ theo dị cực.",
  "that-sat": "lớp áp lực mạnh từ đồng cực khắc chế Nhật chủ.",
  "chinh-an": "lớp sinh trợ trực tiếp cho Nhật chủ theo dị cực.",
  "thien-an": "lớp sinh trợ từ đồng cực, mang tính ổn định và bền vững."
};

function normalizeText(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function normalizeSlug(input: string) {
  return normalizeText(input).replace(/đ/g, "d").replace(/\s+/g, "-");
}

function toCanonicalElement(input: string): CanonicalElement | undefined {
  const normalized = normalizeText(input);
  if (normalized.includes("kim")) return "kim";
  if (normalized.includes("moc")) return "moc";
  if (normalized.includes("thuy")) return "thuy";
  if (normalized.includes("hoa")) return "hoa";
  if (normalized.includes("tho")) return "tho";
  return undefined;
}

function joinNatural(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} và ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, và ${items[items.length - 1]}`;
}

function classifyProminence(count: number, min: number, max: number): "nổi bật" | "trung bình" | "ít xuất hiện" {
  if (max === min) return "trung bình";
  if (count === max) return "nổi bật";
  if (count === min) return "ít xuất hiện";
  return "trung bình";
}

function relationFromDayMaster(dayMasterElement: string, targetElement: string) {
  const dayCanonical = toCanonicalElement(dayMasterElement);
  const targetCanonical = toCanonicalElement(targetElement);

  if (!dayCanonical || !targetCanonical) {
    return {
      relation: "Quan sát thêm",
      note: `${targetElement} cần được quan sát trong tổng thể bản đồ.`
    };
  }

  if (dayCanonical === targetCanonical) {
    return {
      relation: "Đồng hành",
      note: `${CANONICAL_TO_LABEL[targetCanonical]} cùng hành với Nhật chủ, tạo lớp đồng hành trong bản đồ.`
    };
  }

  if (GENERATES[targetCanonical] === dayCanonical) {
    return {
      relation: "Sinh trợ",
      note: `${CANONICAL_TO_LABEL[targetCanonical]} sinh ra ${CANONICAL_TO_LABEL[dayCanonical]}, là lớp hỗ trợ cho Nhật chủ.`
    };
  }

  if (CONTROLS[targetCanonical] === dayCanonical) {
    return {
      relation: "Tạo áp lực",
      note: `${CANONICAL_TO_LABEL[targetCanonical]} khắc ${CANONICAL_TO_LABEL[dayCanonical]}, tạo lực tác động lên Nhật chủ.`
    };
  }

  if (GENERATES[dayCanonical] === targetCanonical) {
    return {
      relation: "Sinh xuất",
      note: `${CANONICAL_TO_LABEL[dayCanonical]} sinh ra ${CANONICAL_TO_LABEL[targetCanonical]}, là lớp phát tán từ Nhật chủ.`
    };
  }

  return {
    relation: "Tác động ra",
    note: `${CANONICAL_TO_LABEL[dayCanonical]} khắc ${CANONICAL_TO_LABEL[targetCanonical]}, là lớp tác động từ Nhật chủ ra ngoài.`
  };
}

function pickKnowledgeHint(cards: KnowledgeMatch[], predicate: (card: KnowledgeMatch) => boolean, fallback: string) {
  const found = cards.find(predicate);
  return found?.analysisHint ?? fallback;
}

function getHiddenStemReadingHint(branchHan: string, elements: string): string {
  const hints: Record<string, string> = {
    "子": "Tý chứa Quý Thủy, liên quan trực tiếp đến hành Thủy trong bản đồ.",
    "丑": "Sửu chứa Thổ, Thủy và Kim; vì vậy không nên chỉ xem Sửu là một Chi đơn lẻ.",
    "寅": "Dần chứa Mộc, Hỏa và Thổ, cần đọc theo thứ tự tàng can và lực khí.",
    "卯": "Mão chứa Ất Mộc, là lớp khí chuyên biệt cần xét cùng Can tương quan.",
    "辰": "Thìn chứa Thổ, Mộc và Thủy, là Chi đa tầng cần đọc kỹ.",
    "巳": "Tỵ chứa Hỏa, Thổ và Kim, tạo lớp chuyển tiếp khí cần quan sát.",
    "午": "Ngọ chứa Hỏa và Thổ, là nơi khí Hỏa tập trung cao.",
    "未": "Mùi chứa Thổ, Hỏa và Mộc, là lớp khí ẩn cần xét khi đọc toàn cục.",
    "申": "Thân chứa Kim, Thủy và Thổ, tạo dòng sinh xuất phức tạp.",
    "酉": "Dậu chứa Tân Kim, là Chi chuyên về Kim khí.",
    "戌": "Tuất chứa Thổ, Kim và Hỏa, cần đọc cùng các trụ còn lại.",
    "亥": "Hợi chứa Thủy và Mộc, là nơi khí Thủy vượng."
  };
  return hints[branchHan] ?? `${branchHan} chứa nhiều lớp khí ẩn, cần xét trong tổng thể.`;
}

function buildSourceRefs(content: ResultContentLayer, knowledgeSeed: KnowledgeSeedInput): SourceRef[] {
  const baseKeywords = [
    "thien can",
    "dia chi",
    "tang can",
    "nhat chu",
    "ngu hanh",
    "thap than",
    "lich phap",
    "tiet khi",
    "lap xuan",
    "gio mui",
    ...content.pillars.map((pillar) => normalizeText(pillar.pillar)),
    ...content.pillars.map((pillar) => normalizeText(pillar.stem)),
    ...content.pillars.map((pillar) => normalizeText(pillar.branch))
  ];

  const score = (text: string) => {
    const normalized = normalizeText(text);
    return baseKeywords.reduce((sum, keyword) => (normalized.includes(keyword) ? sum + 1 : sum), 0);
  };

  const glossary = knowledgeSeed.glossaryTerms
    .map((item) => ({
      ref: { id: item.id, title: item.termVi, category: "glossary_seed" as const, status: item.status },
      score: score(`${item.termVi} ${item.shortDefinition}`)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.ref);

  const rules = knowledgeSeed.rulesCandidate
    .map((item) => ({
      ref: { id: item.id, title: `${item.topic}: ${item.ruleName}`, category: "rules_candidate" as const, status: item.status },
      score: score(`${item.topic} ${item.ruleName} ${item.meaningShort}`)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.ref);

  const topics = knowledgeSeed.topicMap
    .map((item) => ({
      ref: { id: item.id, title: item.label, category: "topic_map" as const, status: item.status },
      score: score(item.label)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.ref);

  const licenses = knowledgeSeed.licenseReviewBuckets.map((item) => ({
    id: item.id,
    title: item.label,
    category: "license_review" as const,
    status: item.status
  }));

  return [...glossary, ...rules, ...topics, ...licenses];
}

export function explainChartResult(chartResult: ResultContentLayer, knowledgeSeed: KnowledgeSeedInput): ChartExplanationOutput {
  const yearPillar = chartResult.pillars.find((pillar) => pillar.key === "year");
  const monthPillar = chartResult.pillars.find((pillar) => pillar.key === "month");
  const dayPillar = chartResult.pillars.find((pillar) => pillar.key === "day");
  const hourPillar = chartResult.pillars.find((pillar) => pillar.key === "hour");

  const dayMasterName = chartResult.dayMasterSummary.name;
  const dayMasterElement = chartResult.dayMasterSummary.element;

  const elementCounts = chartResult.elementBalance.counts as Record<string, number>;
  const elementOrder = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];
  const counts = Object.values(elementCounts);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  const elementProfile: ElementProfileItem[] = elementOrder.map((element) => {
    const relation = relationFromDayMaster(dayMasterElement, element);
    return {
      element,
      count: elementCounts[element] ?? 0,
      prominence: classifyProminence(elementCounts[element] ?? 0, minCount, maxCount),
      relation: relation.relation,
      note: relation.note
    };
  });

  const prominentElements = elementProfile.filter((item) => item.prominence === "nổi bật").map((item) => item.element);
  const supportElements = elementProfile
    .filter((item) => item.relation === "Sinh trợ" || item.relation === "Đồng hành")
    .map((item) => item.element);
  const pressureElements = elementProfile
    .filter((item) => item.relation === "Tạo áp lực" || item.relation === "Sinh xuất" || item.relation === "Tác động ra")
    .map((item) => item.element);
  

  const tenGodExplanation = chartResult.tenGodOverview.map((item) => {
    if (item.count === 0) {
      return { title: item.name, body: "Chưa thấy trong lớp tính cơ bản.", level: "reference" as const, tags: ["ten_god", "not_seen"] };
    }
    const note = TEN_GOD_SHORT_NOTES[normalizeSlug(item.name)] ?? "là lớp quan hệ cần đối chiếu thêm theo vị trí.";
    return {
      title: item.name,
      body: `${item.name} xuất hiện ${item.count} lần, tại ${item.positions}. Đây là ${note}`,
      level: "basic" as const,
      tags: ["ten_god", "present"]
    };
  });

  const pillarByKey = Object.fromEntries(chartResult.pillars.map((pillar) => [pillar.key, pillar]));
  const knowledgeMatch = matchKnowledgeForChart({
    pillars: {
      year: pillarByKey.year
        ? {
            stem: pillarByKey.year.stem,
            branch: pillarByKey.year.branch,
            pillar: pillarByKey.year.pillar,
            element: pillarByKey.year.stemElement,
            hiddenStems: pillarByKey.year.hiddenStems.map((item) => item.stem),
            tenGod: pillarByKey.year.tenGod
          }
        : undefined,
      month: pillarByKey.month
        ? {
            stem: pillarByKey.month.stem,
            branch: pillarByKey.month.branch,
            pillar: pillarByKey.month.pillar,
            element: pillarByKey.month.stemElement,
            hiddenStems: pillarByKey.month.hiddenStems.map((item) => item.stem),
            tenGod: pillarByKey.month.tenGod
          }
        : undefined,
      day: pillarByKey.day
        ? {
            stem: pillarByKey.day.stem,
            branch: pillarByKey.day.branch,
            pillar: pillarByKey.day.pillar,
            element: pillarByKey.day.stemElement,
            hiddenStems: pillarByKey.day.hiddenStems.map((item) => item.stem),
            tenGod: pillarByKey.day.tenGod
          }
        : undefined,
      hour: pillarByKey.hour
        ? {
            stem: pillarByKey.hour.stem,
            branch: pillarByKey.hour.branch,
            pillar: pillarByKey.hour.pillar,
            element: pillarByKey.hour.stemElement,
            hiddenStems: pillarByKey.hour.hiddenStems.map((item) => item.stem),
            tenGod: pillarByKey.hour.tenGod
          }
        : undefined
    },
    summary: {
      dayMaster: `${dayMasterName} ${dayMasterElement}`,
      elementBalance: chartResult.elementBalance.counts,
      tenGods: chartResult.tenGodOverview.filter((item) => item.count > 0).map((item) => item.name)
    },
    input: { birthDate: chartResult.inputSummary.birthDate },
    meta: {
      calculationMode: chartResult.verification.calculationMode,
      ruleSetVersion: chartResult.verification.ruleSetVersion
    }
  });

  const selectedKnowledgeCards = knowledgeMatch.priorityCards;
  const hiddenStemBranches = chartResult.hiddenStemOverview.filter((item) => item.hiddenStems.length > 0).map((item) => item.branch);
  const notableBranchRelation = selectedKnowledgeCards.find((card) => card.group === "Quan hệ Địa Chi");
  const supportHint = pickKnowledgeHint(
    selectedKnowledgeCards,
    (card) => card.id.startsWith("rel_") && card.title.includes("sinh"),
    "Lực hỗ trợ nên đọc qua các hành sinh trợ hoặc đồng hành với Nhật chủ."
  );
  const pressureHint = pickKnowledgeHint(
    selectedKnowledgeCards,
    (card) => card.id.startsWith("rel_") && card.title.includes("khắc"),
    "Lực áp lực nên đọc qua các hành khắc hoặc làm tiêu hao Nhật chủ."
  );
  const relationHint = pickKnowledgeHint(
    selectedKnowledgeCards,
    (card) => card.group === "Quan hệ Địa Chi",
    "Quan hệ Địa Chi là lớp cần đối chiếu thêm trong toàn cục."
  );
  const dayMasterHint = pickKnowledgeHint(
    selectedKnowledgeCards,
    (card) => card.id === "term_nhat_chu" || card.title === `${dayMasterName} ${dayMasterElement}` || card.title === dayMasterName,
    "Nhật chủ là trục chính để đối chiếu Ngũ hành và Thập thần."
  );

  // Build natural language initial structure reading
  function buildInitialStructureReading(): string {
    const lines: string[] = [];
    
    // Opening
    lines.push(`Nhật chủ của bản này là ${dayMasterName} ${dayMasterElement}. `);
    
    // Element distribution
    if (prominentElements.length > 0) {
      lines.push(`Trong lớp phân bố hiện tại, ${joinNatural(prominentElements)} là những hành nổi bật hơn các hành còn lại. `);
    }
    
    // Day master focus
    lines.push(`${dayMasterElement} là trục chính của bản đồ này. `);
    
    // Support and pressure
    if (supportElements.length > 0) {
      const supportDesc = supportElements.map(e => {
        if (e === dayMasterElement) return `${e} cùng hành với Nhật chủ`;
        return `${e} sinh trợ cho ${dayMasterElement}`;
      });
      lines.push(`${joinNatural(supportDesc)} nên được xem là lớp hỗ trợ. `);
    }
    
    if (pressureElements.length > 0) {
      const pressureDesc = pressureElements.map(e => {
        if (dayMasterElement === "Thủy" && e === "Thổ") return `Thổ khắc Thủy, tạo áp lực lên Nhật chủ`;
        if (dayMasterElement === "Thủy" && e === "Hỏa") return `Thủy khắc Hỏa, là lớp tác động ra ngoài`;
        return `${e} tạo quan hệ tác động với Nhật chủ`;
      });
      lines.push(`${joinNatural(pressureDesc)} ở lớp đọc cơ bản. `);
    }
    
    // Hidden stems mention
    const branchesWithHidden = chartResult.hiddenStemOverview.filter(item => item.hiddenStems.length > 0);
    if (branchesWithHidden.length > 0) {
      const branchNames = branchesWithHidden.map(item => item.branch);
      lines.push(`Các Địa Chi ${joinNatural(branchNames)} đều chứa tàng can bên trong. `);
      lines.push(`Vì vậy khi đọc không nên chỉ nhìn bề mặt Can Chi, mà cần xét thêm phần khí ẩn trong từng Chi. `);
    }
    
    // Closing
    lines.push(`Đây là bản đọc cấu trúc ban đầu, chưa phải kết luận cuối cùng về mạnh/yếu. Muốn đọc sâu hơn cần xét thêm mùa sinh, tàng can, quan hệ giữa các trụ và dòng vận.`);
    
    return lines.join("");
  }
  
  const initialStructureBody = buildInitialStructureReading();

  return {
    overview: [
      {
        title: "Bản đồ Tứ Trụ của bạn",
        body: `Năm ${yearPillar?.pillar ?? ""} · Tháng ${monthPillar?.pillar ?? ""} · Ngày ${dayPillar?.pillar ?? ""} · Giờ ${hourPillar?.pillar ?? ""}\n\nNhật chủ: ${dayMasterName} ${dayMasterElement}\n\nBốn trụ trên được dựng từ ngày, giờ sinh bạn đã nhập. Nhật chủ là trục chính để đọc Ngũ hành, Thập thần và các quan hệ sinh khắc trong bản đồ này.`,
        level: "basic",
        tags: ["overview", "chart-header"]
      },
      {
        title: "Nhận xét cấu trúc ban đầu",
        body: initialStructureBody,
        level: "basic",
        tags: ["structure", "initial-reading"]
      }
    ],
    initialStructure: [
      {
        title: "Nhận xét cấu trúc ban đầu",
        body: initialStructureBody,
        level: "basic",
        tags: ["structure", "initial-reading"]
      }
    ],
    pillarExplanations: {
      year: [
        {
          title: "Trụ năm",
          body: "Trụ năm thường dùng để quan sát bối cảnh gốc và lớp thông tin xa, không dùng riêng để kết luận.",
          level: "basic",
          tags: ["pillar", "year"]
        }
      ],
      month: [
        {
          title: "Trụ tháng",
          body: "Trụ tháng liên quan khí tiết và mùa sinh, là lớp quan trọng khi đối chiếu cấu trúc nhưng vẫn cần đọc cùng toàn cục.",
          level: "basic",
          tags: ["pillar", "month"]
        }
      ],
      day: [
        {
          title: "Trụ ngày",
          body: "Trụ ngày chứa Nhật chủ, là trục quy chiếu để đọc các lớp còn lại.",
          level: "basic",
          tags: ["pillar", "day"]
        }
      ],
      hour: [
        {
          title: "Trụ giờ",
          body: "Trụ giờ bổ sung nhịp thời gian trong ngày và các lớp quan hệ muộn hơn, cần đặt cùng ba trụ còn lại.",
          level: "basic",
          tags: ["pillar", "hour"]
        }
      ]
    },
    elementExplanation: [
      {
        title: "Ngũ hành trong bản này",
        body: `Mỗi hành trong bản đồ cần đọc theo quan hệ với Nhật chủ ${dayMasterName} ${dayMasterElement}:\n\n${elementProfile.map(e => {
          const relationText = e.relation === "Đồng hành" ? "cùng hành với Nhật chủ, thể hiện lực đồng hành" :
            e.relation === "Sinh trợ" ? `sinh ra ${dayMasterElement}, là lớp hỗ trợ cho Nhật chủ` :
            e.relation === "Tạo áp lực" ? `khắc ${dayMasterElement}, tạo lực tác động lên Nhật chủ` :
            e.relation === "Sinh xuất" ? `do ${dayMasterElement} sinh ra, là lớp phát tán` :
            e.relation === "Tác động ra" ? `bị ${dayMasterElement} khắc, là lớp tác động ra ngoài` :
            "cần quan sát thêm trong tổng thể";
          return `${e.element}: ${e.count} lần · ${e.prominence} · ${relationText}`;
        }).join("\n")}\n\nCác nhận xét trên chỉ mô tả quan hệ Ngũ hành trong cấu trúc lá số, không dùng riêng để kết luận tốt/xấu.`,
        level: "basic",
        tags: ["elements", "profile"]
      }
    ],
    elementProfile,
    tenGodExplanation,
    hiddenStemExplanation: [
      {
        title: "Tàng can cần chú ý",
        body: chartResult.hiddenStemOverview
          .filter(item => item.hiddenStems.length > 0)
          .map((item) => {
            const stems = item.hiddenStems.map((stem) => `${stem.stem}`).join(", ");
            const elements = item.hiddenStems.map((stem) => stem.element).join(", ");
            const readingHint = getHiddenStemReadingHint(item.branchHan, elements);
            return `${item.branch}:\nTàng can: ${stems}\nGợi ý đọc: ${readingHint}`;
          })
          .join("\n\n"),
        level: "basic",
        tags: ["hidden_stems", "reading"]
      }
    ],
    finalReading: [
      {
        title: "Bạn nên xem tiếp",
        body: `Sau khi đọc bản đồ cơ bản, bạn có thể xem thêm:\n\n• Xem từng trụ chi tiết – phân tích Can, Chi, Tàng can của mỗi trụ\n• Xem Ngũ hành sâu hơn – quan hệ sinh khắc và cân bằng khí\n• Xem Thập thần – quan hệ của các Can với Nhật chủ\n• Xem Dòng vận – Đại vận và Lưu niên đối chiếu với bản đồ gốc\n• Xem nguồn đối chiếu – quy tắc và thuật ngữ cổ học\n\nNếu bạn mới bắt đầu, nên đọc theo thứ tự: Nhật chủ → Bốn trụ → Ngũ hành → Tàng can → Thập thần → Dòng vận.`,
        level: "basic",
        tags: ["next-steps", "guide"]
      }
    ],
    guardrails: [
      {
        title: "Lưu ý quan trọng",
        body: "Các nhận xét trên là phân tích cấu trúc theo quy tắc cổ học, không phải kết luận chắc chắn về đời người. Khi đọc cần đối chiếu thêm mùa sinh, tàng can, dòng vận và nguồn tham khảo.",
        level: "basic",
        tags: ["guardrail", "safety"]
      }
    ],
    sourceRefs: buildSourceRefs(chartResult, knowledgeSeed),
    knowledgeQueryKeys: knowledgeMatch.queryKeys,
    relatedKnowledgeCards: selectedKnowledgeCards
  };
}
