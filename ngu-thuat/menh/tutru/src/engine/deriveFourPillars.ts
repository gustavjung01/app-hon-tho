import { addDaysToPlainDate, assertEngineYearRange, assertValidGregorianDate, formatPlainDate, type PlainDate } from "./calendarMath";
import { convertLunarToSolarDate } from "./lunarCalendar";
import { CALCULATION_MODE, deriveTenGod, ENGINE_VERSION, getStemByIndex, getTwelveGrowthStage, RULE_SET_VERSION } from "./stemsBranches";
import { assertSupportedTimezone, getNominalTimezoneOffsetHours, getTimezoneOffsetHours, zonedDateTimeToUtc } from "./timezone";
import { deriveDayPillar } from "./dayPillar";
import { deriveHourPillar } from "./hourPillar";
import { deriveMajorLuckCycles } from "./luckCycles";
import { deriveMonthPillar } from "./monthPillar";
import type { DayBoundaryMode, DeriveFourPillarsInput, DeriveFourPillarsOutput, ParsedBirthDateTime, Pillar } from "./types";
import { deriveYearPillar } from "./yearPillar";

function parseDateText(value: string): PlainDate {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!dateMatch) {
    throw new Error("Ngày sinh phải theo định dạng YYYY-MM-DD.");
  }

  return {
    year: Number(dateMatch[1]),
    month: Number(dateMatch[2]),
    day: Number(dateMatch[3])
  };
}

function parseBirthTime(value: string) {
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(value);

  if (!timeMatch) {
    throw new Error("Giờ sinh phải theo định dạng HH:mm.");
  }

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("Giờ sinh không hợp lệ.");
  }

  return { hour, minute };
}

function resolveSolarDate(input: DeriveFourPillarsInput, sourceDate: PlainDate, timezone: string) {
  assertEngineYearRange(sourceDate.year);

  if (input.calendarType === "solar") {
    assertValidGregorianDate(sourceDate.year, sourceDate.month, sourceDate.day);
    return sourceDate;
  }

  const nominalOffsetHours = getNominalTimezoneOffsetHours(sourceDate.year, timezone);
  const solarDate = convertLunarToSolarDate(sourceDate.year, sourceDate.month, sourceDate.day, Boolean(input.isLeapMonth), nominalOffsetHours);
  assertValidGregorianDate(solarDate.year, solarDate.month, solarDate.day);
  return solarDate;
}

function resolveDayBoundaryMode(input: DeriveFourPillarsInput): DayBoundaryMode {
  return input.dayBoundaryMode ?? "zi-hour-rollover";
}

function parseBirthDateTime(input: DeriveFourPillarsInput): ParsedBirthDateTime {
  assertSupportedTimezone(input.timezone);

  const sourceDate = parseDateText(input.birthDate);
  const { hour, minute } = parseBirthTime(input.birthTime);
  const solarDate = resolveSolarDate(input, sourceDate, input.timezone);
  const birthInstantUtc = zonedDateTimeToUtc(solarDate, hour, minute, input.timezone);
  const timezoneOffsetHours = getTimezoneOffsetHours(birthInstantUtc, input.timezone);
  const isLateZiHour = hour === 23;
  const dayBoundaryMode = resolveDayBoundaryMode(input);
  const dayPillarDate = dayBoundaryMode === "zi-hour-rollover" && isLateZiHour ? addDaysToPlainDate(solarDate, 1) : solarDate;

  return {
    year: solarDate.year,
    month: solarDate.month,
    day: solarDate.day,
    hour,
    minute,
    timezone: input.timezone,
    sourceCalendarType: input.calendarType,
    sourceDate,
    solarDate,
    dayPillarDate,
    birthInstantUtc,
    timezoneOffsetHours,
    isLeapMonth: Boolean(input.isLeapMonth),
    isLateZiHour,
    dayBoundaryMode
  };
}

function annotatePillar(pillar: Pillar, dayStemIndex: number): Pillar {
  const dayStem = getStemByIndex(dayStemIndex);
  const targetStem = getStemByIndex(pillar.stemIndex);
  const growthStage = getTwelveGrowthStage(dayStem.han, pillar.branchHan);

  return {
    ...pillar,
    tenGod: pillar.label === "Ngày" ? "Nhật chủ" : deriveTenGod(dayStem, targetStem),
    twelveGrowthStage: growthStage?.name
  };
}

function annotatePillars(pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar }, dayStemIndex: number) {
  return {
    year: annotatePillar(pillars.year, dayStemIndex),
    month: annotatePillar(pillars.month, dayStemIndex),
    day: annotatePillar(pillars.day, dayStemIndex),
    hour: annotatePillar(pillars.hour, dayStemIndex)
  };
}

export function deriveFourPillars(input: DeriveFourPillarsInput): DeriveFourPillarsOutput {
  const parsed = parseBirthDateTime(input);
  const year = deriveYearPillar(parsed);
  const month = deriveMonthPillar(parsed, year.stemIndex);
  const day = deriveDayPillar(parsed);
  const hour = deriveHourPillar(parsed, day.stemIndex);
  const pillars = annotatePillars(
    {
      year: year.pillar,
      month: month.pillar,
      day: day.pillar,
      hour: hour.pillar
    },
    day.stemIndex
  );
  const majorLuck = deriveMajorLuckCycles({
    input,
    parsed,
    yearPillar: pillars.year,
    monthPillar: pillars.month
  });

  return {
    input,
    pillars,
    summary: {
      dayMaster: day.pillar.stem
    },
    majorLuck,
    meta: {
      engineVersion: ENGINE_VERSION,
      ruleSetVersion: RULE_SET_VERSION,
      calculationMode: CALCULATION_MODE,
      normalizedSolarDate: formatPlainDate(parsed.solarDate),
      dayPillarDate: formatPlainDate(parsed.dayPillarDate),
      isLateZiHour: parsed.isLateZiHour,
      monthSolarTerm: `${month.solarTerm.name} (${month.solarTerm.han})`,
      monthSolarTermUtc: month.solarTerm.isoUtc,
      lunarConverted: input.calendarType === "lunar"
    }
  };
}
