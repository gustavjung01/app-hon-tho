export interface FolkCareCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const FOLK_CARE_CATEGORIES: FolkCareCategory[] = [
  {
    id: 'cold_weather',
    name: 'Cảm lạnh / thời tiết',
    description: 'Những khó chịu liên quan đến thay đổi thời tiết, gió lạnh',
    icon: '❄️',
  },
  {
    id: 'digestion',
    name: 'Tiêu hóa',
    description: 'Các tình huống ăn uống, đầy bụng, khó tiêu',
    icon: '🍽️',
  },
  {
    id: 'sleep_mind',
    name: 'Ngủ nghỉ / thần chí',
    description: 'Giấc ngủ, căng thẳng nhẹ, khó ngủ',
    icon: '😴',
  },
  {
    id: 'body_movement',
    name: 'Cơ xương / sinh hoạt',
    description: 'Mệt mỏi sau làm việc, căng cơ, sinh hoạt hàng ngày',
    icon: '🦴',
  },
  {
    id: 'hot_dry_damp',
    name: 'Nóng / khô / ẩm',
    description: 'Cảm giác nóng trong, khô họng, nặng người',
    icon: '🔥',
  },
  {
    id: 'women_family',
    name: 'Phụ nữ / gia đình',
    description: 'Các tình huống đặc thù phụ nữ và chăm sóc gia đình',
    icon: '👩',
  },
];

export const ALL_CATEGORIES_ID = 'all';
export const ALL_CATEGORIES_LABEL = 'Tất cả';
