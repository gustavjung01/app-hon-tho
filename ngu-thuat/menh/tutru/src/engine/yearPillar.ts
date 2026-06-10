import { createPillar } from "./stemsBranches";
import type { ParsedBirthDateTime, Pillar } from "./types";

const APPROX_LICHUN_MONTH = 2;
const APPROX_LICHUN_DAY = 4;

function isOnOrAfterApproxLichun(parsed: ParsedBirthDateTime) {
  if (parsed.month > APPROX_LICHUN_MONTH) return true;
  if (parsed.month < APPROX_LICHUN_MONTH) return false;
  return parsed.day >= APPROX_LICHUN_DAY;
}

export function resolveGregorianYearForYearPillar(parsed: ParsedBirthDateTime) {
  return isOnOrAfterApproxLichun(parsed) ? parsed.year : parsed.year - 1;
}

export function deriveYearPillar(parsed: ParsedBirthDateTime): { pillar: Pillar; stemIndex: number; branchIndex: number; resolvedYear: number } {
  const resolvedYear = resolveGregorianYearForYearPillar(parsed);
  const stemIndex = (resolvedYear - 4) % 10;
  const branchIndex = (resolvedYear - 4) % 12;

  return {
    pillar: createPillar("Năm", stemIndex, branchIndex),
    stemIndex,
    branchIndex,
    resolvedYear
  };
}

