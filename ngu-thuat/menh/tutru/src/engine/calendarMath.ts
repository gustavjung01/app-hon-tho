export interface PlainDate {
  year: number;
  month: number;
  day: number;
}

export const MIN_ENGINE_YEAR = 1600;
export const MAX_ENGINE_YEAR = 2200;

export function gregorianToJulianDayNumber(year: number, month: number, day: number) {
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

export function julianDayNumberToGregorian(julianDayNumber: number): PlainDate {
  const a = julianDayNumber + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10)
  };
}

export function assertEngineYearRange(year: number) {
  if (year < MIN_ENGINE_YEAR || year > MAX_ENGINE_YEAR) {
    throw new Error(`Năm sinh hiện hỗ trợ trong khoảng ${MIN_ENGINE_YEAR}-${MAX_ENGINE_YEAR}.`);
  }
}

export function assertValidGregorianDate(year: number, month: number, day: number) {
  assertEngineYearRange(year);

  const candidate = new Date(Date.UTC(year, month - 1, day));
  const isSameDate =
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day;

  if (!isSameDate) {
    throw new Error("Ngày sinh không tồn tại trong lịch dương.");
  }
}

export function addDaysToPlainDate(date: PlainDate, days: number): PlainDate {
  const candidate = new Date(Date.UTC(date.year, date.month - 1, date.day + days));

  return {
    year: candidate.getUTCFullYear(),
    month: candidate.getUTCMonth() + 1,
    day: candidate.getUTCDate()
  };
}

export function formatPlainDate(date: PlainDate) {
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return `${date.year}-${month}-${day}`;
}

export function toJulianDayFromUtcMs(utcMs: number) {
  return utcMs / 86400000 + 2440587.5;
}
