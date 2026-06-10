import { deriveFourPillars } from "./deriveFourPillars";
import type { DeriveFourPillarsInput } from "./types";

export interface EngineFixture {
  name: string;
  input: DeriveFourPillarsInput;
  expected: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
}

export const engineFixtures: EngineFixture[] = [
  {
    name: "1985-01-24 14:00 Asia/Ho_Chi_Minh",
    input: {
      birthDate: "1985-01-24",
      birthTime: "14:00",
      calendarType: "solar",
      timezone: "Asia/Ho_Chi_Minh"
    },
    expected: {
      year: "Giáp Tý",
      month: "Đinh Sửu",
      day: "Nhâm Tuất",
      hour: "Đinh Mùi"
    }
  }
];

export function runEngineFixtures() {
  return engineFixtures.map((fixture) => {
    const result = deriveFourPillars(fixture.input);

    return {
      name: fixture.name,
      expected: fixture.expected,
      actual: {
        year: result.pillars.year.pillar,
        month: result.pillars.month.pillar,
        day: result.pillars.day.pillar,
        hour: result.pillars.hour.pillar
      }
    };
  });
}

