export type SonModuleId = "bat-trach" | "phi-tinh";

export type SonViewId =
  | "overview"
  | "input"
  | "map"
  | "analysis"
  | "suggestions"
  | "sources";

export type SonDirection =
  | "Bắc"
  | "Đông Bắc"
  | "Đông"
  | "Đông Nam"
  | "Nam"
  | "Tây Nam"
  | "Tây"
  | "Tây Bắc";

export type SonGender = "male" | "female";

export type SonSpaceType =
  | "home"
  | "bedroom"
  | "workdesk"
  | "small-shop"
  | "main-door"
  | "kitchen"
  | "quiet-zone";

export type SonConfidence = "core" | "reference" | "caution" | "placeholder";

export type SonSeverity = "info" | "notice" | "caution" | "strong_caution";

export type SonTone = "earth" | "jade" | "gold" | "ink" | "clay" | "mist";

export interface SonFormState {
  birthYear: string;
  gender: SonGender;
  spaceType: SonSpaceType;
  mainDirection: SonDirection;
  builtYear: string;
  renovatedYear: string;
  facingDirection: SonDirection;
  targetYear: string;
  floorPlanNote: string;
}

export interface SonModuleCard {
  id: SonModuleId;
  title: string;
  subtitle: string;
  icon: string;
  tone: SonTone;
  bullets: string[];
}

export interface SonActionItem {
  id: SonViewId;
  title: string;
  subtitle: string;
  icon: string;
  tone: SonTone;
}

export interface SonDirectionSector {
  direction: SonDirection;
  starName: string;
  quality: "priority" | "observe" | "neutral";
  plainMeaning: string;
  suggestion: string;
}

export interface SonPalaceCell {
  palace: "Tây Bắc" | "Bắc" | "Đông Bắc" | "Tây" | "Trung cung" | "Đông" | "Tây Nam" | "Nam" | "Đông Nam";
  annualStar: string;
  baseStar: string;
  spaceUse: string;
  plainMeaning: string;
  suggestion: string;
  severity: SonSeverity;
}

export interface SonRuleObject {
  id: string;
  module: SonModuleId;
  condition: string;
  result: string;
  explanationPlain: string;
  severity: SonSeverity;
  confidence: SonConfidence;
  sourceRefs: string[];
  allowedWording: string[];
  forbiddenWording: string[];
  requiresHumanReview: boolean;
}

export interface SonComputedSummary {
  title: string;
  headline: string;
  confidence: SonConfidence;
  facts: Array<{ label: string; value: string }>;
  notices: string[];
  primarySuggestions: string[];
}
