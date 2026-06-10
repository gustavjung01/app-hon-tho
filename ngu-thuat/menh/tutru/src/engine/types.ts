export type CalendarType = "solar" | "lunar";
export type GenderType = "male" | "female" | "other";

export interface DeriveFourPillarsInput {
  birthDate: string;
  birthTime: string;
  calendarType: CalendarType;
  timezone: string;
  gender?: GenderType;
  birthPlace?: string;
}

export interface Pillar {
  label: string;
  stem: string;
  stemHan: string;
  branch: string;
  branchHan: string;
  pillar: string;
  pillarHan: string;
  element?: string;
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
  meta: {
    engineVersion: string;
    ruleSetVersion: string;
    calculationMode: string;
  };
}

export interface ParsedBirthDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

