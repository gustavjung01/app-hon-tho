import { batTrachPreviewSectors } from "../data/sonContent";
import type { SonComputedSummary, SonDirectionSector, SonFormState } from "../types";

const palaceByKua: Record<number, { name: string; group: "Đông tứ mệnh" | "Tây tứ mệnh" }> = {
  1: { name: "Khảm", group: "Đông tứ mệnh" },
  2: { name: "Khôn", group: "Tây tứ mệnh" },
  3: { name: "Chấn", group: "Đông tứ mệnh" },
  4: { name: "Tốn", group: "Đông tứ mệnh" },
  6: { name: "Càn", group: "Tây tứ mệnh" },
  7: { name: "Đoài", group: "Tây tứ mệnh" },
  8: { name: "Cấn", group: "Tây tứ mệnh" },
  9: { name: "Ly", group: "Đông tứ mệnh" },
};

function reduceToSingleDigit(value: number): number {
  let current = Math.abs(value);
  while (current > 9) {
    current = String(current)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return current;
}

/**
 * Demo-only Kua preview.
 * Dev phải thay bằng công thức đã kiểm duyệt, có xử lý lịch tiết khí/năm âm nếu dự án yêu cầu.
 */
export function calculatePreviewKuaNumber(birthYearInput: string, gender: SonFormState["gender"]): number | null {
  const birthYear = Number(birthYearInput);
  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > 2100) return null;

  const lastTwoDigits = birthYear % 100;
  const sum = reduceToSingleDigit(lastTwoDigits);
  const rawKua = birthYear >= 2000
    ? gender === "male"
      ? 9 - sum
      : 6 + sum
    : gender === "male"
      ? 10 - sum
      : 5 + sum;

  let kua = reduceToSingleDigit(rawKua);
  if (kua === 0) kua = 9;
  if (kua === 5) kua = gender === "male" ? 2 : 8;
  return kua;
}

export function getBatTrachPreview(form: SonFormState): {
  summary: SonComputedSummary;
  sectors: SonDirectionSector[];
} {
  const kua = calculatePreviewKuaNumber(form.birthYear, form.gender);
  const profile = kua ? palaceByKua[kua] : null;
  const selectedSector = batTrachPreviewSectors.find((sector) => sector.direction === form.mainDirection);

  return {
    sectors: batTrachPreviewSectors,
    summary: {
      title: "Bát trạch preview",
      headline: profile
        ? `Demo: cung ${profile.name}, nhóm ${profile.group}.`
        : "Thiếu hoặc sai năm sinh, chưa thể tạo preview.",
      confidence: "placeholder",
      facts: [
        { label: "Năm sinh", value: form.birthYear || "Chưa nhập" },
        { label: "Giới tính", value: form.gender === "male" ? "Nam" : "Nữ" },
        { label: "Quái số demo", value: kua ? String(kua) : "Chưa tính" },
        { label: "Cung mệnh demo", value: profile?.name ?? "Chưa tính" },
        { label: "Nhóm mệnh demo", value: profile?.group ?? "Chưa tính" },
        { label: "Hướng đang xét", value: form.mainDirection },
      ],
      notices: [
        "Đây là preview phục vụ UI, không phải engine Bát trạch cuối.",
        "Bản chính thức cần bảng phối cung mệnh với 8 hướng và nguồn đã kiểm duyệt.",
        "Nếu dữ liệu năm sinh/hướng chưa chắc, app phải báo cần kiểm tra thay vì kết luận.",
      ],
      primarySuggestions: selectedSector
        ? [selectedSector.plainMeaning, selectedSector.suggestion, "Ưu tiên điều chỉnh nhẹ: dọn sạch, tăng sáng, giảm nhiễu và quan sát thêm."]
        : ["Chọn một hướng để app hiển thị gợi ý theo công năng."],
    },
  };
}
