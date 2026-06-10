import type {
  InterpretationResult,
  Pattern,
  PatternScore,
  RuleCondition,
  SafetyWarning,
} from '../data/yhoc/types';

import { QUESTIONS } from '../data/yhoc/questions';
import { PATTERNS } from '../data/yhoc/patterns';
import { RULES } from '../data/yhoc/rules';
import { SAFETY_WARNINGS } from '../data/yhoc/safety';

export type YhocAnswerValue = string | string[] | number | boolean | null | undefined;
export type YhocAnswers = Record<string, YhocAnswerValue>;

const patternById = new Map(PATTERNS.map((pattern) => [pattern.id, pattern]));
const safetyById = new Map(SAFETY_WARNINGS.map((warning) => [warning.id, warning]));
const questionById = new Map(QUESTIONS.map((question) => [question.id, question]));

function includesValue(value: YhocAnswerValue, expected: string | number | boolean | undefined) {
  if (expected === undefined) return false;
  if (Array.isArray(value)) return value.includes(String(expected));
  if (typeof value === 'string' && typeof expected === 'string') return value.includes(expected);
  return false;
}

function matchesCondition(condition: RuleCondition, answers: YhocAnswers): boolean {
  const actual = answers[condition.questionId];

  if (condition.operator === 'exists') {
    return actual !== null && actual !== undefined && actual !== '' && !(Array.isArray(actual) && actual.length === 0);
  }

  if (actual === null || actual === undefined || actual === '' || actual === 'not_sure') {
    return false;
  }

  switch (condition.operator) {
    case 'equals':
      return actual === condition.value;
    case 'includes':
      return includesValue(actual, condition.value);
    case 'gte':
      return typeof actual === 'number' && typeof condition.value === 'number' && actual >= condition.value;
    case 'lte':
      return typeof actual === 'number' && typeof condition.value === 'number' && actual <= condition.value;
    default:
      return false;
  }
}

function getSelectedRedFlags(answers: YhocAnswers): SafetyWarning[] {
  const selected = answers.q_red_flags;
  if (!Array.isArray(selected)) return [];
  if (selected.includes('none')) return [];

  return selected
    .map((flagId) => safetyById.get(String(flagId)))
    .filter((warning): warning is SafetyWarning => Boolean(warning));
}

function scorePatterns(answers: YhocAnswers): PatternScore[] {
  const scoreMap = new Map<string, PatternScore>();

  for (const rule of RULES) {
    const matched = rule.if.every((condition) => matchesCondition(condition, answers));
    if (!matched) continue;

    const current = scoreMap.get(rule.patternId) ?? {
      patternId: rule.patternId,
      score: 0,
      matchedRuleIds: [],
      explanations: [],
    };

    current.score += rule.weight;
    current.matchedRuleIds.push(rule.id);
    current.explanations.push(rule.explanation);
    scoreMap.set(rule.patternId, current);
  }

  return Array.from(scoreMap.values()).sort((a, b) => b.score - a.score);
}

function answeredCount(answers: YhocAnswers): number {
  return Object.values(answers).filter((value) => {
    if (value === null || value === undefined || value === '' || value === 'not_sure') return false;
    if (Array.isArray(value)) return value.length > 0 && !value.includes('not_sure');
    return true;
  }).length;
}

function confidenceFor(score: number, totalAnswered: number) {
  if (score >= 7 && totalAnswered >= 12) return 'fair' as const;
  if (score >= 4 && totalAnswered >= 8) return 'medium' as const;
  return 'low' as const;
}

function detectMissingQuestions(answers: YhocAnswers, topScores: PatternScore[]): string[] {
  const wanted = new Set<string>();

  for (const score of topScores.slice(0, 3)) {
    const pattern = patternById.get(score.patternId);
    pattern?.possibleQuestions.forEach((questionId) => wanted.add(questionId));
  }

  return Array.from(wanted)
    .filter((questionId) => {
      const value = answers[questionId];
      return value === undefined || value === null || value === '' || value === 'not_sure' || (Array.isArray(value) && value.length === 0);
    })
    .slice(0, 8);
}

function detectContradictions(answers: YhocAnswers): string[] {
  const contradictions: string[] = [];

  if (answers.q_cold_sensation === 'yes' && answers.q_heat_sensation === 'yes') {
    contradictions.push('Vừa có dấu hiệu dễ lạnh vừa có cảm giác nóng trong. Cần đọc như dữ liệu pha trộn, không kết luận hàn/nhiệt.');
  }

  if (answers.q_tongue_color === 'red' && answers.q_cold_sensation === 'yes' && answers.q_limb_cold === 'yes') {
    contradictions.push('Quan sát lưỡi nghiêng nhiệt nhưng cảm giác cơ thể nghiêng hàn. Có thể do ánh sáng/camera hoặc bối cảnh khác.');
  }

  if (typeof answers.q_energy_level === 'number' && answers.q_energy_level >= 8 && answers.q_fatigue_after_activity === 'yes') {
    contradictions.push('Người dùng chọn năng lượng cao nhưng cũng dễ mệt sau vận động. Cần hỏi thêm bối cảnh vận động/ngủ nghỉ.');
  }

  if (answers.q_tongue_coating === 'thick_yellow' && answers.q_dry_mouth === 'no' && answers.q_heat_sensation === 'no') {
    contradictions.push('Rêu vàng dày nhưng không có khô/nóng đi kèm. Quan sát lưỡi có thể nhiễu bởi ăn uống hoặc vệ sinh miệng.');
  }

  return contradictions;
}

function safePatternWording(pattern: Pattern, score: number, confidence: 'low' | 'medium' | 'fair') {
  const confidenceText = pattern.confidenceGuidance[confidence];
  return [
    `Dữ liệu tự quan sát hiện nghiêng về xu hướng “${pattern.name}” theo ngôn ngữ Y học cổ học.`,
    confidenceText,
    'Đây không phải chẩn đoán và không thay thế bác sĩ. App không đưa thuốc, phương tễ hoặc liều lượng.',
    score >= 7 ? 'Có nhiều tín hiệu cùng hướng, nhưng vẫn cần xem bối cảnh sinh hoạt và dấu hiệu y tế.' : 'Tín hiệu còn nhẹ hoặc thiếu dữ liệu, nên xem như gợi ý để tự quan sát thêm.',
  ].join(' ');
}

export function interpretYhocAnswers(answers: YhocAnswers): InterpretationResult {
  const safetyWarnings = getSelectedRedFlags(answers);

  if (safetyWarnings.length > 0) {
    return {
      emergencyFirst: true,
      safetyWarnings,
      topPatterns: [],
      missingQuestionIds: [],
      contradictions: [],
      generalCautions: [
        'Có dấu hiệu cần ưu tiên an toàn y tế. App không luận giải Đông y trong trường hợp này.',
        'Vui lòng liên hệ bác sĩ, cơ sở y tế hoặc cấp cứu tùy mức độ.',
      ],
    };
  }

  const scores = scorePatterns(answers);
  const totalAnswered = answeredCount(answers);
  const topScores = scores.slice(0, 3);
  const contradictions = detectContradictions(answers);
  const missingQuestionIds = detectMissingQuestions(answers, topScores);

  const topPatterns = topScores
    .map((score) => {
      const pattern = patternById.get(score.patternId);
      if (!pattern) return null;

      const confidence = confidenceFor(score.score, totalAnswered);
      return {
        pattern,
        score: score.score,
        confidence,
        matchedRuleIds: score.matchedRuleIds,
        wording: safePatternWording(pattern, score.score, confidence),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const generalCautions = [
    'Kết quả chỉ dựa trên dữ liệu tự khai, không phải thăm khám.',
    'Không tự dùng dược liệu, phương thuốc, châm cứu hoặc bấm huyệt để xử lý triệu chứng.',
    'Nếu triệu chứng kéo dài, tăng nặng hoặc ảnh hưởng sinh hoạt, nên đi khám.',
  ];

  if (topPatterns.length === 0) {
    generalCautions.unshift('Dữ liệu hiện chưa đủ để gợi ý xu hướng thể trạng rõ ràng.');
  }

  return {
    emergencyFirst: false,
    safetyWarnings: [],
    topPatterns,
    missingQuestionIds,
    contradictions,
    generalCautions,
  };
}

export function getQuestionLabel(questionId: string): string {
  return questionById.get(questionId)?.label ?? questionId;
}

export function getYhocEngineDebug(answers: YhocAnswers) {
  const result = interpretYhocAnswers(answers);
  return {
    answeredCount: answeredCount(answers),
    missingLabels: result.missingQuestionIds.map(getQuestionLabel),
    matchedPatterns: result.topPatterns.map((item) => ({
      id: item.pattern.id,
      name: item.pattern.name,
      score: item.score,
      confidence: item.confidence,
      rules: item.matchedRuleIds,
    })),
    contradictions: result.contradictions,
  };
}
