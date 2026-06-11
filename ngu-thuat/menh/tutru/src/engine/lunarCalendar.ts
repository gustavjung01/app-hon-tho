import { gregorianToJulianDayNumber, julianDayNumberToGregorian, type PlainDate } from "./calendarMath";

const SYNODIC_MONTH = 29.530588853;
const NEW_MOON_EPOCH = 2415021.076998695;

function degToRad(degree: number) {
  return (degree * Math.PI) / 180;
}

function getNewMoonJulianDay(k: number) {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const dr = Math.PI / 180;

  let jd = 2415020.75933 + SYNODIC_MONTH * k + 0.0001178 * t2 - 0.000000155 * t3;
  jd += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);

  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mPrime = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;

  const c1 =
    (0.1734 - 0.000393 * t) * Math.sin(m * dr) +
    0.0021 * Math.sin(2 * m * dr) -
    0.4068 * Math.sin(mPrime * dr) +
    0.0161 * Math.sin(2 * mPrime * dr) -
    0.0004 * Math.sin(3 * mPrime * dr) +
    0.0104 * Math.sin(2 * f * dr) -
    0.0051 * Math.sin((m + mPrime) * dr) -
    0.0074 * Math.sin((m - mPrime) * dr) +
    0.0004 * Math.sin((2 * f + m) * dr) -
    0.0004 * Math.sin((2 * f - m) * dr) -
    0.0006 * Math.sin((2 * f + mPrime) * dr) +
    0.0010 * Math.sin((2 * f - mPrime) * dr) +
    0.0005 * Math.sin((2 * mPrime + m) * dr);

  const deltaT =
    t < -11
      ? 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3
      : -0.000278 + 0.000265 * t + 0.000262 * t2;

  return jd + c1 - deltaT;
}

function getNewMoonDay(k: number, timezoneHours: number) {
  return Math.floor(getNewMoonJulianDay(k) + 0.5 + timezoneHours / 24);
}

function getSunLongitudeSector(julianDayNumber: number, timezoneHours: number) {
  const t = (julianDayNumber - 2451545.5 - timezoneHours / 24) / 36525;
  const t2 = t * t;
  const dr = Math.PI / 180;
  const meanAnomaly = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
  const meanLongitude = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  const longitudeCorrection =
    (1.9146 - 0.004817 * t - 0.000014 * t2) * Math.sin(degToRad(meanAnomaly)) +
    (0.019993 - 0.000101 * t) * Math.sin(degToRad(2 * meanAnomaly)) +
    0.00029 * Math.sin(degToRad(3 * meanAnomaly));
  const longitude = ((meanLongitude + longitudeCorrection) * dr) % (2 * Math.PI);
  const normalized = longitude < 0 ? longitude + 2 * Math.PI : longitude;

  return Math.floor((normalized / Math.PI) * 6);
}

function getLunarMonth11(year: number, timezoneHours: number) {
  const off = gregorianToJulianDayNumber(year, 12, 31) - NEW_MOON_EPOCH;
  const k = Math.floor(off / SYNODIC_MONTH);
  let newMoon = getNewMoonDay(k, timezoneHours);
  const sunLongitude = getSunLongitudeSector(newMoon, timezoneHours);

  if (sunLongitude >= 9) {
    newMoon = getNewMoonDay(k - 1, timezoneHours);
  }

  return newMoon;
}

function getLeapMonthOffset(month11: number, timezoneHours: number) {
  const k = Math.floor(0.5 + (month11 - NEW_MOON_EPOCH) / SYNODIC_MONTH);
  let lastArc = getSunLongitudeSector(getNewMoonDay(k + 1, timezoneHours), timezoneHours);
  let index = 2;
  let arc = getSunLongitudeSector(getNewMoonDay(k + index, timezoneHours), timezoneHours);

  while (arc !== lastArc && index < 14) {
    lastArc = arc;
    index += 1;
    arc = getSunLongitudeSector(getNewMoonDay(k + index, timezoneHours), timezoneHours);
  }

  return index - 1;
}

export function convertLunarToSolarDate(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean,
  timezoneHours: number
): PlainDate {
  if (lunarMonth < 1 || lunarMonth > 12) {
    throw new Error("Tháng âm lịch không hợp lệ.");
  }

  if (lunarDay < 1 || lunarDay > 30) {
    throw new Error("Ngày âm lịch không hợp lệ.");
  }

  let month11: number;
  let nextMonth11: number;

  if (lunarMonth < 11) {
    month11 = getLunarMonth11(lunarYear - 1, timezoneHours);
    nextMonth11 = getLunarMonth11(lunarYear, timezoneHours);
  } else {
    month11 = getLunarMonth11(lunarYear, timezoneHours);
    nextMonth11 = getLunarMonth11(lunarYear + 1, timezoneHours);
  }

  let offset = lunarMonth - 11;
  if (offset < 0) offset += 12;

  if (nextMonth11 - month11 > 365) {
    const leapOffset = getLeapMonthOffset(month11, timezoneHours);
    let leapMonth = leapOffset - 2;
    if (leapMonth < 0) leapMonth += 12;

    if (isLeapMonth && lunarMonth !== leapMonth) {
      throw new Error(`Năm âm lịch này không có tháng nhuận ${lunarMonth}.`);
    }

    if (isLeapMonth || offset >= leapOffset) {
      offset += 1;
    }
  } else if (isLeapMonth) {
    throw new Error("Năm âm lịch này không có tháng nhuận.");
  }

  const k = Math.floor(0.5 + (month11 - NEW_MOON_EPOCH) / SYNODIC_MONTH);
  const monthStart = getNewMoonDay(k + offset, timezoneHours);
  const nextMonthStart = getNewMoonDay(k + offset + 1, timezoneHours);
  const lunarMonthLength = nextMonthStart - monthStart;

  if (lunarDay > lunarMonthLength) {
    throw new Error(`Tháng âm lịch này chỉ có ${lunarMonthLength} ngày.`);
  }

  return julianDayNumberToGregorian(monthStart + lunarDay - 1);
}
