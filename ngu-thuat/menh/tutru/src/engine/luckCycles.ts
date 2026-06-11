import { addDaysToPlainDate, formatPlainDate, type PlainDate } from "./calendarMath";
import { getBranchByIndex, getStemByIndex, type Polarity } from "./coreTables";
import { JIE_SOLAR_TERMS, getJieSolarTermBoundary, type JieSolarTermBoundary } from "./solarTerms";
import type {
  DeriveFourPillarsInput,
  LuckCycleDirection,
  LuckCycleStartAge,
  MajorLuckCycle,
  MajorLuckCycleResult,
  ParsedBirthDateTime,
  Pillar
} from "./types";

const DAY_MS = 86400000;
const MONTHS_PER_MAJOR_LUCK = 120;
const DEFAULT_CYCLE_COUNT = 10;

function addMonthsToPlainDate(date: PlainDate, months: number): PlainDate {
  const candidate = new Date(Date.UTC(date.year, date.month - 1 + months, date.day));
  return {
    year: candidate.getUTCFullYear(),
    month: candidate.getUTCMonth() + 1,
    day: candidate.getUTCDate()
  };
}

function formatAge(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years <= 0) return `${months} tháng`;
  if (months === 0) return `${years} tuổi`;
  return `${years} tuổi ${months} tháng`;
}

function formatAgeRange(startMonths: number, endMonths: number) {
  return `${formatAge(startMonths)} - ${formatAge(endMonths)}`;
}

function getSortedJieBoundariesAround(instantUtc: Date) {
  const year = instantUtc.getUTCFullYear();
  const years = [year - 2, year - 1, year, year + 1, year + 2];

  return years
    .flatMap((candidateYear) => JIE_SOLAR_TERMS.map((term) => getJieSolarTermBoundary(candidateYear, term.key)))
    .sort((left, right) => left.utcMs - right.utcMs);
}

function findAdjacentJieTerms(instantUtc: Date) {
  const boundaries = getSortedJieBoundariesAround(instantUtc);
  const instantMs = instantUtc.getTime();
  let previous: JieSolarTermBoundary | null = null;
  let next: JieSolarTermBoundary | null = null;

  for (const boundary of boundaries) {
    if (boundary.utcMs <= instantMs) {
      previous = boundary;
      continue;
    }

    next = boundary;
    break;
  }

  if (!previous || !next) {
    throw new Error("Không xác định được tiết khí trước/sau để tính tuổi khởi vận.");
  }

  return { previous, next };
}

export function resolveMajorLuckDirection(gender: DeriveFourPillarsInput["gender"], yearStemPolarity: Polarity): LuckCycleDirection {
  const normalizedGender = gender ?? "male";

  if (normalizedGender === "female") {
    return yearStemPolarity === "yin" ? "forward" : "backward";
  }

  return yearStemPolarity === "yang" ? "forward" : "backward";
}

function buildDirectionRule(gender: DeriveFourPillarsInput["gender"], yearStemPolarity: Polarity) {
  const genderLabel = gender === "female" ? "nữ" : gender === "other" ? "khác/không ghi" : "nam";
  const polarityLabel = yearStemPolarity === "yang" ? "Dương" : "Âm";
  return `Quy tắc: nam + năm Dương hoặc nữ + năm Âm đi thuận; nam + năm Âm hoặc nữ + năm Dương đi nghịch. Dữ liệu hiện tại: ${genderLabel}, năm ${polarityLabel}.`;
}

function calculateStartAge(parsed: ParsedBirthDateTime, direction: LuckCycleDirection): LuckCycleStartAge {
  const adjacent = findAdjacentJieTerms(parsed.birthInstantUtc);
  const targetTerm = direction === "forward" ? adjacent.next : adjacent.previous;
  const role: LuckCycleStartAge["targetTerm"]["role"] = direction === "forward" ? "next" : "previous";
  const daysToStart = Math.abs(targetTerm.utcMs - parsed.birthInstantUtc.getTime()) / DAY_MS;

  // Quy đổi phổ biến: 3 ngày = 1 năm, 1 ngày = 4 tháng. Làm tròn tới tháng gần nhất để không giả chính xác tới giờ/phút.
  const totalMonths = Math.max(0, Math.round(daysToStart * 4));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    daysToStart,
    totalMonths,
    years,
    months,
    label: formatAge(totalMonths),
    targetTerm: {
      role,
      name: targetTerm.name,
      han: targetTerm.han,
      isoUtc: targetTerm.isoUtc
    }
  };
}

function buildMajorLuckCycle(
  index: number,
  direction: LuckCycleDirection,
  monthPillar: Pillar,
  parsed: ParsedBirthDateTime,
  startAgeMonths: number
): MajorLuckCycle {
  const step = direction === "forward" ? 1 : -1;
  const stem = getStemByIndex(monthPillar.stemIndex + step * index);
  const branch = getBranchByIndex(monthPillar.branchIndex + step * index);
  const ageStartMonths = startAgeMonths + (index - 1) * MONTHS_PER_MAJOR_LUCK;
  const ageEndMonths = ageStartMonths + MONTHS_PER_MAJOR_LUCK - 1;
  const startDate = addMonthsToPlainDate(parsed.solarDate, ageStartMonths);
  const endDate = addDaysToPlainDate(addMonthsToPlainDate(parsed.solarDate, ageEndMonths + 1), -1);

  return {
    index,
    pillar: `${stem.name} ${branch.name}`,
    pillarHan: `${stem.han}${branch.han}`,
    stem: stem.name,
    stemHan: stem.han,
    stemIndex: stem.index,
    stemElement: stem.element,
    stemPolarity: stem.polarityLabel,
    branch: branch.name,
    branchHan: branch.han,
    branchIndex: branch.index,
    branchElement: branch.element,
    branchPolarity: branch.polarityLabel,
    ageStartMonths,
    ageEndMonths,
    ageLabel: formatAgeRange(ageStartMonths, ageEndMonths),
    startDate: formatPlainDate(startDate),
    endDate: formatPlainDate(endDate),
    years: `${startDate.year}-${endDate.year}`
  };
}

export function deriveMajorLuckCycles({
  input,
  parsed,
  yearPillar,
  monthPillar,
  cycleCount = DEFAULT_CYCLE_COUNT
}: {
  input: DeriveFourPillarsInput;
  parsed: ParsedBirthDateTime;
  yearPillar: Pillar;
  monthPillar: Pillar;
  cycleCount?: number;
}): MajorLuckCycleResult {
  const yearStem = getStemByIndex(yearPillar.stemIndex);
  const gender = input.gender ?? "male";
  const direction = resolveMajorLuckDirection(gender, yearStem.polarity);
  const startAge = calculateStartAge(parsed, direction);
  const cycles = Array.from({ length: cycleCount }, (_, index) =>
    buildMajorLuckCycle(index + 1, direction, monthPillar, parsed, startAge.totalMonths)
  );

  return {
    direction,
    directionLabel: direction === "forward" ? "Thuận vận" : "Nghịch vận",
    directionRule: buildDirectionRule(gender, yearStem.polarity),
    gender,
    yearStem: yearStem.name,
    yearStemHan: yearStem.han,
    yearStemPolarity: yearStem.polarityLabel,
    startAge,
    cycles
  };
}
