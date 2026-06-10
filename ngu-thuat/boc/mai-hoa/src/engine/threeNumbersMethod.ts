import type { ThreeNumbersInput, CalculationResult, DerivationStep } from "./types";
import { mod1 } from "./mod";
import { getTrigramByMHNum } from "./trigram";
import { getHexagramByTrigrams, calculateMutualHexagram, calculateChangedHexagram } from "./hexagram";

export function calculateByThreeNumbers(input: ThreeNumbersInput): CalculationResult {
  const { num1, num2, num3 } = input;
  
  const warnings: string[] = [];
  const derivationSteps: DerivationStep[] = [];
  
  // Validate input
  if (num1 <= 0 || num2 <= 0 || num3 <= 0) {
    warnings.push("Các số phải lớn hơn 0");
  }
  
  // Calculate upper trigram (thượng quái)
  // upper = num1 % 8
  const upperIndex = mod1(num1, 8);
  const upperRemainder = num1 % 8;
  derivationSteps.push({
    step: "Tính Thượng quái",
    formula: "Số 1 chia lấy dư cho 8",
    calculation: `${num1} chia cho 8 được dư ${upperRemainder === 0 ? '0, theo quy tắc Mai Hoa lấy 8' : upperRemainder}`,
    result: upperIndex
  });
  
  // Calculate lower trigram (hạ quái)
  // lower = num2 % 8
  const lowerIndex = mod1(num2, 8);
  const lowerRemainder = num2 % 8;
  derivationSteps.push({
    step: "Tính Hạ quái",
    formula: "Số 2 chia lấy dư cho 8",
    calculation: `${num2} chia cho 8 được dư ${lowerRemainder === 0 ? '0, theo quy tắc Mai Hoa lấy 8' : lowerRemainder}`,
    result: lowerIndex
  });
  
  // Calculate moving line (hào động)
  // moving = num3 % 6
  const movingLine = mod1(num3, 6);
  const movingRemainder = num3 % 6;
  derivationSteps.push({
    step: "Tính Hào động",
    formula: "Số 3 chia lấy dư cho 6",
    calculation: `${num3} chia cho 6 được dư ${movingRemainder === 0 ? '0, theo quy tắc Mai Hoa lấy 6' : movingRemainder}`,
    result: movingLine
  });
  
  // Get trigrams and hexagrams
  const upperTrigram = getTrigramByMHNum(upperIndex)!;
  const lowerTrigram = getTrigramByMHNum(lowerIndex)!;
  
  const primaryHexagram = getHexagramByTrigrams(upperTrigram.id, lowerTrigram.id)!;
  const mutualHexagram = calculateMutualHexagram(primaryHexagram, movingLine)!;
  const changedHexagram = calculateChangedHexagram(primaryHexagram, movingLine)!;
  
  derivationSteps.push({
    step: "Xác định Quẻ chủ",
    formula: "Thượng quái + Hạ quái",
    calculation: `${upperTrigram.name_vi} trên ${lowerTrigram.name_vi} = ${primaryHexagram.name_vi}`,
    result: primaryHexagram.kw_index
  });
  
  derivationSteps.push({
    step: "Xác định Quẻ hỗ",
    formula: "Hào 2,3,4 làm hạ quái, hào 3,4,5 làm thượng quái",
    calculation: "",
    result: mutualHexagram.kw_index
  });
  
  derivationSteps.push({
    step: "Xác định Quẻ biến",
    formula: "Đảo hào động",
    calculation: `Hào ${movingLine} đổi`,
    result: changedHexagram.kw_index
  });
  
  return {
    methodType: "three_numbers",
    rulesetId: "mhds_three_numbers_v1",
    rawInput: input,
    normalizedInput: {
      num1,
      num2,
      num3
    },
    derivationSteps,
    upperTrigram,
    lowerTrigram,
    movingLine,
    primaryHexagram,
    mutualHexagram,
    changedHexagram,
    warnings
  };
}
