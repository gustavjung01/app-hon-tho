import type { ElementName, HiddenStemDefinition, PolarityLabel, TenGodName } from "./coreTables";
import type { JieSolarTermBoundary } from "./solarTerms";
import type { PlainDate } from "./calendarMath";

export type CalendarType = "solar" | "lunar";
export type GenderType = "male" | "female" | "other";
export type DayBoundaryMode = "zi-hour-rollover" | "civil-day";
export type LuckCycleDirection = "forward" | "backward";

export interface DeriveFourPillarsInput {
  birthDate: string;
  birthTime: string;
  calendarType: CalendarType;
  timezone: string;
  gender?: GenderType;
  birthPlace?: string;
  isLeapMonth?: boolean;
  dayBoundaryMode?: DayBoundaryMode;
}

export interface Pillar {
  label: string;
  stem: string;
  stemHan: string;
  stemIndex: number;
  stemElement: ElementName;
  stemPolarity: PolarityLabel;
  branch: string;
  branchHan: string;
  branchIndex: number;
  branchElement: ElementName;
  branchPolarity: PolarityLabel;
  hiddenStems: HiddenStemDefinition[];
  pillar: string;
  pillarHan: string;
  element?: string;
  tenGod?: TenGodName | "Nhật chủ";
  twelveGrowthStage?: string;
}

export interface LuckCycleStartAge {
  daysToStart: number;
  totalMonths: number;
  years: number;
  months: number;
  label: string;
  targetTerm: {
    role: "next" | "previous";
    name: string;
    han: string;
    isoUtc: string;
  };
}

export interface MajorLuckCycle {
  index: number;
  pillar: string;
  pillarHan: string;
  stem: string;
  stemHan: string;
  stemIndex: number;
  stemElement: ElementName;
  stemPolarity: PolarityLabel;
  branch: string;
  branchHan: string;
  branchIndex: number;
  branchElement: ElementName;
  branchPolarity: PolarityLabel;
  ageStartMonths: number;
  ageEndMonths: number;
  ageLabel: string;
  startDate: string;
  endDate: string;
  years: string;
}

export interface MajorLuckCycleResult {
  direction: LuckCycleDirection;
  directionLabel: "Thuận vận" | "Nghịch vận";
  directionRule: string;
  gender: GenderType;
  yearStem: string;
  yearStemHan: string;
  yearStemPolarity: PolarityLabel;
  startAge: LuckCycleStartAge;
  cycles: MajorLuckCycle[];
}

export interface DeriveFourPillarsOutput {
  input: DeriveFourPillarsInput;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  summary: {
    dayMaster: string;
  };
  majorLuck: MajorLuckCycleResult;
  meta: {
    engineVersion: string;
    ruleSetVersion: string;
    calculationMode: string;
    normalizedSolarDate?: string;
    dayPillarDate?: string;
    isLateZiHour?: boolean;
    monthSolarTerm?: string;
    monthSolarTermUtc?: string;
    lunarConverted?: boolean;
  };
}

export interface ParsedBirthDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  timezone: string;
  sourceCalendarType: CalendarType;
  sourceDate: PlainDate;
  solarDate: PlainDate;
  dayPillarDate: PlainDate;
  birthInstantUtc: Date;
  timezoneOffsetHours: number;
  isLeapMonth: boolean;
  isLateZiHour: boolean;
  dayBoundaryMode: DayBoundaryMode;
}

export interface MonthPillarDerivation {
  pillar: Pillar;
  stemIndex: number;
  branchIndex: number;
  solarTerm: JieSolarTermBoundary;
}
