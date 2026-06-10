export type SafetyLevel = 'safe' | 'moderate' | 'high';

export interface FolkCareItem {
  id: string;
  title: string;
  situation: string;
  commonSigns: string[];
  safeCare: string[];
  folkNotes?: string[];
  foodLifestyleNotes: string[];
  avoid: string[];
  notFor: string[];
  whenToSeeDoctor: string[];
  redFlags: string[];
  safetyLevel: SafetyLevel;
  category: string;
  hasFolkIngredients: boolean;
}

export type SensitiveGroup = 
  | 'pregnant' 
  | 'breastfeeding' 
  | 'elderly' 
  | 'children' 
  | 'chronicCondition' 
  | 'longTermMeds';

export interface FolkCareFilterOptions {
  searchTerm?: string;
  category?: string | 'all';
  sensitiveGroups?: SensitiveGroup[];
  hasRedFlag?: boolean;
}

export interface FolkCareResult {
  items: FolkCareItem[];
  emergencyWarning?: string;
  filteredDueToSensitive?: boolean;
}

export type RedFlagType = 
  | 'fever_high'
  | 'breathing_difficulty'
  | 'chest_pain'
  | 'severe_abdominal_pain'
  | 'vomiting_blood'
  | 'bloody_stool'
  | 'fainting'
  | 'seizure'
  | 'self_harm_thoughts';
