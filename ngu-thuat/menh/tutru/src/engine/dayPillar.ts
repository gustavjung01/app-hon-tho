import { gregorianToJulianDayNumber } from "./calendarMath";
import { createPillar, normalizeModulo } from "./stemsBranches";
import type { ParsedBirthDateTime, Pillar } from "./types";

const DAY_CYCLE_OFFSET = 48;

export function deriveDayPillar(parsed: ParsedBirthDateTime): { pillar: Pillar; stemIndex: number; branchIndex: number; julianDayNumber: number } {
  const date = parsed.dayPillarDate;
  const julianDayNumber = gregorianToJulianDayNumber(date.year, date.month, date.day);
  const cycleIndex = normalizeModulo(julianDayNumber + DAY_CYCLE_OFFSET, 60);
  const stemIndex = cycleIndex % 10;
  const branchIndex = cycleIndex % 12;

  return {
    pillar: createPillar("Ngày", stemIndex, branchIndex),
    stemIndex,
    branchIndex,
    julianDayNumber
  };
}
