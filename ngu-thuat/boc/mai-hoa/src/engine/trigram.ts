import trigramsData from "../data/trigrams.json";
import type { Trigram } from "./types";

const trigrams: Trigram[] = trigramsData as Trigram[];

export function getTrigramById(id: number): Trigram | undefined {
  return trigrams.find((t) => t.id === id);
}

export function getTrigramByMHNum(mhNum: number): Trigram | undefined {
  return trigrams.find((t) => t.mh_num === mhNum);
}

export function getTrigramByBits(bits: string): Trigram | undefined {
  return trigrams.find((t) => t.bits === bits);
}

export function getAllTrigrams(): Trigram[] {
  return trigrams;
}
