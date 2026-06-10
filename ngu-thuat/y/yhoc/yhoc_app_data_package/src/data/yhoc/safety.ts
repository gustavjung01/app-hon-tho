import type { SafetyWarning } from './types';

// Data package for /nguthuat/y/yhoc
// Nội dung tham khảo, không dùng để chẩn đoán, kê đơn hoặc tự điều trị.

export const SAFETY_WARNINGS: SafetyWarning[] = [
  {
    "id": "rf_chest_pain",
    "label": "Đau ngực",
    "severity": "emergency",
    "triggers": [
      "đau ngực",
      "tức ngực dữ dội"
    ],
    "message": "Đau ngực có thể là dấu hiệu cần được đánh giá y tế ngay.",
    "action": "Gọi cấp cứu hoặc đến cơ sở y tế gần nhất. Không dùng app để tự xử lý.",
    "blockInterpretation": true
  },
  {
    "id": "rf_breathing",
    "label": "Khó thở",
    "severity": "emergency",
    "triggers": [
      "khó thở",
      "thở gấp nặng"
    ],
    "message": "Khó thở là dấu hiệu nguy hiểm, cần ưu tiên an toàn y tế.",
    "action": "Liên hệ cấp cứu hoặc bác sĩ ngay.",
    "blockInterpretation": true
  },
  {
    "id": "rf_stroke_signs",
    "label": "Liệt mặt/tay/chân hoặc nói khó",
    "severity": "emergency",
    "triggers": [
      "liệt mặt",
      "yếu tay chân",
      "nói khó",
      "méo miệng"
    ],
    "message": "Dấu hiệu yếu/liệt hoặc nói khó cần được xử lý khẩn cấp.",
    "action": "Gọi cấp cứu ngay, không chờ kết quả app.",
    "blockInterpretation": true
  },
  {
    "id": "rf_fainting",
    "label": "Ngất",
    "severity": "urgent",
    "triggers": [
      "ngất",
      "mất ý thức"
    ],
    "message": "Ngất hoặc mất ý thức cần được đánh giá y tế.",
    "action": "Đến cơ sở y tế hoặc liên hệ bác sĩ ngay.",
    "blockInterpretation": true
  },
  {
    "id": "rf_seizure",
    "label": "Co giật",
    "severity": "emergency",
    "triggers": [
      "co giật"
    ],
    "message": "Co giật là dấu hiệu cần được hỗ trợ y tế khẩn cấp.",
    "action": "Gọi cấp cứu hoặc đến bệnh viện.",
    "blockInterpretation": true
  },
  {
    "id": "rf_high_fever",
    "label": "Sốt cao kéo dài",
    "severity": "urgent",
    "triggers": [
      "sốt cao kéo dài",
      "sốt không hạ"
    ],
    "message": "Sốt cao kéo dài không nên tự theo dõi bằng app.",
    "action": "Đi khám hoặc liên hệ bác sĩ.",
    "blockInterpretation": true
  },
  {
    "id": "rf_severe_abdominal_pain",
    "label": "Đau bụng dữ dội",
    "severity": "urgent",
    "triggers": [
      "đau bụng dữ dội"
    ],
    "message": "Đau bụng dữ dội có thể cần thăm khám sớm.",
    "action": "Đi khám/cấp cứu tùy mức độ.",
    "blockInterpretation": true
  },
  {
    "id": "rf_vomiting_blood",
    "label": "Nôn ra máu",
    "severity": "emergency",
    "triggers": [
      "nôn ra máu"
    ],
    "message": "Nôn ra máu là dấu hiệu nguy hiểm.",
    "action": "Đi cấp cứu ngay.",
    "blockInterpretation": true
  },
  {
    "id": "rf_blood_stool",
    "label": "Đi cầu ra máu",
    "severity": "urgent",
    "triggers": [
      "đi cầu ra máu",
      "phân đen"
    ],
    "message": "Máu trong phân hoặc phân đen cần được đánh giá y tế.",
    "action": "Đi khám sớm hoặc cấp cứu nếu nhiều/choáng.",
    "blockInterpretation": true
  },
  {
    "id": "rf_abnormal_bleeding",
    "label": "Chảy máu bất thường",
    "severity": "urgent",
    "triggers": [
      "chảy máu bất thường",
      "chảy máu không cầm"
    ],
    "message": "Chảy máu bất thường không nên tự xử lý theo cổ học.",
    "action": "Liên hệ bác sĩ hoặc đến cơ sở y tế.",
    "blockInterpretation": true
  },
  {
    "id": "rf_rapid_weight_loss",
    "label": "Sụt cân nhanh không rõ nguyên nhân",
    "severity": "medical",
    "triggers": [
      "sụt cân nhanh"
    ],
    "message": "Sụt cân nhanh không rõ nguyên nhân cần kiểm tra y tế.",
    "action": "Đặt lịch khám, không dùng app để kết luận.",
    "blockInterpretation": true
  },
  {
    "id": "rf_sudden_severe_headache",
    "label": "Đau đầu dữ dội đột ngột",
    "severity": "emergency",
    "triggers": [
      "đau đầu dữ dội đột ngột"
    ],
    "message": "Đau đầu dữ dội đột ngột là dấu hiệu cần chú ý khẩn cấp.",
    "action": "Đi cấp cứu hoặc liên hệ bác sĩ ngay.",
    "blockInterpretation": true
  },
  {
    "id": "rf_self_harm",
    "label": "Ý nghĩ tự hại",
    "severity": "emergency",
    "triggers": [
      "ý nghĩ tự hại",
      "muốn tự làm hại bản thân"
    ],
    "message": "Khi có ý nghĩ tự hại, cần được hỗ trợ ngay từ người thật và dịch vụ khẩn cấp.",
    "action": "Liên hệ người thân tin cậy, đường dây hỗ trợ khẩn cấp hoặc cơ sở y tế gần nhất.",
    "blockInterpretation": true
  },
  {
    "id": "rf_very_high_bp",
    "label": "Huyết áp rất cao nếu người dùng biết bệnh nền",
    "severity": "urgent",
    "triggers": [
      "huyết áp rất cao"
    ],
    "message": "Huyết áp rất cao cần xử lý theo hướng dẫn y tế, không theo app tham khảo.",
    "action": "Liên hệ bác sĩ/cấp cứu, đặc biệt nếu kèm đau ngực, khó thở, đau đầu, yếu liệt.",
    "blockInterpretation": true
  },
  {
    "id": "rf_glucose_extreme",
    "label": "Đường huyết quá cao/quá thấp nếu người dùng biết bệnh nền",
    "severity": "urgent",
    "triggers": [
      "đường huyết quá cao",
      "đường huyết quá thấp"
    ],
    "message": "Đường huyết quá cao hoặc quá thấp cần được xử lý y tế.",
    "action": "Làm theo kế hoạch bác sĩ đã hướng dẫn hoặc liên hệ cấp cứu nếu nặng.",
    "blockInterpretation": true
  },
  {
    "id": "rf_pregnancy_abnormal",
    "label": "Phụ nữ mang thai có bất thường",
    "severity": "urgent",
    "triggers": [
      "mang thai bất thường",
      "đau bụng thai kỳ",
      "ra máu thai kỳ"
    ],
    "message": "Bất thường trong thai kỳ cần ưu tiên khám y tế.",
    "action": "Liên hệ bác sĩ sản khoa hoặc cơ sở y tế.",
    "blockInterpretation": true
  },
  {
    "id": "rf_child_severe",
    "label": "Trẻ nhỏ có dấu hiệu nặng",
    "severity": "urgent",
    "triggers": [
      "trẻ nhỏ dấu hiệu nặng",
      "trẻ lừ đừ",
      "trẻ khó thở"
    ],
    "message": "Trẻ nhỏ có dấu hiệu nặng cần được thăm khám sớm.",
    "action": "Đưa trẻ đi khám/cấp cứu.",
    "blockInterpretation": true
  },
  {
    "id": "rf_dehydration_confusion",
    "label": "Lú lẫn, mất nước nặng hoặc yếu lả",
    "severity": "urgent",
    "triggers": [
      "lú lẫn",
      "mất nước nặng",
      "yếu lả"
    ],
    "message": "Lú lẫn, mất nước nặng hoặc yếu lả cần được đánh giá y tế.",
    "action": "Đi khám/cấp cứu tùy mức độ.",
    "blockInterpretation": true
  }
];
