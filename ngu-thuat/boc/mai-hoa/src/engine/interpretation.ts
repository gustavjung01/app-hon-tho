import type { FiveElementsRelation, CalculationResult, QuestionType, StructuredInterpretation } from "./types";
import { getKnowledgeForQuestion, getElementExplanation, getRelationshipMeaning } from "./interpretation-knowledge";

const elementCycle: Record<string, string> = {
  "Kim": "Thủy",
  "Thủy": "Mộc",
  "Mộc": "Hỏa",
  "Hỏa": "Thổ",
  "Thổ": "Kim"
};

const elementOvercome: Record<string, string> = {
  "Kim": "Mộc",
  "Mộc": "Thổ",
  "Thổ": "Thủy",
  "Thủy": "Hỏa",
  "Hỏa": "Kim"
};

export function getFiveElementsRelation(element1: string, element2: string): FiveElementsRelation {
  if (element1 === element2) {
    return { relation: "same", description: "Đồng khí" };
  }
  if (elementCycle[element1] === element2) {
    return { relation: "sinh", description: `${element1} sinh ${element2}` };
  }
  if (elementCycle[element2] === element1) {
    return { relation: "bi-sinh", description: `${element2} sinh ${element1}` };
  }
  if (elementOvercome[element1] === element2) {
    return { relation: "khac", description: `${element1} khắc ${element2}` };
  }
  if (elementOvercome[element2] === element1) {
    return { relation: "bi-khac", description: `${element2} khắc ${element1}` };
  }
  return { relation: "same", description: "Không xác định" };
}

function buildBodyUsageExplanation(result: CalculationResult): string {
  const { movingLine, upperTrigram, lowerTrigram } = result;

  if (movingLine >= 4) {
    const bodyUsage = getFiveElementsRelation(upperTrigram.element, lowerTrigram.element);
    const relationMeaning = getRelationshipMeaning(bodyUsage.relation);
    return `Mối quan hệ giữa ${upperTrigram.name_vi} (${getElementExplanation(upperTrigram.element)}) và ${lowerTrigram.name_vi} (${getElementExplanation(lowerTrigram.element)}): ${relationMeaning}. Điều này gợi ý cách các yếu tố trong tình thế hiện tại tương tác với nhau.`;
  } else {
    const bodyUsage = getFiveElementsRelation(lowerTrigram.element, upperTrigram.element);
    const relationMeaning = getRelationshipMeaning(bodyUsage.relation);
    return `Mối quan hệ giữa ${lowerTrigram.name_vi} (${getElementExplanation(lowerTrigram.element)}) và ${upperTrigram.name_vi} (${getElementExplanation(upperTrigram.element)}): ${relationMeaning}. Điều này gợi ý cách các yếu tố trong tình thế hiện tại tương tác với nhau.`;
  }
}

export function getReflectionQuestions(questionType?: QuestionType): string[] {
  const baseQuestions = [
    "Bạn đã cân nhắc đầy đủ các yếu tố thực tế chưa?",
    "Quyết định này có ảnh hưởng đến người khác không?",
    "Bạn có đang tìm kiếm một câu trả lời cụ thể thay vì hiểu rõ tình thế?",
    "Bạn có sẵn sàng chịu trách nhiệm với quyết định của mình không?"
  ];

  if (!questionType) return baseQuestions;

  const knowledge = getKnowledgeForQuestion(questionType);
  if (!knowledge) return baseQuestions;

  return [...baseQuestions];
}

export function generateContextualInterpretation(
  result: CalculationResult,
  questionType?: QuestionType
): StructuredInterpretation {
  const { primaryHexagram, mutualHexagram, changedHexagram, movingLine } = result;
  const knowledge = questionType ? getKnowledgeForQuestion(questionType) : null;

  const summary: string[] = [];
  const contextualAnalysis: string[] = [];
  const thingsToObserve: string[] = [];
  const lightGuidance: string[] = [];
  const safetyWarnings: string[] = [];
  const iChingDetails: string[] = [];
  const calculationDetails: string[] = [];

  if (knowledge) {
    summary.push(knowledge.simpleExplanation);
  }

  summary.push(`Quẻ chủ ${primaryHexagram.name_vi} cho thấy: ${primaryHexagram.safe_interpretation}`);

  contextualAnalysis.push(buildBodyUsageExplanation(result));
  contextualAnalysis.push(`Quẻ hỗ ${mutualHexagram.name_vi} gợi ý những khía cạnh ẩn hoặc phía sau tình thế.`);
  contextualAnalysis.push(`Quẻ biến ${changedHexagram.name_vi} chỉ ra hướng phát triển tiếp theo nếu tình thế tiếp tục.`);

  if (knowledge && knowledge.keyInsights.length > 0) {
    thingsToObserve.push(...knowledge.keyInsights);
  }

  thingsToObserve.push(`Hào động ${movingLine} cho thấy điểm biến chuyển trong tình thế hiện tại.`);

  if (knowledge && knowledge.contextualGuidance) {
    const guidanceValues = Object.values(knowledge.contextualGuidance).flat();
    lightGuidance.push(...guidanceValues.slice(0, 3));
  }

  if (knowledge && knowledge.warningNotes.length > 0) {
    safetyWarnings.push(...knowledge.warningNotes);
  }

  safetyWarnings.push("Đây là kết quả tham khảo. Nên kiểm chứng với điều kiện thực tế trước khi quyết định.");

  iChingDetails.push(`Quẻ chủ: ${primaryHexagram.name_vi} (${primaryHexagram.name_han})`);
  iChingDetails.push(`Quẻ hỗ: ${mutualHexagram.name_vi} (${mutualHexagram.name_han})`);
  iChingDetails.push(`Quẻ biến: ${changedHexagram.name_vi} (${changedHexagram.name_han})`);
  iChingDetails.push(`Thượng quái: ${result.upperTrigram.name_vi} (${result.upperTrigram.element})`);
  iChingDetails.push(`Hạ quái: ${result.lowerTrigram.name_vi} (${result.lowerTrigram.element})`);
  iChingDetails.push(`Hào động: ${movingLine}`);

  calculationDetails.push(`Phương pháp: ${result.methodType === "time" ? "Theo thời gian" : "Theo 3 số"}`);
  calculationDetails.push(`Bộ quy tắc: ${result.rulesetId}`);

  return {
    summary,
    contextualAnalysis,
    thingsToObserve,
    lightGuidance,
    safetyWarnings,
    iChingDetails,
    calculationDetails
  };
}
