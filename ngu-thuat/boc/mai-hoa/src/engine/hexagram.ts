import { Hexagram } from "./types";
import hexagramsData from "../data/hexagrams.json";

const hexagrams: Hexagram[] = hexagramsData as Hexagram[];

export function getHexagramByIndex(index: number): Hexagram | undefined {
  return hexagrams.find((h) => h.kw_index === index);
}

export function getHexagramByTrigrams(upperTrigramId: number, lowerTrigramId: number): Hexagram | undefined {
  return hexagrams.find((h) => h.upper_id === upperTrigramId && h.lower_id === lowerTrigramId);
}

export function getHexagramByBits(bits: string): Hexagram | undefined {
  return hexagrams.find((h) => h.bits === bits);
}

export function getAllHexagrams(): Hexagram[] {
  return hexagrams;
}

export function calculateMutualHexagram(primary: Hexagram, _movingLine: number): Hexagram | undefined {
  // Quẻ hỗ: lấy hào 2,3,4 làm hạ quái và hào 3,4,5 làm thượng quái
  const bits = primary.bits;
  const hao2 = bits[1];
  const hao3 = bits[2];
  const hao4 = bits[3];
  const hao5 = bits[4];
  
  const lowerBits = hao2 + hao3 + hao4;
  const upperBits = hao3 + hao4 + hao5;
  const mutualBits = upperBits + lowerBits;
  
  return getHexagramByBits(mutualBits);
}

export function calculateChangedHexagram(primary: Hexagram, movingLine: number): Hexagram | undefined {
  // Quẻ biến: đảo hào động (0->1, 1->0)
  const bits = primary.bits.split("");
  const index = movingLine - 1;
  bits[index] = bits[index] === "1" ? "0" : "1";
  const changedBits = bits.join("");
  
  return getHexagramByBits(changedBits);
}
