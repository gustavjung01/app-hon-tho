import { createPillar, getMonthStemStartIndex } from "./stemsBranches";
import { resolveActiveJieSolarTerm } from "./solarTerms";
import type { MonthPillarDerivation, ParsedBirthDateTime } from "./types";

const MONTH_BRANCH_SEQUENCE_FROM_DAN = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function getMonthOffsetFromDan(branchIndex: number) {
  const offset = MONTH_BRANCH_SEQUENCE_FROM_DAN.indexOf(branchIndex);
  if (offset === -1) {
    throw new Error(`Unsupported month branch index: ${branchIndex}`);
  }

  return offset;
}

export function deriveMonthPillar(parsed: ParsedBirthDateTime, yearStemIndex: number): MonthPillarDerivation {
  const solarTerm = resolveActiveJieSolarTerm(parsed.birthInstantUtc);
  const branchIndex = solarTerm.branchIndex;
  const offsetFromDan = getMonthOffsetFromDan(branchIndex);
  const monthStemStart = getMonthStemStartIndex(yearStemIndex);
  const stemIndex = (monthStemStart + offsetFromDan) % 10;

  return {
    pillar: createPillar("Tháng", stemIndex, branchIndex),
    stemIndex,
    branchIndex,
    solarTerm
  };
}
