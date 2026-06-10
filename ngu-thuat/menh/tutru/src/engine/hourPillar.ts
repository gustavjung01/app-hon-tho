import { createPillar, getHourStemStartIndex } from "./stemsBranches";
import type { ParsedBirthDateTime, Pillar } from "./types";

function resolveHourBranchIndex(parsed: ParsedBirthDateTime) {
  const totalMinutes = parsed.hour * 60 + parsed.minute;

  if (totalMinutes >= 23 * 60 || totalMinutes < 60) {
    return 0;
  }

  return Math.floor((parsed.hour + 1) / 2);
}

export function deriveHourPillar(parsed: ParsedBirthDateTime, dayStemIndex: number): { pillar: Pillar; stemIndex: number; branchIndex: number } {
  const branchIndex = resolveHourBranchIndex(parsed);
  const stemStart = getHourStemStartIndex(dayStemIndex);
  const stemIndex = (stemStart + branchIndex) % 10;

  return {
    pillar: createPillar("Giờ", stemIndex, branchIndex),
    stemIndex,
    branchIndex
  };
}

