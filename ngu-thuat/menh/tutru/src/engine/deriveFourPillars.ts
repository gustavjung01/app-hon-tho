import { CALCULATION_MODE, ENGINE_VERSION, RULE_SET_VERSION } from "./stemsBranches";
import { deriveDayPillar } from "./dayPillar";
import { deriveHourPillar } from "./hourPillar";
import { deriveMonthPillar } from "./monthPillar";
import type { DeriveFourPillarsInput, DeriveFourPillarsOutput, ParsedBirthDateTime } from "./types";
import { deriveYearPillar } from "./yearPillar";

function assertSupportedTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    throw new Error("Múi giờ không hợp lệ cho engine tối thiểu.");
  }
}

function parseBirthDateTime(input: DeriveFourPillarsInput): ParsedBirthDateTime {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(input.birthTime);

  if (!dateMatch) {
    throw new Error("Ngày sinh phải theo định dạng YYYY-MM-DD.");
  }

  if (!timeMatch) {
    throw new Error("Giờ sinh phải theo định dạng HH:mm.");
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (month < 1 || month > 12) {
    throw new Error("Tháng sinh không hợp lệ.");
  }

  if (day < 1 || day > 31) {
    throw new Error("Ngày sinh không hợp lệ.");
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("Giờ sinh không hợp lệ.");
  }

  return { year, month, day, hour, minute };
}

export function deriveFourPillars(input: DeriveFourPillarsInput): DeriveFourPillarsOutput {
  if (input.calendarType === "lunar") {
    throw new Error("Âm lịch sẽ được hỗ trợ ở phiên bản sau.");
  }

  assertSupportedTimezone(input.timezone);

  const parsed = parseBirthDateTime(input);
  const year = deriveYearPillar(parsed);
  const month = deriveMonthPillar(parsed, year.stemIndex);
  const day = deriveDayPillar(parsed);
  const hour = deriveHourPillar(parsed, day.stemIndex);

  return {
    input,
    pillars: {
      year: year.pillar,
      month: month.pillar,
      day: day.pillar,
      hour: hour.pillar
    },
    summary: {
      dayMaster: day.pillar.stem
    },
    meta: {
      engineVersion: ENGINE_VERSION,
      ruleSetVersion: RULE_SET_VERSION,
      calculationMode: CALCULATION_MODE
    }
  };
}

