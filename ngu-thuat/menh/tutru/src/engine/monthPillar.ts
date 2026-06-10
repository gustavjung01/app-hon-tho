import { createPillar, getMonthStemStartIndex } from "./stemsBranches";
import type { ParsedBirthDateTime, Pillar } from "./types";

type SolarBoundary = {
  month: number;
  day: number;
  branchIndex: number;
};

// Minimal month-branch segmentation by the 12 major jie boundaries.
// Dates are approximate and only intended for the phase-1 runtime engine.
const SOLAR_MONTH_BOUNDARIES: SolarBoundary[] = [
  { month: 1, day: 6, branchIndex: 1 },  // Xiao Han -> Suu
  { month: 2, day: 4, branchIndex: 2 },  // Lap Xuan -> Dan
  { month: 3, day: 6, branchIndex: 3 },  // Kinh Trap -> Mao
  { month: 4, day: 5, branchIndex: 4 },  // Thanh Minh -> Thin
  { month: 5, day: 6, branchIndex: 5 },  // Lap Ha -> Ty
  { month: 6, day: 6, branchIndex: 6 },  // Mang Chung -> Ngo
  { month: 7, day: 7, branchIndex: 7 },  // Tieu Thu -> Mui
  { month: 8, day: 8, branchIndex: 8 },  // Lap Thu -> Than
  { month: 9, day: 8, branchIndex: 9 },  // Bach Lo -> Dau
  { month: 10, day: 8, branchIndex: 10 }, // Han Lo -> Tuat
  { month: 11, day: 7, branchIndex: 11 }, // Lap Dong -> Hoi
  { month: 12, day: 7, branchIndex: 0 }  // Dai Tuyet -> Ty
];

const MONTH_BRANCH_SEQUENCE_FROM_DAN = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function toMonthDayKey(month: number, day: number) {
  return month * 100 + day;
}

function resolveMonthBranchIndex(parsed: ParsedBirthDateTime) {
  const currentKey = toMonthDayKey(parsed.month, parsed.day);

  for (let index = SOLAR_MONTH_BOUNDARIES.length - 1; index >= 0; index -= 1) {
    const boundary = SOLAR_MONTH_BOUNDARIES[index];
    if (currentKey >= toMonthDayKey(boundary.month, boundary.day)) {
      return boundary.branchIndex;
    }
  }

  return 0;
}

function getMonthOffsetFromDan(branchIndex: number) {
  const offset = MONTH_BRANCH_SEQUENCE_FROM_DAN.indexOf(branchIndex);
  if (offset === -1) {
    throw new Error(`Unsupported month branch index: ${branchIndex}`);
  }

  return offset;
}

export function deriveMonthPillar(parsed: ParsedBirthDateTime, yearStemIndex: number): { pillar: Pillar; stemIndex: number; branchIndex: number } {
  const branchIndex = resolveMonthBranchIndex(parsed);
  const offsetFromDan = getMonthOffsetFromDan(branchIndex);
  const monthStemStart = getMonthStemStartIndex(yearStemIndex);
  const stemIndex = (monthStemStart + offsetFromDan) % 10;

  return {
    pillar: createPillar("Tháng", stemIndex, branchIndex),
    stemIndex,
    branchIndex
  };
}

