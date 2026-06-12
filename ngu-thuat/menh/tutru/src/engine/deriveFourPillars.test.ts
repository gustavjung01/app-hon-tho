import { describe, expect, it } from "vitest";
import { deriveFourPillars } from "./deriveFourPillars";
import type { DeriveFourPillarsInput } from "./types";

function baseInput(overrides: Partial<DeriveFourPillarsInput> = {}): DeriveFourPillarsInput {
  return {
    birthDate: "1990-10-12",
    birthTime: "14:30",
    calendarType: "solar",
    timezone: "Asia/Ho_Chi_Minh",
    gender: "male",
    dayBoundaryMode: "zi-hour-rollover",
    ...overrides
  };
}

describe("deriveFourPillars", () => {
  it("returns year, month, day and hour pillars", () => {
    const result = deriveFourPillars(baseInput());

    expect(result.pillars.year.pillar).toBeTruthy();
    expect(result.pillars.month.pillar).toBeTruthy();
    expect(result.pillars.day.pillar).toBeTruthy();
    expect(result.pillars.hour.pillar).toBeTruthy();
  });

  it("does not mark 22:59 as late Zi hour", () => {
    const result = deriveFourPillars(baseInput({ birthTime: "22:59" }));

    expect(result.meta.isLateZiHour).toBe(false);
  });

  it("marks 23:00 as late Zi hour", () => {
    const result = deriveFourPillars(baseInput({ birthTime: "23:00" }));

    expect(result.meta.isLateZiHour).toBe(true);
    expect(result.meta.dayPillarDate).not.toBe(result.meta.normalizedSolarDate);
  });

  it("marks lunar input as converted", () => {
    const result = deriveFourPillars(baseInput({ birthDate: "1990-08-24", calendarType: "lunar" }));

    expect(result.meta.lunarConverted).toBe(true);
    expect(result.meta.normalizedSolarDate).toBeTruthy();
  });

  it("returns major luck cycles", () => {
    const result = deriveFourPillars(baseInput());

    expect(result.majorLuck.cycles.length).toBeGreaterThan(0);
    expect(result.majorLuck.cycles[0].pillar).toBeTruthy();
  });
});
