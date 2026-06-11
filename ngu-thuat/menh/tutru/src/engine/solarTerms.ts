import { toJulianDayFromUtcMs } from "./calendarMath";

export type JieTermKey =
  | "xiao-han"
  | "li-chun"
  | "jing-zhe"
  | "qing-ming"
  | "li-xia"
  | "mang-zhong"
  | "xiao-shu"
  | "li-qiu"
  | "bai-lu"
  | "han-lu"
  | "li-dong"
  | "da-xue";

export interface JieSolarTermDefinition {
  key: JieTermKey;
  name: string;
  han: string;
  targetLongitude: number;
  approxMonth: number;
  approxDay: number;
  branchIndex: number;
}

export interface JieSolarTermBoundary extends JieSolarTermDefinition {
  gregorianYear: number;
  utcMs: number;
  isoUtc: string;
}

const DAY_MS = 86400000;
const SEARCH_STEP_MS = 6 * 60 * 60 * 1000;

export const JIE_SOLAR_TERMS: JieSolarTermDefinition[] = [
  { key: "xiao-han", name: "Tiểu Hàn", han: "小寒", targetLongitude: 285, approxMonth: 1, approxDay: 6, branchIndex: 1 },
  { key: "li-chun", name: "Lập Xuân", han: "立春", targetLongitude: 315, approxMonth: 2, approxDay: 4, branchIndex: 2 },
  { key: "jing-zhe", name: "Kinh Trập", han: "驚蟄", targetLongitude: 345, approxMonth: 3, approxDay: 6, branchIndex: 3 },
  { key: "qing-ming", name: "Thanh Minh", han: "清明", targetLongitude: 15, approxMonth: 4, approxDay: 5, branchIndex: 4 },
  { key: "li-xia", name: "Lập Hạ", han: "立夏", targetLongitude: 45, approxMonth: 5, approxDay: 6, branchIndex: 5 },
  { key: "mang-zhong", name: "Mang Chủng", han: "芒種", targetLongitude: 75, approxMonth: 6, approxDay: 6, branchIndex: 6 },
  { key: "xiao-shu", name: "Tiểu Thử", han: "小暑", targetLongitude: 105, approxMonth: 7, approxDay: 7, branchIndex: 7 },
  { key: "li-qiu", name: "Lập Thu", han: "立秋", targetLongitude: 135, approxMonth: 8, approxDay: 8, branchIndex: 8 },
  { key: "bai-lu", name: "Bạch Lộ", han: "白露", targetLongitude: 165, approxMonth: 9, approxDay: 8, branchIndex: 9 },
  { key: "han-lu", name: "Hàn Lộ", han: "寒露", targetLongitude: 195, approxMonth: 10, approxDay: 8, branchIndex: 10 },
  { key: "li-dong", name: "Lập Đông", han: "立冬", targetLongitude: 225, approxMonth: 11, approxDay: 7, branchIndex: 11 },
  { key: "da-xue", name: "Đại Tuyết", han: "大雪", targetLongitude: 255, approxMonth: 12, approxDay: 7, branchIndex: 0 }
];

const boundaryCache = new Map<string, JieSolarTermBoundary>();

function degToRad(degree: number) {
  return (degree * Math.PI) / 180;
}

function normalizeDegrees(degree: number) {
  return ((degree % 360) + 360) % 360;
}

function signedAngleDifference(current: number, target: number) {
  return ((normalizeDegrees(current - target) + 540) % 360) - 180;
}

export function solarLongitudeDegreesForUtcMs(utcMs: number) {
  const jd = toJulianDayFromUtcMs(utcMs);
  const t = (jd - 2451545.0) / 36525;
  const t2 = t * t;
  const meanLongitude = 280.46646 + 36000.76983 * t + 0.0003032 * t2;
  const meanAnomaly = 357.52911 + 35999.05029 * t - 0.0001537 * t2;
  const anomalyRad = degToRad(meanAnomaly);
  const equationOfCenter =
    (1.914602 - 0.004817 * t - 0.000014 * t2) * Math.sin(anomalyRad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * anomalyRad) +
    0.000289 * Math.sin(3 * anomalyRad);
  const trueLongitude = meanLongitude + equationOfCenter;
  const omega = 125.04 - 1934.136 * t;
  const apparentLongitude = trueLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega));

  return normalizeDegrees(apparentLongitude);
}

function findBoundaryUtcMs(year: number, definition: JieSolarTermDefinition) {
  const rough = Date.UTC(year, definition.approxMonth - 1, definition.approxDay, 0, 0, 0, 0);
  const start = rough - 6 * DAY_MS;
  const end = rough + 6 * DAY_MS;

  let previousMs = start;
  let previousDiff = signedAngleDifference(solarLongitudeDegreesForUtcMs(previousMs), definition.targetLongitude);

  for (let currentMs = start + SEARCH_STEP_MS; currentMs <= end; currentMs += SEARCH_STEP_MS) {
    const currentDiff = signedAngleDifference(solarLongitudeDegreesForUtcMs(currentMs), definition.targetLongitude);

    if (previousDiff <= 0 && currentDiff >= 0) {
      let low = previousMs;
      let high = currentMs;

      for (let index = 0; index < 40; index += 1) {
        const mid = Math.floor((low + high) / 2);
        const midDiff = signedAngleDifference(solarLongitudeDegreesForUtcMs(mid), definition.targetLongitude);
        if (midDiff >= 0) {
          high = mid;
        } else {
          low = mid;
        }
      }

      return high;
    }

    previousMs = currentMs;
    previousDiff = currentDiff;
  }

  throw new Error(`Không tìm được tiết khí ${definition.name} cho năm ${year}.`);
}

export function getJieSolarTermBoundary(year: number, key: JieTermKey) {
  const cacheKey = `${year}:${key}`;
  const cached = boundaryCache.get(cacheKey);
  if (cached) return cached;

  const definition = JIE_SOLAR_TERMS.find((item) => item.key === key);
  if (!definition) {
    throw new Error(`Tiết khí không được hỗ trợ: ${key}`);
  }

  const utcMs = findBoundaryUtcMs(year, definition);
  const boundary: JieSolarTermBoundary = {
    ...definition,
    gregorianYear: year,
    utcMs,
    isoUtc: new Date(utcMs).toISOString()
  };

  boundaryCache.set(cacheKey, boundary);
  return boundary;
}

export function getLiChunBoundary(year: number) {
  return getJieSolarTermBoundary(year, "li-chun");
}

export function resolveActiveJieSolarTerm(instantUtc: Date) {
  const year = instantUtc.getUTCFullYear();
  const boundaries = [year - 1, year, year + 1]
    .flatMap((candidateYear) => JIE_SOLAR_TERMS.map((term) => getJieSolarTermBoundary(candidateYear, term.key)))
    .sort((left, right) => left.utcMs - right.utcMs);

  let active = boundaries[0];
  const instantMs = instantUtc.getTime();

  for (const boundary of boundaries) {
    if (boundary.utcMs <= instantMs) {
      active = boundary;
    } else {
      break;
    }
  }

  if (!active) {
    throw new Error("Không xác định được tiết khí tháng.");
  }

  return active;
}
