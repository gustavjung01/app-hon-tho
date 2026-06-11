import type { DeriveFourPillarsOutput, Pillar } from "./types";
import {
  TEN_GOD_NOTES,
  TEN_GOD_ORDER,
  deriveTenGod,
  findBranchByHan,
  findStemByHan,
  getHiddenStemsForBranch,
  type ElementName,
  type StemDefinition,
  type TenGodName
} from "./coreTables";

const PILLAR_ROLE_NOTES: Record<"year" | "month" | "day" | "hour", string> = {
  year: "Trụ năm thường dùng để quan sát bối cảnh gốc, không dùng riêng để kết luận.",
  month: "Trụ tháng phản ánh khí mùa và nền lịch pháp trong bố cục bốn trụ.",
  day: "Trụ ngày chứa Nhật chủ, là điểm trung tâm để đối chiếu các quan hệ.",
  hour: "Trụ giờ bổ sung lớp quan sát theo nhịp thời gian trong ngày."
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

function asElementName(value: string): ElementName {
  if (value === "Kim" || value === "Mộc" || value === "Thủy" || value === "Hỏa" || value === "Thổ") {
    return value;
  }
  return "Thổ";
}

function buildHiddenStemDetails(pillar: Pillar, dayStem: StemDefinition): HiddenStemDetail[] {
  return getHiddenStemsForBranch(pillar.branchHan).map((hiddenStem) => ({
    stem: hiddenStem.stem,
    stemHan: hiddenStem.stemHan,
    element: hiddenStem.element,
    tenGod: deriveTenGod(dayStem, hiddenStem)
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
    Kim: 0,
    Mộc: 0,
    Thủy: 0,
    Hỏa: 0,
    Thổ: 0
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
      note: hasValue ? TEN_GOD_NOTES[name] : "Chưa diễn giải sâu ở bản này. Mục này chỉ dùng để nhận diện vị trí và tần suất.",
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
