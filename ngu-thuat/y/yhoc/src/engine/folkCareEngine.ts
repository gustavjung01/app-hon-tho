import type {
  FolkCareItem,
  FolkCareFilterOptions,
  FolkCareResult,
  SensitiveGroup,
  SafetyLevel,
  RedFlagType,
} from '../data/yhoc/folkCareTypes';
import { FOLK_CARE_ITEMS } from '../data/yhoc/folkCare';
import { FOLK_CARE_RED_FLAGS, EMERGENCY_MESSAGE, SENSITIVE_GROUP_WARNING } from '../data/yhoc/folkCareSafety';

/**
 * Lọc folk care items theo các tiêu chí
 */
export function filterFolkCare(options: FolkCareFilterOptions): FolkCareResult {
  // Nếu có red flag, trả về emergency
  if (options.hasRedFlag) {
    return {
      items: [],
      emergencyWarning: EMERGENCY_MESSAGE,
    };
  }

  let items = [...FOLK_CARE_ITEMS];

  // Lọc theo search term
  if (options.searchTerm && options.searchTerm.trim()) {
    const term = options.searchTerm.toLowerCase().trim();
    items = items.filter((item) => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.situation.toLowerCase().includes(term) ||
        item.commonSigns.some((s) => s.toLowerCase().includes(term)) ||
        item.category.toLowerCase().includes(term)
      );
    });
  }

  // Lọc theo category
  if (options.category && options.category !== 'all') {
    items = items.filter((item) => item.category === options.category);
  }

  // Kiểm tra nhóm nhạy cảm
  const hasSensitiveGroup = options.sensitiveGroups && options.sensitiveGroups.length > 0;
  
  // Lọc theo safety level
  items = items.filter((item) => {
    // Nếu safety level = high, chỉ hiện khi không có red flag (đã check ở trên)
    if (item.safetyLevel === 'high') {
      // Với nhóm nhạy cảm, ẩn các item high safety có nguyên liệu dân gian
      if (hasSensitiveGroup && item.hasFolkIngredients) {
        return false;
      }
    }
    return true;
  });

  // Nếu là nhóm nhạy cảm, cảnh báo là đã filter
  const filteredDueToSensitive = hasSensitiveGroup && 
    FOLK_CARE_ITEMS.some(item => item.hasFolkIngredients && !items.includes(item));

  return {
    items,
    filteredDueToSensitive,
  };
}

/**
 * Kiểm tra xem item có nên hiển thị folk notes không
 */
export function shouldShowFolkNotes(
  item: FolkCareItem,
  sensitiveGroups: SensitiveGroup[]
): boolean {
  // Nếu item không có folk ingredients, hiển thị bình thường
  if (!item.hasFolkIngredients) return true;

  // Nếu user thuộc nhóm nhạy cảm, ẩn folk notes
  if (sensitiveGroups && sensitiveGroups.length > 0) {
    return false;
  }

  return true;
}

/**
 * Lấy thông báo cho nhóm nhạy cảm
 */
export function getSensitiveWarning(): string {
  return SENSITIVE_GROUP_WARNING;
}

/**
 * Lấy danh sách red flags
 */
export function getRedFlags() {
  return FOLK_CARE_RED_FLAGS;
}

/**
 * Kiểm tra nếu có bất kỳ red flag nào được chọn
 */
export function hasRedFlag(selectedFlags: RedFlagType[]): boolean {
  return selectedFlags && selectedFlags.length > 0;
}

/**
 * Lấy tất cả folk care items (không filter)
 */
export function getAllFolkCare(): FolkCareItem[] {
  return FOLK_CARE_ITEMS;
}

/**
 * Lấy folk care item theo ID
 */
export function getFolkCareById(id: string): FolkCareItem | undefined {
  return FOLK_CARE_ITEMS.find((item) => item.id === id);
}

/**
 * Gợi ý folk care liên quan dựa trên pattern y học cổ truyền
 */
export function suggestFolkCareByPattern(patternIds: string[]): FolkCareItem[] {
  const suggestions: FolkCareItem[] = [];

  // Mapping pattern -> folk care suggestions
  const patternMappings: Record<string, string[]> = {
    // Khí hư / Dương hư
    'khihut': ['cold_hands_feet', 'tired_after_work', 'tired_after_staying_up', 'body_heavy_damp', 'fatigue_humid_season', 'tired_after_poor_sleep'],
    // Tỳ vị hư / Đàm thấp
    'tyvihu': ['bloated_after_eating', 'poor_digestion', 'body_heavy_damp', 'weak_digestion', 'poor_appetite_few_days'],
    // Can khí uất / Khí trệ
    'cankhiuat': ['mild_stress', 'overthinking', 'light_insomnia', 'mild_restlessness', 'hard_to_relax_evening', 'waking_up_often'],
    // Âm hư / Táo
    'amhu': ['dry_throat_mild', 'dry_mouth', 'dry_skin_mild', 'inner_heat_mild', 'chapped_lips_mild', 'thirsty_after_late_night'],
    // Thấp nhiệt
    'thapnhiet': ['inner_heat_mild', 'bitter_mouth_oily', 'body_heavy_damp', 'irritable_hot_weather', 'heavy_body_oily_food'],
  };

  for (const patternId of patternIds) {
    const mappedIds = patternMappings[patternId] || [];
    for (const folkId of mappedIds) {
      const item = getFolkCareById(folkId);
      if (item && !suggestions.find((s) => s.id === item.id)) {
        suggestions.push(item);
      }
    }
  }

  // Trả về tối đa 5 gợi ý
  return suggestions.slice(0, 5);
}

/**
 * Kiểm tra safety level của item
 */
export function getSafetyLevelLabel(level: SafetyLevel): string {
  const labels: Record<SafetyLevel, string> = {
    safe: 'An toàn',
    moderate: 'Cần thận trọng',
    high: 'Hỏi bác sĩ trước',
  };
  return labels[level] || level;
}

/**
 * Format item để hiển thị (xoá folk notes nếu cần)
 */
export function formatFolkCareForDisplay(
  item: FolkCareItem,
  sensitiveGroups: SensitiveGroup[]
): FolkCareItem & { showFolkNotes: boolean } {
  return {
    ...item,
    showFolkNotes: shouldShowFolkNotes(item, sensitiveGroups),
  };
}

// Re-export types
export type { FolkCareItem, SensitiveGroup, RedFlagType, SafetyLevel } from '../data/yhoc/folkCareTypes';
