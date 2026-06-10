import type { DeriveFourPillarsOutput, Pillar } from "./types";

type Polarity = "yang" | "yin";
type ElementName = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";

type StemRecord = {
  name: string;
  han: string;
  element: ElementName;
  polarity: Polarity;
};

type BranchRecord = {
  name: string;
  han: string;
  element: ElementName;
};

export type TenGodName =
  | "Tỷ kiên"
  | "Kiếp tài"
  | "Thực thần"
  | "Thương quan"
  | "Chính tài"
  | "Thiên tài"
  | "Chính quan"
  | "Thất sát"
  | "Chính ấn"
  | "Thiên ấn";

export const TEN_GOD_ORDER: TenGodName[] = [
  "Tỷ kiên",
  "Kiếp tài",
  "Thực thần",
  "Thương quan",
  "Chính tài",
  "Thiên tài",
  "Chính quan",
  "Thất sát",
  "Chính ấn",
  "Thiên ấn"
];

const STEM_TABLE: StemRecord[] = [
  { name: "Giáp", han: "甲", element: "Mộc", polarity: "yang" },
  { name: "Ất", han: "乙", element: "Mộc", polarity: "yin" },
  { name: "Bính", han: "丙", element: "Hỏa", polarity: "yang" },
  { name: "Đinh", han: "丁", element: "Hỏa", polarity: "yin" },
  { name: "Mậu", han: "戊", element: "Thổ", polarity: "yang" },
  { name: "Kỷ", han: "己", element: "Thổ", polarity: "yin" },
  { name: "Canh", han: "庚", element: "Kim", polarity: "yang" },
  { name: "Tân", han: "辛", element: "Kim", polarity: "yin" },
  { name: "Nhâm", han: "壬", element: "Thủy", polarity: "yang" },
  { name: "Quý", han: "癸", element: "Thủy", polarity: "yin" }
];

const BRANCH_TABLE: BranchRecord[] = [
  { name: "Tý", han: "子", element: "Thủy" },
  { name: "Sửu", han: "丑", element: "Thổ" },
  { name: "Dần", han: "寅", element: "Mộc" },
  { name: "Mão", han: "卯", element: "Mộc" },
  { name: "Thìn", han: "辰", element: "Thổ" },
  { name: "Tỵ", han: "巳", element: "Hỏa" },
  { name: "Ngọ", han: "午", element: "Hỏa" },
  { name: "Mùi", han: "未", element: "Thổ" },
  { name: "Thân", han: "申", element: "Kim" },
  { name: "Dậu", han: "酉", element: "Kim" },
  { name: "Tuất", han: "戌", element: "Thổ" },
  { name: "Hợi", han: "亥", element: "Thủy" }
];

const HIDDEN_STEMS_BY_BRANCH_HAN: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"]
};

const PILLAR_ROLE_NOTES: Record<"year" | "month" | "day" | "hour", string> = {
  year: "Trụ năm thường dùng để quan sát bối cảnh gốc, không dùng riêng để kết luận.",
  month: "Trụ tháng phản ánh khí mùa và nền lịch pháp trong bố cục bốn trụ.",
  day: "Trụ ngày chứa Nhật chủ, là điểm trung tâm để đối chiếu các quan hệ.",
  hour: "Trụ giờ bổ sung lớp quan sát theo nhịp thời gian trong ngày."
};

const TEN_GOD_NOTES: Record<TenGodName, string> = {
  "Tỷ kiên": "Cùng hành với Nhật chủ, tạo lớp đồng hành trong bản đồ.",
  "Kiếp tài": "Cùng hành nhưng khác cực, mang tính đối ứng cạnh tranh.",
  "Thực thần": "Nhật chủ sinh ra theo đồng cực, là lớp biểu đạt.",
  "Thương quan": "Nhật chủ sinh ra theo dị cực, là lớp xuất khí.",
  "Chính tài": "Nhật chủ khắc theo dị cực, là quan hệ tài theo quy ước.",
  "Thiên tài": "Nhật chủ khắc theo đồng cực, là quan hệ tài linh hoạt.",
  "Chính quan": "Khắc Nhật chủ theo dị cực, là lớp quy tắc tạo áp lực.",
  "Thất sát": "Khắc Nhật chủ theo đồng cực, là lớp áp lực mạnh.",
  "Chính ấn": "Sinh trợ Nhật chủ theo dị cực, là lớp hỗ trợ trực tiếp.",
  "Thiên ấn": "Sinh trợ Nhật chủ theo đồng cực, là lớp hỗ trợ ổn định."
};

const GENERATES: Record<ElementName, ElementName> = {
  "Mộc": "Hỏa",
  "Hỏa": "Thổ",
  "Thổ": "Kim",
  "Kim": "Thủy",
  "Thủy": "Mộc"
};

const CONTROLS: Record<ElementName, ElementName> = {
  "Mộc": "Thổ",
  "Thổ": "Thủy",
  "Thủy": "Hỏa",
  "Hỏa": "Kim",
  "Kim": "Mộc"
};

export interface HiddenStemDetail {
  stem: string;
  stemHan: string;
  element: ElementName;
  tenGod: string;
}

export interface ResultPillarCard {
  key: "year" | "month" | "day" | "hour";
  label: string;
  pillar: string;
  pillarHan: string;
  stem: string;
  stemHan: string;
  stemElement: ElementName;
  branch: string;
  branchHan: string;
  branchElement: ElementName;
  hiddenStems: HiddenStemDetail[];
  tenGod: string;
  note: string;
}

export interface TenGodOverviewItem {
  name: TenGodName;
  count: number;
  positions: string;
  note: string;
  status: "computed" | "pending";
}

export interface HiddenStemOverviewRow {
  branch: string;
  branchHan: string;
  hiddenStems: HiddenStemDetail[];
}

export interface ElementBalanceSummary {
  counts: Record<ElementName, number>;
  includesHiddenStems: boolean;
  note: string;
}

export interface ResultContentLayer {
  inputSummary: {
    birthDate: string;
    birthTime: string;
    calendarType: string;
    timezone: string;
    birthPlace?: string;
    note: string;
  };
  verification: {
    engineVersion: string;
    ruleSetVersion: string;
    calculationMode: string;
    runtimeStatus: string;
    mockNotice: string;
  };
  pillars: ResultPillarCard[];
  dayMasterSummary: {
    name: string;
    han: string;
    element: ElementName;
    note: string;
  };
  elementBalance: ElementBalanceSummary;
  tenGodOverview: TenGodOverviewItem[];
  hiddenStemOverview: HiddenStemOverviewRow[];
  guardrail: string;
}

function findStemByHan(han: string) {
  return STEM_TABLE.find((item) => item.han === han);
}

function findBranchByHan(han: string) {
  return BRANCH_TABLE.find((item) => item.han === han);
}

function getHiddenStems(branchHan: string) {
  return HIDDEN_STEMS_BY_BRANCH_HAN[branchHan] ?? [];
}

type RelationType = "same" | "day-produces" | "target-produces" | "day-controls" | "target-controls" | "unknown";

function resolveRelation(dayElement: ElementName, targetElement: ElementName): RelationType {
  if (dayElement === targetElement) return "same";
  if (GENERATES[dayElement] === targetElement) return "day-produces";
  if (GENERATES[targetElement] === dayElement) return "target-produces";
  if (CONTROLS[dayElement] === targetElement) return "day-controls";
  if (CONTROLS[targetElement] === dayElement) return "target-controls";
  return "unknown";
}

function deriveTenGod(dayStem: StemRecord, targetStem: StemRecord) {
  const samePolarity = dayStem.polarity === targetStem.polarity;
  const relation = resolveRelation(dayStem.element, targetStem.element);

  if (relation === "same") return samePolarity ? "Tỷ kiên" : "Kiếp tài";
  if (relation === "day-produces") return samePolarity ? "Thực thần" : "Thương quan";
  if (relation === "target-produces") return samePolarity ? "Thiên ấn" : "Chính ấn";
  if (relation === "day-controls") return samePolarity ? "Thiên tài" : "Chính tài";
  if (relation === "target-controls") return samePolarity ? "Thất sát" : "Chính quan";
  return "Chưa đủ dữ liệu để diễn giải sâu hơn.";
}

function asElementName(value: string): ElementName {
  if (value === "Kim" || value === "Mộc" || value === "Thủy" || value === "Hỏa" || value === "Thổ") {
    return value;
  }
  return "Thổ";
}

function buildHiddenStemDetails(pillar: Pillar, dayStem: StemRecord): HiddenStemDetail[] {
  return getHiddenStems(pillar.branchHan)
    .map((stemHan) => findStemByHan(stemHan))
    .filter((stem): stem is StemRecord => Boolean(stem))
    .map((stem) => ({
      stem: stem.name,
      stemHan: stem.han,
      element: stem.element,
      tenGod: deriveTenGod(dayStem, stem)
    }));
}

export function buildResultContentLayer(result: DeriveFourPillarsOutput): ResultContentLayer {
  const dayStem = findStemByHan(result.pillars.day.stemHan);
  if (!dayStem) {
    throw new Error("Không nhận diện được Nhật chủ từ kết quả engine.");
  }

  const pillarEntries: Array<{ key: "year" | "month" | "day" | "hour"; label: string; pillar: Pillar }> = [
    { key: "year", label: "Năm", pillar: result.pillars.year },
    { key: "month", label: "Tháng", pillar: result.pillars.month },
    { key: "day", label: "Ngày", pillar: result.pillars.day },
    { key: "hour", label: "Giờ", pillar: result.pillars.hour }
  ];

  const cards: ResultPillarCard[] = pillarEntries.map(({ key, label, pillar }) => {
    const stem = findStemByHan(pillar.stemHan);
    const branch = findBranchByHan(pillar.branchHan);
    const hiddenStems = buildHiddenStemDetails(pillar, dayStem);

    if (!stem || !branch) {
      throw new Error(`Không nhận diện được Can/Chi cho trụ ${label}.`);
    }

    return {
      key,
      label,
      pillar: pillar.pillar,
      pillarHan: pillar.pillarHan,
      stem: pillar.stem,
      stemHan: pillar.stemHan,
      stemElement: stem.element,
      branch: pillar.branch,
      branchHan: pillar.branchHan,
      branchElement: branch.element,
      hiddenStems,
      tenGod: key === "day" ? "Nhật chủ" : deriveTenGod(dayStem, stem),
      note: PILLAR_ROLE_NOTES[key]
    };
  });

  const elementCounts: Record<ElementName, number> = {
    "Kim": 0,
    "Mộc": 0,
    "Thủy": 0,
    "Hỏa": 0,
    "Thổ": 0
  };

  cards.forEach((card) => {
    elementCounts[asElementName(card.stemElement)] += 1;
    elementCounts[asElementName(card.branchElement)] += 1;
    card.hiddenStems.forEach((item) => {
      elementCounts[item.element] += 1;
    });
  });

  const tenGodBuckets = TEN_GOD_ORDER.reduce(
    (acc, name) => {
      acc[name] = { count: 0, positions: [] };
      return acc;
    },
    {} as Record<TenGodName, { count: number; positions: string[] }>
  );

  cards.forEach((card) => {
    if (card.key !== "day" && TEN_GOD_ORDER.includes(card.tenGod as TenGodName)) {
      const key = card.tenGod as TenGodName;
      tenGodBuckets[key].count += 1;
      tenGodBuckets[key].positions.push(`Can ${card.label}`);
    }

    card.hiddenStems.forEach((item) => {
      if (TEN_GOD_ORDER.includes(item.tenGod as TenGodName)) {
        const key = item.tenGod as TenGodName;
        tenGodBuckets[key].count += 1;
        tenGodBuckets[key].positions.push(`Tàng can ${card.label} (${card.branch})`);
      }
    });
  });

  const tenGodOverview: TenGodOverviewItem[] = TEN_GOD_ORDER.map((name) => {
    const bucket = tenGodBuckets[name];
    const hasValue = bucket.count > 0;
    return {
      name,
      count: bucket.count,
      positions: hasValue ? bucket.positions.join(", ") : "Mức đọc hiện tại: chưa thấy trong lớp tính cơ bản.",
      note: hasValue
        ? TEN_GOD_NOTES[name]
        : "Chưa diễn giải sâu ở bản này. Mục này chỉ dùng để nhận diện vị trí và tần suất.",
      status: hasValue ? "computed" : "pending"
    };
  });

  const hiddenStemOverview: HiddenStemOverviewRow[] = cards.map((card) => ({
    branch: card.branch,
    branchHan: card.branchHan,
    hiddenStems: card.hiddenStems
  }));

  const calendarLabel = result.input.calendarType === "solar" ? "Dương lịch" : "Âm lịch";
  const birthPlace = result.input.birthPlace?.trim();

  return {
    inputSummary: {
      birthDate: result.input.birthDate,
      birthTime: result.input.birthTime,
      calendarType: calendarLabel,
      timezone: result.input.timezone,
      birthPlace: birthPlace ? birthPlace : undefined,
      note: "Kết quả dưới đây dùng giờ địa phương theo múi giờ đã chọn."
    },
    verification: {
      engineVersion: `v${result.meta.engineVersion}`,
      ruleSetVersion: result.meta.ruleSetVersion,
      calculationMode: result.meta.calculationMode,
      runtimeStatus: "Mức đọc hiện tại: đối chiếu cơ bản.",
      mockNotice: "Lớp này dùng quy tắc nền, chưa dùng làm kết luận tự động. Cần đọc cùng toàn cục và nguồn tham khảo."
    },
    pillars: cards,
    dayMasterSummary: {
      name: dayStem.name,
      han: dayStem.han,
      element: dayStem.element,
      note: "Nhật chủ là điểm trung tâm để đối chiếu Thập thần. Không nên dùng riêng Nhật chủ để kết luận về tính cách hay vận trình."
    },
    elementBalance: {
      counts: elementCounts,
      includesHiddenStems: true,
      note: "Bản này tính phân bố cơ bản từ Can/Chi và Tàng can. Chưa có trọng số vượng suy và chưa dùng cho kết luận vận mệnh."
    },
    tenGodOverview,
    hiddenStemOverview,
    guardrail:
      "Các lớp Can Chi, Ngũ hành, Thập thần và Dòng vận là công cụ tham khảo cổ học. Kết quả này không dùng để phán định đời người, không thay thế quyết định thực tế."
  };
}
