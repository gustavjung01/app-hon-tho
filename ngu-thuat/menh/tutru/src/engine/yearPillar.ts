import { createPillar } from "./stemsBranches";
import { getLiChunBoundary } from "./solarTerms";
import type { ParsedBirthDateTime, Pillar } from "./types";

function isOnOrAfterLiChun(parsed: ParsedBirthDateTime) {
  const liChun = getLiChunBoundary(parsed.year);
  return parsed.birthInstantUtc.getTime() >= liChun.utcMs;
}

export function resolveGregorianYearForYearPillar(parsed: ParsedBirthDateTime) {
  return isOnOrAfterLiChun(parsed) ? parsed.year : parsed.year - 1;
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
