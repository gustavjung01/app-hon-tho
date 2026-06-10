import { phiTinhPreviewGrid } from "../data/sonContent";
import type { SonComputedSummary, SonFormState, SonPalaceCell } from "../types";

const periods = [
  { period: 1, from: 1864, to: 1883 },
  { period: 2, from: 1884, to: 1903 },
  { period: 3, from: 1904, to: 1923 },
  { period: 4, from: 1924, to: 1943 },
  { period: 5, from: 1944, to: 1963 },
  { period: 6, from: 1964, to: 1983 },
  { period: 7, from: 1984, to: 2003 },
  { period: 8, from: 2004, to: 2023 },
  { period: 9, from: 2024, to: 2043 },
];

function getHousePeriod(yearInput: string): string {
  const year = Number(yearInput);
  if (!Number.isInteger(year)) return "Chưa xác định";
  const found = periods.find((item) => year >= item.from && year <= item.to);
  return found ? `Vận ${found.period} (${found.from}-${found.to})` : "Ngoài bảng demo";
}

export function getPhiTinhPreview(form: SonFormState): {
  summary: SonComputedSummary;
  grid: SonPalaceCell[];
} {
  const yearBasis = form.renovatedYear.trim() || form.builtYear;
  const housePeriod = getHousePeriod(yearBasis);
  const quietCells = phiTinhPreviewGrid.filter((cell) => cell.severity === "caution" || cell.severity === "strong_caution");

  return {
    grid: phiTinhPreviewGrid,
    summary: {
      title: "Phi tinh preview",
      headline: `Demo: mốc vận đang dùng là ${yearBasis || "chưa nhập"}, ${housePeriod}.`,
      confidence: "placeholder",
      facts: [
        { label: "Năm xây/nhập trạch", value: form.builtYear || "Chưa nhập" },
        { label: "Năm sửa lớn", value: form.renovatedYear || "Không khai báo" },
        { label: "Mốc vận demo", value: yearBasis || "Chưa nhập" },
        { label: "Hướng nhà", value: form.facingDirection },
        { label: "Năm cần xem", value: form.targetYear || "Chưa nhập" },
      ],
      notices: [
        "Đây là phi tinh preview để kiểm thử UI, chưa phải phi bàn chính thức.",
        "Bản chính thức cần rule tọa/hướng, vận tinh, sơn tinh, hướng tinh và niên tinh đã kiểm duyệt.",
        "Khi thiếu sơ đồ hoặc có mâu thuẫn trường phái, app phải hiển thị cần đối chiếu thêm.",
      ],
      primarySuggestions: [
        "Giữ trung cung sạch, thoáng và không nén đồ nặng.",
        "Khu cần tĩnh nên hạn chế khoan đục, sửa lớn hoặc gây ồn nếu không cần thiết.",
        quietCells.length
          ? `Demo đang đánh dấu ${quietCells.length} khu cần lưu ý để giữ yên hoặc kiểm tra thêm.`
          : "Chưa có khu nào bị đánh dấu mạnh trong preview.",
      ],
    },
  };
}
