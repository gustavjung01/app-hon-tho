// Type definitions for Y - Y học cổ học tham khảo
// Scope: learning, self-observation, cautious pattern tendency only.
// Forbidden: diagnosis, prescription, dosage, treatment claims.

export type ConfidenceLevel = 'low' | 'medium' | 'fair';
export type ReliabilityLevel = 'low' | 'medium' | 'high';
export type QuestionType = 'single' | 'multiple' | 'scale' | 'text';

export type Option = {
  id: string;
  label: string;
  value: string | number | boolean;
  scoreHints?: string[];
  redFlagId?: string;
};

export type Question = {
  id: string;
  group: string;
  label: string;
  helperText?: string;
  type: QuestionType;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  mapping?: string[];
  reliability: ReliabilityLevel;
  safetySensitive?: boolean;
  allowSkip?: boolean;
};

export type Pattern = {
  id: string;
  name: string;
  classicalCategory: string;
  overview: string;
  signs: string[];
  possibleQuestions: string[];
  supportiveCare: string[];
  cautions: string[];
  forbiddenClaims: string[];
  contradictorySignals?: string[];
  confidenceGuidance: {
    low: string;
    medium: string;
    fair: string;
  };
  sourceRefs?: string[];
};

export type RuleOperator = 'equals' | 'includes' | 'gte' | 'lte' | 'exists';

export type RuleCondition = {
  questionId: string;
  operator: RuleOperator;
  value?: string | number | boolean;
};

export type Rule = {
  id: string;
  patternId: string;
  if: RuleCondition[];
  weight: number;
  explanation: string;
  caution: string;
  forbiddenWording: string[];
  reliability: ReliabilityLevel;
};

export type SafetyWarning = {
  id: string;
  label: string;
  severity: 'emergency' | 'urgent' | 'medical' | 'caution';
  triggers: string[];
  message: string;
  action: string;
  blockInterpretation: boolean;
};

export type PatternScore = {
  patternId: string;
  score: number;
  matchedRuleIds: string[];
  explanations: string[];
};

export type InterpretationResult = {
  emergencyFirst: boolean;
  safetyWarnings: SafetyWarning[];
  topPatterns: Array<{
    pattern: Pattern;
    score: number;
    confidence: ConfidenceLevel;
    matchedRuleIds: string[];
    wording: string;
  }>;
  missingQuestionIds: string[];
  contradictions: string[];
  generalCautions: string[];
};

export type GlossaryTerm = {
  id: string;
  term: string;
  short: string;
  plain: string;
  appExample: string;
  caution: string;
  related?: string[];
};

export type FoundationItem = {
  id: string;
  title: string;
  summary: string;
  appUse: string[];
  safeWording: string[];
  forbidden: string[];
  sourceRefs?: string[];
};
