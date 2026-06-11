import type { Pillar } from "./types";
import { getBranchByIndex, getHiddenStemsForBranch, getStemByIndex, normalizeModulo } from "./coreTables";

export {
  BRANCHES,
  CONTROLS,
  CORE_TABLE_VERSION,
  ELEMENTS,
  GENERATES,
  HIDDEN_STEMS_BY_BRANCH_HAN,
  STEMS,
  TEN_GOD_NOTES,
  TEN_GOD_ORDER,
  TWELVE_GROWTH_BRANCHES_BY_STEM_HAN,
  TWELVE_GROWTH_STAGE_ORDER,
  TWELVE_GROWTH_STAGES_BY_STEM_HAN,
  deriveTenGod,
  findBranchByHan,
  findBranchByName,
  findStemByHan,
  findStemByName,
  getBranchByIndex,
  getHiddenStemsForBranch,
  getStemByIndex,
  getTwelveGrowthStage,
  normalizeModulo,
  resolveElementRelation
} from "./coreTables";

export type {
  BranchDefinition,
  ElementDefinition,
  ElementName,
  ElementRelation,
  HiddenStemDefinition,
  HiddenStemQi,
  Polarity,
  PolarityLabel,
  StemDefinition,
  TenGodName,
  TwelveGrowthStage
} from "./coreTables";

export const ENGINE_VERSION = "0.3.0";
export const RULE_SET_VERSION = "core-v0.4";
export const CALCULATION_MODE = "solar-lunar/solar-term/timezone/zi-hour/major-luck";

export function getStem(index: number) {
  return getStemByIndex(index);
}

export function getBranch(index: number) {
  return getBranchByIndex(index);
}

export function createPillar(label: string, stemIndex: number, branchIndex: number): Pillar {
  const stem = getStem(stemIndex);
  const branch = getBranch(branchIndex);

  return {
    label,
    stem: stem.name,
    stemHan: stem.han,
    stemIndex: stem.index,
    stemElement: stem.element,
    stemPolarity: stem.polarityLabel,
    branch: branch.name,
    branchHan: branch.han,
    branchIndex: branch.index,
    branchElement: branch.element,
    branchPolarity: branch.polarityLabel,
    hiddenStems: getHiddenStemsForBranch(branch.han),
    pillar: `${stem.name} ${branch.name}`,
    pillarHan: `${stem.han}${branch.han}`,
    element: stem.element
  };
}

export function getMonthStemStartIndex(yearStemIndex: number) {
  const normalized = normalizeModulo(yearStemIndex, 10);

  if (normalized === 0 || normalized === 5) return 2;
  if (normalized === 1 || normalized === 6) return 4;
  if (normalized === 2 || normalized === 7) return 6;
  if (normalized === 3 || normalized === 8) return 8;
  return 0;
}

export function getHourStemStartIndex(dayStemIndex: number) {
  const normalized = normalizeModulo(dayStemIndex, 10);

  if (normalized === 0 || normalized === 5) return 0;
  if (normalized === 1 || normalized === 6) return 2;
  if (normalized === 2 || normalized === 7) return 4;
  if (normalized === 3 || normalized === 8) return 6;
  return 8;
}
