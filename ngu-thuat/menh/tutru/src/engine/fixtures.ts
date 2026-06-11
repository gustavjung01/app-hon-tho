import { deriveFourPillars } from "./deriveFourPillars";
import type { DeriveFourPillarsInput } from "./types";

export interface EngineFixture {
  name: string;
  group: "baseline" | "li-chun" | "solar-term" | "zi-hour" | "hoi-hour" | "lunar";
  note: string;
  input: DeriveFourPillarsInput;
  expected: {
    year: string;
    month: string;
    day: string;
    hour: string;
    normalizedSolarDate?: string;
    dayPillarDate?: string;
    isLateZiHour?: boolean;
    monthSolarTerm?: string;
    lunarConverted?: boolean;
  };
}

export interface EngineFixtureCheckResult {
  name: string;
  group: EngineFixture["group"];
  passed: boolean;
  failures: string[];
  expected: EngineFixture["expected"];
  actual: EngineFixture["expected"];
}

function getSolarTermName(value?: string) {
  return value?.replace(/\s*\(.+\)$/, "");
}

function collectFailures(fixture: EngineFixture, actual: EngineFixture["expected"]) {
  const failures: string[] = [];
  const expectedEntries = Object.entries(fixture.expected) as Array<[keyof EngineFixture["expected"], string | boolean | undefined]>;

  expectedEntries.forEach(([key, expectedValue]) => {
    if (actual[key] !== expectedValue) {
      failures.push(`${String(key)} expected ${String(expectedValue)} but got ${String(actual[key])}`);
    }
  });

  return failures;
}

export const engineFixtures: EngineFixture[] = [
  {
    name: "Baseline 1985-01-24 14:00 Asia/Ho_Chi_Minh",
    group: "baseline",
    note: "Case gốc giữ lại để chống hồi quy khi đổi bảng Can Chi hoặc offset trụ ngày.",
    input: {
      birthDate: "1985-01-24",
      birthTime: "14:00",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Tý",
      month: "Đinh Sửu",
      day: "Nhâm Tuất",
      hour: "Đinh Mùi",
      normalizedSolarDate: "1985-01-24",
      dayPillarDate: "1985-01-24",
      isLateZiHour: false,
      monthSolarTerm: "Tiểu Hàn",
      lunarConverted: false
    }
  },
  {
    name: "Trước Lập Xuân 2024 theo giờ Việt Nam",
    group: "li-chun",
    note: "Sinh trước mốc Lập Xuân thật nên năm trụ và tháng trụ vẫn thuộc năm/quãng trước.",
    input: {
      birthDate: "2024-02-04",
      birthTime: "14:59",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Quý Mão",
      month: "Ất Sửu",
      day: "Đinh Dậu",
      hour: "Đinh Mùi",
      normalizedSolarDate: "2024-02-04",
      dayPillarDate: "2024-02-04",
      isLateZiHour: false,
      monthSolarTerm: "Tiểu Hàn",
      lunarConverted: false
    }
  },
  {
    name: "Sau Lập Xuân 2024 theo giờ Việt Nam",
    group: "li-chun",
    note: "Sinh sau mốc Lập Xuân thật nên năm trụ đổi sang Giáp Thìn và tháng trụ đổi sang Dần.",
    input: {
      birthDate: "2024-02-04",
      birthTime: "15:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Dần",
      day: "Đinh Dậu",
      hour: "Mậu Thân",
      normalizedSolarDate: "2024-02-04",
      dayPillarDate: "2024-02-04",
      isLateZiHour: false,
      monthSolarTerm: "Lập Xuân",
      lunarConverted: false
    }
  },
  {
    name: "Trước Kinh Trập 2024 vài phút theo giờ Việt Nam",
    group: "solar-term",
    note: "Kiểm tháng trụ sát tiết khí, trước Kinh Trập vẫn là tháng Dần.",
    input: {
      birthDate: "2024-03-05",
      birthTime: "09:00",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "female",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Dần",
      day: "Đinh Mão",
      hour: "Ất Tỵ",
      normalizedSolarDate: "2024-03-05",
      dayPillarDate: "2024-03-05",
      isLateZiHour: false,
      monthSolarTerm: "Lập Xuân",
      lunarConverted: false
    }
  },
  {
    name: "Sau Kinh Trập 2024 vài phút theo giờ Việt Nam",
    group: "solar-term",
    note: "Kiểm tháng trụ sát tiết khí, sau Kinh Trập chuyển sang tháng Mão.",
    input: {
      birthDate: "2024-03-05",
      birthTime: "09:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "female",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Đinh Mão",
      day: "Đinh Mão",
      hour: "Ất Tỵ",
      normalizedSolarDate: "2024-03-05",
      dayPillarDate: "2024-03-05",
      isLateZiHour: false,
      monthSolarTerm: "Kinh Trập",
      lunarConverted: false
    }
  },
  {
    name: "Giờ Tý muộn 23:30 đẩy trụ ngày sang hôm sau",
    group: "zi-hour",
    note: "Kiểm dayBoundaryMode zi-hour-rollover: 23:00-23:59 dùng ngày kế tiếp cho trụ ngày và Can giờ.",
    input: {
      birthDate: "2024-02-09",
      birthTime: "23:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Dần",
      day: "Quý Mão",
      hour: "Nhâm Tý",
      normalizedSolarDate: "2024-02-09",
      dayPillarDate: "2024-02-10",
      isLateZiHour: true,
      monthSolarTerm: "Lập Xuân",
      lunarConverted: false
    }
  },
  {
    name: "Giờ Tý sớm 00:30 không đẩy sang hôm sau",
    group: "zi-hour",
    note: "Kiểm nhánh giờ Tý 00:00-00:59 vẫn là chi Tý nhưng không đổi ngày trụ.",
    input: {
      birthDate: "2024-02-10",
      birthTime: "00:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Dần",
      day: "Quý Mão",
      hour: "Nhâm Tý",
      normalizedSolarDate: "2024-02-10",
      dayPillarDate: "2024-02-10",
      isLateZiHour: false,
      monthSolarTerm: "Lập Xuân",
      lunarConverted: false
    }
  },
  {
    name: "Giờ Hợi 21:30",
    group: "hoi-hour",
    note: "Kiểm nhánh giờ Hợi 21:00-22:59 không bị lẫn với Tý muộn.",
    input: {
      birthDate: "2024-11-06",
      birthTime: "21:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "female",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Giáp Tuất",
      day: "Quý Dậu",
      hour: "Quý Hợi",
      normalizedSolarDate: "2024-11-06",
      dayPillarDate: "2024-11-06",
      isLateZiHour: false,
      monthSolarTerm: "Hàn Lộ",
      lunarConverted: false
    }
  },
  {
    name: "Trước Lập Đông 2024 theo giờ Việt Nam",
    group: "solar-term",
    note: "Sát tiết khí Lập Đông, trước mốc vẫn giữ tháng Tuất.",
    input: {
      birthDate: "2024-11-07",
      birthTime: "05:00",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "female",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Giáp Tuất",
      day: "Giáp Tuất",
      hour: "Đinh Mão",
      normalizedSolarDate: "2024-11-07",
      dayPillarDate: "2024-11-07",
      isLateZiHour: false,
      monthSolarTerm: "Hàn Lộ",
      lunarConverted: false
    }
  },
  {
    name: "Sau Lập Đông 2024 theo giờ Việt Nam",
    group: "solar-term",
    note: "Sát tiết khí Lập Đông, sau mốc chuyển tháng trụ sang Hợi.",
    input: {
      birthDate: "2024-11-07",
      birthTime: "05:30",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "female",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Ất Hợi",
      day: "Giáp Tuất",
      hour: "Đinh Mão",
      normalizedSolarDate: "2024-11-07",
      dayPillarDate: "2024-11-07",
      isLateZiHour: false,
      monthSolarTerm: "Lập Đông",
      lunarConverted: false
    }
  },
  {
    name: "Trước Đại Tuyết 2024 theo giờ Việt Nam",
    group: "solar-term",
    note: "Sát tiết khí Đại Tuyết, trước mốc vẫn giữ tháng Hợi.",
    input: {
      birthDate: "2024-12-06",
      birthTime: "21:59",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Ất Hợi",
      day: "Quý Mão",
      hour: "Quý Hợi",
      normalizedSolarDate: "2024-12-06",
      dayPillarDate: "2024-12-06",
      isLateZiHour: false,
      monthSolarTerm: "Lập Đông",
      lunarConverted: false
    }
  },
  {
    name: "Sau Đại Tuyết 2024 theo giờ Việt Nam",
    group: "solar-term",
    note: "Sát tiết khí Đại Tuyết, sau mốc chuyển tháng trụ sang Tý.",
    input: {
      birthDate: "2024-12-06",
      birthTime: "22:59",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Tý",
      day: "Quý Mão",
      hour: "Quý Hợi",
      normalizedSolarDate: "2024-12-06",
      dayPillarDate: "2024-12-06",
      isLateZiHour: false,
      monthSolarTerm: "Đại Tuyết",
      lunarConverted: false
    }
  },
  {
    name: "Âm lịch mùng 1 Tết Giáp Thìn 2024",
    group: "lunar",
    note: "Kiểm converter âm lịch: 2024-01-01 âm lịch đổi sang 2024-02-10 dương lịch trước khi dựng trụ.",
    input: {
      birthDate: "2024-01-01",
      birthTime: "00:30",
      calendarType: "lunar",
      timezone: "Asia/Ho_Chi_Minh",
      gender: "male",
      isLeapMonth: false,
      dayBoundaryMode: "zi-hour-rollover"
    },
    expected: {
      year: "Giáp Thìn",
      month: "Bính Dần",
      day: "Quý Mão",
      hour: "Nhâm Tý",
      normalizedSolarDate: "2024-02-10",
      dayPillarDate: "2024-02-10",
      isLateZiHour: false,
      monthSolarTerm: "Lập Xuân",
      lunarConverted: true
    }
  }
];

export function runEngineFixtures() {
  return runEngineFixtureChecks().map((item) => ({
    name: item.name,
    expected: item.expected,
    actual: item.actual
  }));
}

export function runEngineFixtureChecks(): EngineFixtureCheckResult[] {
  return engineFixtures.map((fixture) => {
    const result = deriveFourPillars(fixture.input);
    const actual: EngineFixture["expected"] = {
      year: result.pillars.year.pillar,
      month: result.pillars.month.pillar,
      day: result.pillars.day.pillar,
      hour: result.pillars.hour.pillar,
      normalizedSolarDate: result.meta.normalizedSolarDate,
      dayPillarDate: result.meta.dayPillarDate,
      isLateZiHour: result.meta.isLateZiHour,
      monthSolarTerm: getSolarTermName(result.meta.monthSolarTerm),
      lunarConverted: result.meta.lunarConverted
    };
    const failures = collectFailures(fixture, actual);

    return {
      name: fixture.name,
      group: fixture.group,
      passed: failures.length === 0,
      failures,
      expected: fixture.expected,
      actual
    };
  });
}

export function assertEngineFixtures() {
  const results = runEngineFixtureChecks();
  const failed = results.filter((item) => !item.passed);

  if (failed.length > 0) {
    throw new Error(
      failed
        .map((item) => `${item.name}: ${item.failures.join("; ")}`)
        .join("\n")
    );
  }

  return results;
}
