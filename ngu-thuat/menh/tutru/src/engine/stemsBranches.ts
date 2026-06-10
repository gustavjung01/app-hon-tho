import type { Pillar } from "./types";

export interface StemDefinition {
  index: number;
  name: string;
  han: string;
  element: string;
}

export interface BranchDefinition {
  index: number;
  name: string;
  han: string;
  element: string;
}

export const STEMS: StemDefinition[] = [
  { index: 0, name: "Giáp", han: "甲", element: "Mộc" },
  { index: 1, name: "Ất", han: "乙", element: "Mộc" },
  { index: 2, name: "Bính", han: "丙", element: "Hỏa" },
  { index: 3, name: "Đinh", han: "丁", element: "Hỏa" },
  { index: 4, name: "Mậu", han: "戊", element: "Thổ" },
  { index: 5, name: "Kỷ", han: "己", element: "Thổ" },
  { index: 6, name: "Canh", han: "庚", element: "Kim" },
  { index: 7, name: "Tân", han: "辛", element: "Kim" },
  { index: 8, name: "Nhâm", han: "壬", element: "Thủy" },
  { index: 9, name: "Quý", han: "癸", element: "Thủy" }
];

export const BRANCHES: BranchDefinition[] = [
  { index: 0, name: "Tý", han: "子", element: "Thủy" },
  { index: 1, name: "Sửu", han: "丑", element: "Thổ" },
  { index: 2, name: "Dần", han: "寅", element: "Mộc" },
  { index: 3, name: "Mão", han: "卯", element: "Mộc" },
  { index: 4, name: "Thìn", han: "辰", element: "Thổ" },
  { index: 5, name: "Tỵ", han: "巳", element: "Hỏa" },
  { index: 6, name: "Ngọ", han: "午", element: "Hỏa" },
  { index: 7, name: "Mùi", han: "未", element: "Thổ" },
  { index: 8, name: "Thân", han: "申", element: "Kim" },
  { index: 9, name: "Dậu", han: "酉", element: "Kim" },
  { index: 10, name: "Tuất", han: "戌", element: "Thổ" },
  { index: 11, name: "Hợi", han: "亥", element: "Thủy" }
];

export const ENGINE_VERSION = "0.1.0";
export const RULE_SET_VERSION = "core-v0.1";
export const CALCULATION_MODE = "solar/timezone";

export function normalizeModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function getStem(index: number) {
  return STEMS[normalizeModulo(index, STEMS.length)];
}

export function getBranch(index: number) {
  return BRANCHES[normalizeModulo(index, BRANCHES.length)];
}

export function createPillar(label: string, stemIndex: number, branchIndex: number): Pillar {
  const stem = getStem(stemIndex);
  const branch = getBranch(branchIndex);

  return {
    label,
    stem: stem.name,
    stemHan: stem.han,
    branch: branch.name,
    branchHan: branch.han,
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
