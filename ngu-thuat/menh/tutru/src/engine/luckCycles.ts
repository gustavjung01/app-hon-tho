// Phase-next TODO for luck cycle engine.
// This file is intentionally a scaffold and is not wired into runtime yet.

export interface LuckCycleTodoPlan {
  id: string;
  title: string;
  detail: string;
}

export const luckCycleEngineTodo: LuckCycleTodoPlan[] = [
  {
    id: "direction-by-gender-and-year-polarity",
    title: "Xác định chiều thuận/nghịch vận",
    detail: "Tính theo giới tính và âm/dương năm sinh, có chọn rõ công thức học phái."
  },
  {
    id: "start-age-calculation",
    title: "Tính tuổi khởi vận",
    detail: "Tính khoảng cách mốc tiết khí và quy đổi ra tuổi khởi vận theo quy tắc lịch pháp."
  },
  {
    id: "generate-major-luck-cycles",
    title: "Sinh danh sách đại vận",
    detail: "Tạo chuỗi trụ đại vận theo chiều thuận/nghịch đã xác định."
  },
  {
    id: "generate-annual-cycles",
    title: "Sinh lưu niên cơ bản",
    detail: "Tạo lớp đối chiếu năm theo Can Chi để đặt cạnh đại vận."
  },
  {
    id: "gender-diff-fixtures",
    title: "Bổ sung fixture nam/nữ",
    detail: "Thêm fixture cùng ngày giờ khác giới tính để kiểm thử khác biệt ở lớp dòng vận."
  }
];
