import type { PlainDate } from "./calendarMath";

type DateTimePart = "year" | "month" | "day" | "hour" | "minute" | "second";

function readZonedParts(date: Date, timezone: string): Record<DateTimePart, number> {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    calendar: "gregory",
    numberingSystem: "latn",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const values = formatter.formatToParts(date).reduce<Partial<Record<DateTimePart, number>>>((acc, part) => {
    if (["year", "month", "day", "hour", "minute", "second"].includes(part.type)) {
      acc[part.type as DateTimePart] = Number(part.value);
    }
    return acc;
  }, {});

  const required: DateTimePart[] = ["year", "month", "day", "hour", "minute", "second"];
  for (const key of required) {
    if (typeof values[key] !== "number" || Number.isNaN(values[key])) {
      throw new Error(`Không đọc được thành phần thời gian ${key} cho múi giờ ${timezone}.`);
    }
  }

  return values as Record<DateTimePart, number>;
}

export function assertSupportedTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    throw new Error("Múi giờ không hợp lệ cho engine hiện tại.");
  }
}

export function getTimezoneOffsetMinutes(dateUtc: Date, timezone: string) {
  const parts = readZonedParts(dateUtc, timezone);
  const zonedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((zonedAsUtc - dateUtc.getTime()) / 60000);
}

export function getTimezoneOffsetHours(dateUtc: Date, timezone: string) {
  return getTimezoneOffsetMinutes(dateUtc, timezone) / 60;
}

export function zonedDateTimeToUtc(date: PlainDate, hour: number, minute: number, timezone: string) {
  const localAsUtc = Date.UTC(date.year, date.month - 1, date.day, hour, minute, 0, 0);
  let utcMs = localAsUtc;

  for (let index = 0; index < 4; index += 1) {
    const offsetMs = getTimezoneOffsetMinutes(new Date(utcMs), timezone) * 60000;
    const nextUtcMs = localAsUtc - offsetMs;
    if (Math.abs(nextUtcMs - utcMs) < 1) break;
    utcMs = nextUtcMs;
  }

  return new Date(utcMs);
}

export function getNominalTimezoneOffsetHours(year: number, timezone: string) {
  const probe = new Date(Date.UTC(year, 6, 1, 12, 0, 0, 0));
  return getTimezoneOffsetHours(probe, timezone);
}
