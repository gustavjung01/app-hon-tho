import type { QuestionType } from "../engine/types";

export const questionTypes: QuestionType[] = [
  {
    id: "general",
    label: "Tổng quan một việc",
    riskLevel: "low",
    guidanceTone: "Quan sát tổng thể, không kết luận cứng.",
  },
  {
    id: "career",
    label: "Công việc / sự nghiệp",
    riskLevel: "medium",
    guidanceTone: "Tập trung vào phối hợp, thời điểm, cách hành động.",
  },
  {
    id: "study",
    label: "Học tập / thi cử",
    riskLevel: "low",
    guidanceTone: "Tập trung vào sự chuẩn bị, nhịp học và độ bền.",
  },
  {
    id: "relationship",
    label: "Quan hệ / tình cảm",
    riskLevel: "medium",
    guidanceTone: "Tập trung vào giao tiếp, lắng nghe, vị trí đôi bên.",
  },
  {
    id: "family",
    label: "Gia đình",
    riskLevel: "medium",
    guidanceTone: "Tập trung vào hòa khí, vai trò và cách nói chuyện.",
  },
  {
    id: "small_finance",
    label: "Tài chính nhỏ",
    riskLevel: "medium",
    guidanceTone: "Tập trung vào cân nhắc, tránh nóng vội.",
  },
  {
    id: "major_finance",
    label: "Tài chính lớn",
    riskLevel: "high",
    guidanceTone: "Không khuyên đầu tư. Nhắc tham khảo chuyên gia tài chính.",
  },
  {
    id: "health",
    label: "Sức khỏe",
    riskLevel: "high",
    guidanceTone: "Không luận bệnh. Chỉ gợi ý tự quan sát và khuyên đi khám khi cần.",
  },
  {
    id: "travel",
    label: "Di chuyển / đi xa",
    riskLevel: "medium",
    guidanceTone: "Tập trung vào chuẩn bị, an toàn và thời điểm.",
  },
  {
    id: "lost_item",
    label: "Tìm đồ / tìm người",
    riskLevel: "medium",
    guidanceTone: "Chỉ gợi ý hướng quan sát, không khẳng định vị trí.",
  },
  {
    id: "choice",
    label: "Lựa chọn giữa hai phương án",
    riskLevel: "medium",
    guidanceTone: "Gợi ý so sánh hai phương án, không quyết định thay.",
  },
  {
    id: "timing",
    label: "Thời điểm nên hay chưa nên",
    riskLevel: "medium",
    guidanceTone: "Quan sát thời điểm và điều kiện chín muồi.",
  },
  {
    id: "reflection",
    label: "Tự phản tư / tâm trạng",
    riskLevel: "low",
    guidanceTone: "Gợi ý quan sát tâm thế và phản ứng bên trong.",
  },
  {
    id: "other",
    label: "Khác",
    riskLevel: "medium",
    guidanceTone: "Giữ diễn giải thận trọng theo bối cảnh người dùng nhập.",
  },
];

export function getQuestionTypeById(id: string): QuestionType | undefined {
  return questionTypes.find(q => q.id === id);
}
