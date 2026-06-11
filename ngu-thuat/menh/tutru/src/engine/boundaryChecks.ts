import { deriveFourPillars } from "./deriveFourPillars";
import type { DeriveFourPillarsInput } from "./types";

export interface BoundaryCheckCase {
  id: string;
  input: DeriveFourPillarsInput;
  expect: {
    yearPillarHan?: string;
    monthBranchHan?: string;
    normalizedSolarDate?: string;
    dayShouldDifferFromCase?: string;
  };
}

export const BOUNDARY_CHECK_CASES: BoundaryCheckCase[] = [
  {
    id: "before-li-chun-2024-vn",
    input: {
      birthDate: "2024-02-04",
      birthTime: "00:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expect: {
      yearPillarHan: "癸卯",
      monthBranchHan: "丑"
    }
  },
  {
    id: "after-li-chun-2024-vn",
    input: {
      birthDate: "2024-02-05",
      birthTime: "00:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expect: {
      yearPillarHan: "甲辰",
      monthBranchHan: "寅"
    }
  },
  {
    id: "late-zi-before-boundary",
    input: {
      birthDate: "1990-10-12",
      birthTime: "22:59",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expect: {}
  },
  {
    id: "late-zi-after-boundary",
    input: {
      birthDate: "1990-10-12",
      birthTime: "23:00",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expect: {
      dayShouldDifferFromCase: "late-zi-before-boundary"
    }
  },
  {
    id: "lunar-new-year-2024-vn",
    input: {
      birthDate: "2024-01-01",
      birthTime: "08:00",
      calendarType: "lunar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expect: {
      normalizedSolarDate: "2024-02-10"
    }
  }
];

export function runBoundarySelfChecks() {
  const results = new Map<string, ReturnType<typeof deriveFourPillars>>();
  const failures: string[] = [];

  for (const testCase of BOUNDARY_CHECK_CASES) {
    const result = deriveFourPillars(testCase.input);
    results.set(testCase.id, result);

    if (testCase.expect.yearPillarHan && result.pillars.year.pillarHan !== testCase.expect.yearPillarHan) {
      failures.push(`${testCase.id}: expected year ${testCase.expect.yearPillarHan}, got ${result.pillars.year.pillarHan}`);
    }

    if (testCase.expect.monthBranchHan && result.pillars.month.branchHan !== testCase.expect.monthBranchHan) {
      failures.push(`${testCase.id}: expected month branch ${testCase.expect.monthBranchHan}, got ${result.pillars.month.branchHan}`);
    }

    if (testCase.expect.normalizedSolarDate && result.meta.normalizedSolarDate !== testCase.expect.normalizedSolarDate) {
      failures.push(`${testCase.id}: expected solar date ${testCase.expect.normalizedSolarDate}, got ${result.meta.normalizedSolarDate ?? "none"}`);
    }

    if (testCase.expect.dayShouldDifferFromCase) {
      const reference = results.get(testCase.expect.dayShouldDifferFromCase);
      if (reference && reference.pillars.day.pillarHan === result.pillars.day.pillarHan) {
        failures.push(`${testCase.id}: expected day pillar to differ from ${testCase.expect.dayShouldDifferFromCase}`);
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures
  };
}
