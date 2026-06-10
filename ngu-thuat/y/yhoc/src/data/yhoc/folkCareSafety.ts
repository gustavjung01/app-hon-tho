import type { RedFlagType } from './folkCareTypes';

export interface FolkCareRedFlag {
  id: RedFlagType;
  label: string;
  message: string;
  severity: 'critical' | 'urgent' | 'warning';
}

export const FOLK_CARE_RED_FLAGS: FolkCareRedFlag[] = [
  {
    id: 'fever_high',
    label: 'Sốt cao',
    message: 'Sốt cao cần được đánh giá y tế, không tự xử lý bằng mẹo dân gian.',
    severity: 'critical',
  },
  {
    id: 'breathing_difficulty',
    label: 'Khó thở',
    message: 'Khó thở là dấu hiệu cần được chăm sóc y tế ngay.',
    severity: 'critical',
  },
  {
    id: 'chest_pain',
    label: 'Đau ngực',
    message: 'Đau ngực cần được đánh giá y tế khẩn cấp.',
    severity: 'critical',
  },
  {
    id: 'severe_abdominal_pain',
    label: 'Đau bụng dữ dội',
    message: 'Đau bụng dữ dội cần đi khám ngay, không tự xử lý.',
    severity: 'critical',
  },
  {
    id: 'vomiting_blood',
    label: 'Nôn ra máu',
    message: 'Nôn ra máu là dấu hiệu nguy hiểm, cần cấp cứu.',
    severity: 'critical',
  },
  {
    id: 'bloody_stool',
    label: 'Đi cầu ra máu',
    message: 'Đi cầu ra máu cần được đánh giá y tế khẩn cấp.',
    severity: 'critical',
  },
  {
    id: 'fainting',
    label: 'Ngất',
    message: 'Ngất xỉu cần được đánh giá y tế ngay.',
    severity: 'critical',
  },
  {
    id: 'seizure',
    label: 'Co giật',
    message: 'Co giật là dấu hiệu khẩn cấp, cần gọi cấp cứu.',
    severity: 'critical',
  },
  {
    id: 'self_harm_thoughts',
    label: 'Ý nghĩ tự hại',
    message: 'Nếu có ý nghĩ tự hại, hãy liên hệ ngay với chuyên gia tâm lý hoặc đường dây nóng hỗ trợ.',
    severity: 'critical',
  },
];

export const EMERGENCY_MESSAGE = `Có dấu hiệu cần được đánh giá y tế. 
Vui lòng không tự xử lý bằng mẹo dân gian; 
hãy liên hệ bác sĩ, cơ sở y tế hoặc cấp cứu tùy mức độ.`;

export const SENSITIVE_GROUPS = [
  { id: 'pregnant', label: 'Đang mang thai / cho con bú' },
  { id: 'children', label: 'Trẻ nhỏ' },
  { id: 'elderly', label: 'Người cao tuổi' },
  { id: 'chronicCondition', label: 'Có bệnh nền' },
  { id: 'longTermMeds', label: 'Đang dùng thuốc dài ngày' },
] as const;

export const SENSITIVE_GROUP_WARNING = `Với nhóm cần thận trọng, app không hiển thị mẹo dân gian có nguyên liệu. 
Bạn nên hỏi bác sĩ hoặc chuyên gia phù hợp.`;
