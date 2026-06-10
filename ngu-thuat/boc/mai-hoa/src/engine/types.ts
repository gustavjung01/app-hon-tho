export interface Trigram {
  id: number;
  mh_num: number;
  name_vi: string;
  name_han: string;
  unicode: string;
  bits: string;
  element: string;
  basic_symbol: string;
  family_role: string;
  keywords: string[];
}

export interface Hexagram {
  kw_index: number;
  name_vi: string;
  name_han: string;
  unicode: string;
  upper_id: number;
  lower_id: number;
  bits: string;
  short_meaning: string;
  safe_interpretation: string;
}

export interface EarthlyBranch {
  id: number;
  name: string;
  element: string;
}

export type MethodType = "time" | "three_numbers";

export interface TimeInput {
  yearBranch: number; // 1-12
  month: number; // 1-12
  day: number; // 1-30
  hourBranch: number; // 1-12
}

export interface ThreeNumbersInput {
  num1: number;
  num2: number;
  num3: number;
}

export type RawInput = TimeInput | ThreeNumbersInput;

export interface DerivationStep {
  step: string;
  formula: string;
  calculation: string;
  result: number;
}

export interface HexagramResult {
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  movingLine: number; // 1-6
  primaryHexagram: Hexagram;
  mutualHexagram: Hexagram;
  changedHexagram: Hexagram;
}

export interface CalculationResult {
  methodType: MethodType;
  rulesetId: string;
  rawInput: RawInput;
  normalizedInput: Record<string, string | number>;
  derivationSteps: DerivationStep[];
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  movingLine: number;
  primaryHexagram: Hexagram;
  mutualHexagram: Hexagram;
  changedHexagram: Hexagram;
  warnings: string[];
}

export interface FiveElementsRelation {
  relation: "sinh" | "khac" | "bi-sinh" | "bi-khac" | "same";
  description: string;
}

export type QuestionRiskLevel = "low" | "medium" | "high";

export type QuestionType = {
  id: string;
  label: string;
  riskLevel: QuestionRiskLevel;
  guidanceTone: string;
};

export interface InterpretationSection {
  title: string;
  content: string[];
}

export interface StructuredInterpretation {
  summary: string[];
  contextualAnalysis: string[];
  thingsToObserve: string[];
  lightGuidance: string[];
  safetyWarnings: string[];
  iChingDetails: string[];
  calculationDetails: string[];
}
