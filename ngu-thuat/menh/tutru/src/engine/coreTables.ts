export type ElementName = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
export type Polarity = "yang" | "yin";
export type PolarityLabel = "Dương" | "Âm";

export interface ElementDefinition {
  name: ElementName;
  han: string;
  direction: string;
  season: string;
}

export interface StemDefinition {
  index: number;
  name: string;
  han: string;
  element: ElementName;
  polarity: Polarity;
  polarityLabel: PolarityLabel;
}

export interface BranchDefinition {
  index: number;
  name: string;
  han: string;
  animal: string;
  element: ElementName;
  polarity: Polarity;
  polarityLabel: PolarityLabel;
  season: string;
  monthLabel: string;
}

export type HiddenStemQi = "main" | "middle" | "residual";

export interface HiddenStemDefinition {
  branch: string;
  branchHan: string;
  stem: string;
  stemHan: string;
  stemIndex: number;
  element: ElementName;
  polarity: Polarity;
  polarityLabel: PolarityLabel;
  qi: HiddenStemQi;
  qiLabel: string;
  order: number;
}

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

export type ElementRelation = "same" | "day-produces" | "target-produces" | "day-controls" | "target-controls";

export interface TwelveGrowthStage {
  order: number;
  name: string;
  branch: string;
  branchHan: string;
}

export const CORE_TABLE_VERSION = "core-table-v0.1";

export const ELEMENTS: ElementDefinition[] = [
  { name: "Mộc", han: "木", direction: "Đông", season: "Xuân" },
  { name: "Hỏa", han: "火", direction: "Nam", season: "Hạ" },
  { name: "Thổ", han: "土", direction: "Trung cung", season: "Tứ quý" },
  { name: "Kim", han: "金", direction: "Tây", season: "Thu" },
  { name: "Thủy", han: "水", direction: "Bắc", season: "Đông" }
];

export const STEMS: StemDefinition[] = [
  { index: 0, name: "Giáp", han: "甲", element: "Mộc", polarity: "yang", polarityLabel: "Dương" },
  { index: 1, name: "Ất", han: "乙", element: "Mộc", polarity: "yin", polarityLabel: "Âm" },
  { index: 2, name: "Bính", han: "丙", element: "Hỏa", polarity: "yang", polarityLabel: "Dương" },
  { index: 3, name: "Đinh", han: "丁", element: "Hỏa", polarity: "yin", polarityLabel: "Âm" },
  { index: 4, name: "Mậu", han: "戊", element: "Thổ", polarity: "yang", polarityLabel: "Dương" },
  { index: 5, name: "Kỷ", han: "己", element: "Thổ", polarity: "yin", polarityLabel: "Âm" },
  { index: 6, name: "Canh", han: "庚", element: "Kim", polarity: "yang", polarityLabel: "Dương" },
  { index: 7, name: "Tân", han: "辛", element: "Kim", polarity: "yin", polarityLabel: "Âm" },
  { index: 8, name: "Nhâm", han: "壬", element: "Thủy", polarity: "yang", polarityLabel: "Dương" },
  { index: 9, name: "Quý", han: "癸", element: "Thủy", polarity: "yin", polarityLabel: "Âm" }
];

export const BRANCHES: BranchDefinition[] = [
  { index: 0, name: "Tý", han: "子", animal: "Chuột", element: "Thủy", polarity: "yang", polarityLabel: "Dương", season: "Đông", monthLabel: "Tháng Tý" },
  { index: 1, name: "Sửu", han: "丑", animal: "Trâu", element: "Thổ", polarity: "yin", polarityLabel: "Âm", season: "Cuối đông", monthLabel: "Tháng Sửu" },
  { index: 2, name: "Dần", han: "寅", animal: "Hổ", element: "Mộc", polarity: "yang", polarityLabel: "Dương", season: "Đầu xuân", monthLabel: "Tháng Dần" },
  { index: 3, name: "Mão", han: "卯", animal: "Mèo/Thỏ", element: "Mộc", polarity: "yin", polarityLabel: "Âm", season: "Xuân", monthLabel: "Tháng Mão" },
  { index: 4, name: "Thìn", han: "辰", animal: "Rồng", element: "Thổ", polarity: "yang", polarityLabel: "Dương", season: "Cuối xuân", monthLabel: "Tháng Thìn" },
  { index: 5, name: "Tỵ", han: "巳", animal: "Rắn", element: "Hỏa", polarity: "yin", polarityLabel: "Âm", season: "Đầu hạ", monthLabel: "Tháng Tỵ" },
  { index: 6, name: "Ngọ", han: "午", animal: "Ngựa", element: "Hỏa", polarity: "yang", polarityLabel: "Dương", season: "Hạ", monthLabel: "Tháng Ngọ" },
  { index: 7, name: "Mùi", han: "未", animal: "Dê", element: "Thổ", polarity: "yin", polarityLabel: "Âm", season: "Cuối hạ", monthLabel: "Tháng Mùi" },
  { index: 8, name: "Thân", han: "申", animal: "Khỉ", element: "Kim", polarity: "yang", polarityLabel: "Dương", season: "Đầu thu", monthLabel: "Tháng Thân" },
  { index: 9, name: "Dậu", han: "酉", animal: "Gà", element: "Kim", polarity: "yin", polarityLabel: "Âm", season: "Thu", monthLabel: "Tháng Dậu" },
  { index: 10, name: "Tuất", han: "戌", animal: "Chó", element: "Thổ", polarity: "yang", polarityLabel: "Dương", season: "Cuối thu", monthLabel: "Tháng Tuất" },
  { index: 11, name: "Hợi", han: "亥", animal: "Heo", element: "Thủy", polarity: "yin", polarityLabel: "Âm", season: "Đầu đông", monthLabel: "Tháng Hợi" }
];

export const GENERATES: Record<ElementName, ElementName> = { Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc" };
export const CONTROLS: Record<ElementName, ElementName> = { Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc" };

export const TEN_GOD_ORDER: TenGodName[] = ["Tỷ kiên", "Kiếp tài", "Thực thần", "Thương quan", "Chính tài", "Thiên tài", "Chính quan", "Thất sát", "Chính ấn", "Thiên ấn"];

export const TEN_GOD_NOTES: Record<TenGodName, string> = {
  "Tỷ kiên": "Cùng hành, cùng âm dương với Nhật chủ.",
  "Kiếp tài": "Cùng hành, khác âm dương với Nhật chủ.",
  "Thực thần": "Nhật chủ sinh ra, cùng âm dương.",
  "Thương quan": "Nhật chủ sinh ra, khác âm dương.",
  "Chính tài": "Nhật chủ khắc, khác âm dương.",
  "Thiên tài": "Nhật chủ khắc, cùng âm dương.",
  "Chính quan": "Khắc Nhật chủ, khác âm dương.",
  "Thất sát": "Khắc Nhật chủ, cùng âm dương.",
  "Chính ấn": "Sinh trợ Nhật chủ, khác âm dương.",
  "Thiên ấn": "Sinh trợ Nhật chủ, cùng âm dương."
};

const HIDDEN_STEM_ROWS: Record<string, Array<{ stemHan: string; qi: HiddenStemQi; qiLabel: string }>> = {
  子: [{ stemHan: "癸", qi: "main", qiLabel: "Bản khí" }],
  丑: [{ stemHan: "己", qi: "main", qiLabel: "Bản khí" }, { stemHan: "癸", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "辛", qi: "residual", qiLabel: "Dư khí" }],
  寅: [{ stemHan: "甲", qi: "main", qiLabel: "Bản khí" }, { stemHan: "丙", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "戊", qi: "residual", qiLabel: "Dư khí" }],
  卯: [{ stemHan: "乙", qi: "main", qiLabel: "Bản khí" }],
  辰: [{ stemHan: "戊", qi: "main", qiLabel: "Bản khí" }, { stemHan: "乙", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "癸", qi: "residual", qiLabel: "Dư khí" }],
  巳: [{ stemHan: "丙", qi: "main", qiLabel: "Bản khí" }, { stemHan: "戊", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "庚", qi: "residual", qiLabel: "Dư khí" }],
  午: [{ stemHan: "丁", qi: "main", qiLabel: "Bản khí" }, { stemHan: "己", qi: "middle", qiLabel: "Trung khí" }],
  未: [{ stemHan: "己", qi: "main", qiLabel: "Bản khí" }, { stemHan: "丁", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "乙", qi: "residual", qiLabel: "Dư khí" }],
  申: [{ stemHan: "庚", qi: "main", qiLabel: "Bản khí" }, { stemHan: "壬", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "戊", qi: "residual", qiLabel: "Dư khí" }],
  酉: [{ stemHan: "辛", qi: "main", qiLabel: "Bản khí" }],
  戌: [{ stemHan: "戊", qi: "main", qiLabel: "Bản khí" }, { stemHan: "辛", qi: "middle", qiLabel: "Trung khí" }, { stemHan: "丁", qi: "residual", qiLabel: "Dư khí" }],
  亥: [{ stemHan: "壬", qi: "main", qiLabel: "Bản khí" }, { stemHan: "甲", qi: "middle", qiLabel: "Trung khí" }]
};

export function normalizeModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function getStemByIndex(index: number) {
  return STEMS[normalizeModulo(index, STEMS.length)];
}

export function getBranchByIndex(index: number) {
  return BRANCHES[normalizeModulo(index, BRANCHES.length)];
}

export function findStemByHan(han: string) {
  return STEMS.find((item) => item.han === han);
}

export function findBranchByHan(han: string) {
  return BRANCHES.find((item) => item.han === han);
}

export function findStemByName(name: string) {
  return STEMS.find((item) => item.name === name);
}

export function findBranchByName(name: string) {
  return BRANCHES.find((item) => item.name === name);
}

export const HIDDEN_STEMS_BY_BRANCH_HAN: Record<string, HiddenStemDefinition[]> = Object.fromEntries(
  BRANCHES.map((branch) => [
    branch.han,
    (HIDDEN_STEM_ROWS[branch.han] ?? []).map((row, rowIndex) => {
      const stem = findStemByHan(row.stemHan);
      if (!stem) throw new Error(`Unknown hidden stem ${row.stemHan}`);
      return { branch: branch.name, branchHan: branch.han, stem: stem.name, stemHan: stem.han, stemIndex: stem.index, element: stem.element, polarity: stem.polarity, polarityLabel: stem.polarityLabel, qi: row.qi, qiLabel: row.qiLabel, order: rowIndex + 1 };
    })
  ])
);

export function getHiddenStemsForBranch(branchHan: string) {
  return HIDDEN_STEMS_BY_BRANCH_HAN[branchHan] ?? [];
}

export function resolveElementRelation(dayElement: ElementName, targetElement: ElementName): ElementRelation {
  if (dayElement === targetElement) return "same";
  if (GENERATES[dayElement] === targetElement) return "day-produces";
  if (GENERATES[targetElement] === dayElement) return "target-produces";
  if (CONTROLS[dayElement] === targetElement) return "day-controls";
  return "target-controls";
}

export function deriveTenGod(dayStem: Pick<StemDefinition, "element" | "polarity">, targetStem: Pick<StemDefinition, "element" | "polarity">): TenGodName {
  const samePolarity = dayStem.polarity === targetStem.polarity;
  const relation = resolveElementRelation(dayStem.element, targetStem.element);
  if (relation === "same") return samePolarity ? "Tỷ kiên" : "Kiếp tài";
  if (relation === "day-produces") return samePolarity ? "Thực thần" : "Thương quan";
  if (relation === "target-produces") return samePolarity ? "Thiên ấn" : "Chính ấn";
  if (relation === "day-controls") return samePolarity ? "Thiên tài" : "Chính tài";
  return samePolarity ? "Thất sát" : "Chính quan";
}

export const TWELVE_GROWTH_STAGE_ORDER = [
  { order: 0, name: "Trường sinh" },
  { order: 1, name: "Mộc dục" },
  { order: 2, name: "Quan đới" },
  { order: 3, name: "Lâm quan" },
  { order: 4, name: "Đế vượng" },
  { order: 5, name: "Suy" },
  { order: 6, name: "Bệnh" },
  { order: 7, name: "Tử" },
  { order: 8, name: "Mộ" },
  { order: 9, name: "Tuyệt" },
  { order: 10, name: "Thai" },
  { order: 11, name: "Dưỡng" }
];

export const TWELVE_GROWTH_BRANCHES_BY_STEM_HAN: Record<string, string[]> = {
  甲: ["亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌"],
  乙: ["午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌", "酉", "申", "未"],
  丙: ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"],
  丁: ["酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌"],
  戊: ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"],
  己: ["酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑", "子", "亥", "戌"],
  庚: ["巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰"],
  辛: ["子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑"],
  壬: ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"],
  癸: ["卯", "寅", "丑", "子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰"]
};

export const TWELVE_GROWTH_STAGES_BY_STEM_HAN: Record<string, TwelveGrowthStage[]> = Object.fromEntries(
  Object.entries(TWELVE_GROWTH_BRANCHES_BY_STEM_HAN).map(([stemHan, branchHanList]) => [
    stemHan,
    branchHanList.map((branchHan, index) => {
      const branch = findBranchByHan(branchHan);
      const stage = TWELVE_GROWTH_STAGE_ORDER[index];
      if (!branch || !stage) throw new Error(`Unknown growth stage ${stemHan}/${branchHan}`);
      return { order: stage.order, name: stage.name, branch: branch.name, branchHan: branch.han };
    })
  ])
);

export function getTwelveGrowthStage(dayStemHan: string, branchHan: string) {
  return TWELVE_GROWTH_STAGES_BY_STEM_HAN[dayStemHan]?.find((item) => item.branchHan === branchHan);
}
