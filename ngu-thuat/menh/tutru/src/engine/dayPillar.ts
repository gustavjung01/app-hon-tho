import { createPillar, normalizeModulo } from "./stemsBranches";
import type { ParsedBirthDateTime, Pillar } from "./types";

const DAY_CYCLE_OFFSET = 48;

function gregorianToJulianDayNumber(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const adjustedYear = year + 4800 - a;
  const adjustedMonth = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * adjustedMonth + 2) / 5) +
    365 * adjustedYear +
    Math.floor(adjustedYear / 4) -
    Math.floor(adjustedYear / 100) +
    Math.floor(adjustedYear / 400) -
    32045
  );
}

export function deriveDayPillar(parsed: ParsedBirthDateTime): { pillar: Pillar; stemIndex: number; branchIndex: number; julianDayNumber: number } {
  const julianDayNumber = gregorianToJulianDayNumber(parsed.year, parsed.month, parsed.day);
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

