import type { KnowledgeCard } from "../data/runtimeKnowledgeCards";
import { runtimeKnowledgeCards } from "../data/runtimeKnowledgeCards";

type PillarLike = {
  stem?: string;
  branch?: string;
  pillar?: string;
  element?: string;
  hiddenStems?: string[];
  tenGod?: string;
};

type ChartLike = {
  pillars?: {
    year?: PillarLike;
    month?: PillarLike;
    day?: PillarLike;
    hour?: PillarLike;
  };
  summary?: {
    dayMaster?: string;
    elementBalance?: Record<string, number>;
    tenGods?: string[];
  };
  input?: {
    birthDate?: string;
  };
  meta?: {
    calculationMode?: string;
    ruleSetVersion?: string;
  };
};

type BranchRelationRule = {
  id: string;
  branches: string[];
};

const BRANCH_RELATION_RULES: BranchRelationRule[] = [
  { id: "ty-suu-hop", branches: ["Tý", "Sửu"] },
  { id: "dan-hoi-hop", branches: ["Dần", "Hợi"] },
  { id: "mao-tuat-hop", branches: ["Mão", "Tuất"] },
  { id: "thin-dau-hop", branches: ["Thìn", "Dậu"] },
  { id: "ty-than-hop", branches: ["Tỵ", "Thân"] },
  { id: "ngo-mui-hop", branches: ["Ngọ", "Mùi"] },
  { id: "ty-ngo-xung", branches: ["Tý", "Ngọ"] },
  { id: "suu-mui-xung", branches: ["Sửu", "Mùi"] },
  { id: "dan-than-xung", branches: ["Dần", "Thân"] },
  { id: "mao-dau-xung", branches: ["Mão", "Dậu"] },
  { id: "thin-tuat-xung", branches: ["Thìn", "Tuất"] },
  { id: "ty-hoi-xung", branches: ["Tỵ", "Hợi"] },
  { id: "tuat-mui-hinh", branches: ["Tuất", "Mùi"] },
  { id: "suu-tuat-hinh", branches: ["Sửu", "Tuất"] },
  { id: "suu-mui-hinh", branches: ["Sửu", "Mùi"] },
  { id: "dan-ty-hinh", branches: ["Dần", "Tỵ"] },
  { id: "ty-mui-hai", branches: ["Tý", "Mùi"] },
  { id: "suu-ngo-hai", branches: ["Sửu", "Ngọ"] },
  { id: "dan-ty-hai", branches: ["Dần", "Tỵ"] },
  { id: "mao-thin-hai", branches: ["Mão", "Thìn"] },
  { id: "than-hoi-hai", branches: ["Thân", "Hợi"] },
  { id: "dau-tuat-hai", branches: ["Dậu", "Tuất"] },
  { id: "ty-dau-pha", branches: ["Tý", "Dậu"] },
  { id: "mao-ngo-pha", branches: ["Mão", "Ngọ"] },
  { id: "than-ty-thin-tam-hop", branches: ["Thân", "Tý", "Thìn"] },
  { id: "dan-ngo-tuat-tam-hop", branches: ["Dần", "Ngọ", "Tuất"] },
  { id: "hoi-mao-mui-tam-hop", branches: ["Hợi", "Mão", "Mùi"] },
  { id: "hoi-ty-suu-tam-hoi", branches: ["Hợi", "Tý", "Sửu"] },
  { id: "dan-mao-thin-tam-hoi", branches: ["Dần", "Mão", "Thìn"] },
  { id: "than-dau-tuat-tam-hoi", branches: ["Thân", "Dậu", "Tuất"] }
];

const STEM_ELEMENT_MAP: Record<string, string> = {
  "Giáp": "Mộc",
  "Ất": "Mộc",
  "Bính": "Hỏa",
  "Đinh": "Hỏa",
  "Mậu": "Thổ",
  "Kỷ": "Thổ",
  "Canh": "Kim",
  "Tân": "Kim",
  "Nhâm": "Thủy",
  "Quý": "Thủy"
};

const ELEMENT_GENERATES: Record<string, string> = {
  "Mộc": "Hỏa",
  "Hỏa": "Thổ",
  "Thổ": "Kim",
  "Kim": "Thủy",
  "Thủy": "Mộc"
};

const ELEMENT_CONTROLS: Record<string, string> = {
  "Mộc": "Thổ",
  "Thổ": "Thủy",
  "Thủy": "Hỏa",
  "Hỏa": "Kim",
  "Kim": "Mộc"
};

export type KnowledgeMatch = KnowledgeCard & {
  reason: string;
  score: number;
  matchedSignals: string[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-");
}

function parseDayMasterElement(dayMaster: string | undefined) {
  if (!dayMaster) return undefined;
  const normalized = dayMaster.replace(/\s+/g, " ").trim();
  const parts = normalized.split(" ");
  if (parts.length >= 2) {
    const maybeElement = parts[parts.length - 1];
    if (["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"].includes(maybeElement)) {
      return maybeElement;
    }
  }
  const stem = parts[0];
  return STEM_ELEMENT_MAP[stem];
}

function buildBranchRelations(branches: string[]) {
  const branchSet = new Set(branches);
  return BRANCH_RELATION_RULES.filter((rule) => rule.branches.every((branch) => branchSet.has(branch))).map((rule) => rule.id);
}

function buildDayMasterRelationKeys(dayMasterElement: string | undefined, presentElements: string[]) {
  if (!dayMasterElement) return [];
  const keys = new Set<string>();
  const dayMaster = dayMasterElement;

  for (const element of presentElements) {
    if (!element) continue;
    if (ELEMENT_GENERATES[element] === dayMaster) keys.add(`${element} sinh ${dayMaster}`);
    if (ELEMENT_CONTROLS[element] === dayMaster) keys.add(`${element} khắc ${dayMaster}`);
    if (ELEMENT_GENERATES[dayMaster] === element) keys.add(`${dayMaster} sinh ${element}`);
    if (ELEMENT_CONTROLS[dayMaster] === element) keys.add(`${dayMaster} khắc ${element}`);
  }

  return [...keys];
}

type ChartSignals = {
  stems: string[];
  branches: string[];
  pillars: string[];
  hiddenStems: string[];
  elements: string[];
  tenGods: string[];
  relations: string[];
  dayMaster?: string;
  chartFlags: string[];
  queryKeys: string[];
};

function buildChartSignals(chart: ChartLike): ChartSignals {
  const pillars = chart.pillars ? (Object.values(chart.pillars).filter(Boolean) as PillarLike[]) : [];
  const stems = pillars.map((pillar) => pillar.stem).filter(Boolean) as string[];
  const branches = pillars.map((pillar) => pillar.branch).filter(Boolean) as string[];
  const pillarNames = pillars.map((pillar) => pillar.pillar).filter(Boolean) as string[];
  const hiddenStems = pillars.flatMap((pillar) => pillar.hiddenStems ?? []);
  const tenGodsFromPillars = pillars.map((pillar) => pillar.tenGod).filter(Boolean) as string[];
  const tenGodsFromSummary = chart.summary?.tenGods ?? [];
  const tenGods = [...new Set([...tenGodsFromPillars, ...tenGodsFromSummary])];

  const elementFromPillars = pillars.map((pillar) => pillar.element).filter(Boolean) as string[];
  const elementFromBalance = Object.entries(chart.summary?.elementBalance ?? {})
    .filter(([, count]) => count > 0)
    .map(([element]) => element);
  const elements = [...new Set([...elementFromPillars, ...elementFromBalance])];

  const dayMaster = chart.summary?.dayMaster;
  const dayMasterElement = parseDayMasterElement(dayMaster);
  const dayMasterRelations = buildDayMasterRelationKeys(dayMasterElement, elements);
  const branchRelations = buildBranchRelations(branches);

  const chartFlags = new Set<string>([
    "has-core-four-pillars",
    "has-element-balance",
    "has-hidden-stems",
    "has-ten-gods",
    "has-cycles-section"
  ]);

  if ((chart.meta?.calculationMode ?? "").includes("solar")) chartFlags.add("uses-solar-calendar");
  if (dayMasterElement) chartFlags.add("has-day-master-relations");
  if (dayMasterElement === "Thủy") chartFlags.add("day-master-thuy");

  if (hiddenStems.length >= 8) chartFlags.add("has-rich-hidden-stems");
  if (branchRelations.length > 0) chartFlags.add("has-branch-relations");

  const counts = Object.values(chart.summary?.elementBalance ?? {});
  if (counts.length > 0) {
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    if (max > min) {
      chartFlags.add("has-prominent-elements");
      chartFlags.add("has-low-elements");
    }
  }

  if (dayMasterElement) {
    const support = elements.some((element) => ELEMENT_GENERATES[element] === dayMasterElement || element === dayMasterElement);
    const pressure = elements.some((element) => ELEMENT_CONTROLS[element] === dayMasterElement || ELEMENT_GENERATES[dayMasterElement] === element);
    if (support) chartFlags.add("has-supporting-elements");
    if (pressure) chartFlags.add("has-pressure-elements");
  }

  const birthDate = chart.input?.birthDate;
  if (birthDate && /^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    const month = Number(birthDate.slice(5, 7));
    const day = Number(birthDate.slice(8, 10));
    if (month < 2 || (month === 2 && day < 4)) chartFlags.add("lap-xuan-year-boundary");
  }

  const queryKeys = new Set<string>([
    "topic:can-chi",
    "topic:ngu-hanh",
    "topic:tang-can",
    "topic:thap-than"
  ]);

  stems.forEach((stem) => queryKeys.add(`stem:${normalize(stem)}`));
  branches.forEach((branch) => queryKeys.add(`branch:${normalize(branch)}`));
  pillarNames.forEach((pillar) => queryKeys.add(`pillar:${normalize(pillar)}`));
  hiddenStems.forEach((hiddenStem) => queryKeys.add(`hidden-stem:${normalize(hiddenStem)}`));
  elements.forEach((element) => queryKeys.add(`element:${normalize(element)}`));
  tenGods.forEach((tenGod) => queryKeys.add(`ten-god:${normalize(tenGod)}`));
  dayMasterRelations.forEach((relation) => queryKeys.add(`relation:${normalize(relation)}`));
  branchRelations.forEach((relation) => queryKeys.add(`relation:${normalize(relation)}`));
  [...chartFlags].forEach((flag) => queryKeys.add(`flag:${normalize(flag)}`));
  if (dayMaster) queryKeys.add(`day-master:${normalize(dayMaster)}`);

  return {
    stems,
    branches,
    pillars: pillarNames,
    hiddenStems,
    elements,
    tenGods,
    relations: [...dayMasterRelations, ...branchRelations],
    dayMaster,
    chartFlags: [...chartFlags],
    queryKeys: [...queryKeys]
  };
}

function cardScore(card: KnowledgeCard, signals: ChartSignals): { score: number; reason: string; matchedSignals: string[] } {
  let score = 0;
  const matchedSignals: string[] = [];
  const reasons: string[] = [];

  const addMatch = (condition: boolean, points: number, reason: string, signal: string) => {
    if (!condition) return;
    score += points;
    reasons.push(reason);
    matchedSignals.push(signal);
  };

  addMatch(Boolean(card.whenUse.dayMasters?.some((item) => item === signals.dayMaster)), 30, "trùng Nhật chủ", "dayMaster");
  addMatch(Boolean(card.whenUse.branches?.some((item) => signals.branches.includes(item))), 20, "trùng Địa Chi", "branches");
  addMatch(Boolean(card.whenUse.stems?.some((item) => signals.stems.includes(item))), 18, "trùng Thiên Can", "stems");
  addMatch(Boolean(card.whenUse.hiddenStems?.some((item) => signals.hiddenStems.includes(item))), 16, "trùng Tàng can", "hiddenStems");
  addMatch(Boolean(card.whenUse.relations?.some((item) => signals.relations.includes(item))), 25, "trùng quan hệ ngũ hành/chi", "relations");
  addMatch(Boolean(card.whenUse.tenGods?.some((item) => signals.tenGods.includes(item))), 20, "trùng Thập thần", "tenGods");
  addMatch(Boolean(card.whenUse.pillars?.some((item) => signals.pillars.includes(item))), 18, "trùng trụ Can Chi", "pillars");
  addMatch(Boolean(card.whenUse.elements?.some((item) => signals.elements.includes(item))), 12, "trùng Ngũ hành", "elements");
  addMatch(Boolean(card.whenUse.chartFlags?.some((item) => signals.chartFlags.includes(item))), 14, "trùng cờ ngữ cảnh", "chartFlags");

  if (card.status === "core") score += 10;
  if (card.status === "reference") score += 6;
  if (card.status === "candidate") score += 2;
  if (card.status === "needs_review") score += 1;

  if (card.sourceLevel === "core_rule") score += 10;
  if (card.sourceLevel === "reference") score += 5;
  if (card.sourceLevel === "candidate") score += 1;

  score += card.priority;

  if ((card.status === "candidate" || card.status === "needs_review") && score > 0) {
    score = Math.floor(score * 0.88);
  }

  for (const tag of card.tags) {
    const normalizedTag = normalize(tag);
    if (signals.queryKeys.some((key) => key.endsWith(normalizedTag))) {
      score += 2;
    }
  }

  return {
    score,
    reason: reasons[0] ?? "liên quan đến bản đồ Tứ Trụ",
    matchedSignals
  };
}

export function buildKnowledgeQueryKeys(chart: ChartLike): string[] {
  return buildChartSignals(chart).queryKeys;
}

export function matchKnowledgeForChart(chart: ChartLike, cards: KnowledgeCard[] = runtimeKnowledgeCards) {
  const signals = buildChartSignals(chart);
  const matchedCards = cards
    .map((card) => ({ ...card, ...cardScore(card, signals) }))
    .filter((card) => card.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    queryKeys: signals.queryKeys,
    matchedCards,
    priorityCards: matchedCards.slice(0, 8),
    chartRelations: signals.relations,
    chartFlags: signals.chartFlags
  };
}
