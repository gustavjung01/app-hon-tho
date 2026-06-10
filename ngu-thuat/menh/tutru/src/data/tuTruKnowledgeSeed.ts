export type KnowledgeStatus = "candidate" | "needs_review" | "restricted" | "rejected";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface GlossarySeedItem {
  id: string;
  termVi: string;
  termEn: string;
  shortDefinition: string;
  relatedTerms: string[];
  sourceCandidates: string[];
  confidence: ConfidenceLevel;
  status: "candidate";
}

export interface RuleSeedItem {
  id: string;
  topic: string;
  ruleName: string;
  condition: string;
  meaningShort: string;
  sourceCandidates: string[];
  confidence: ConfidenceLevel;
  status: "candidate" | "needs_review";
}

export interface TopicMapSeedItem {
  id: string;
  label: string;
  relatedSourceIds: string[];
  strongSourceIds: string[];
  weakSourceIds: string[];
  needsVerificationSourceIds: string[];
  status: "candidate";
}

export interface LicenseBucketSeedItem {
  id: string;
  label: string;
  policySummary: string;
  sourceIds: string[];
  status: KnowledgeStatus;
}

export interface LicenseGuardrailSeedItem {
  id: string;
  trigger: string;
  action: string;
  status: "candidate";
}

// Controlled phase-1 seed only. This file is not wired into the current UI.
// It is derived from the filtered research pack items listed in
// research/tu-tru_data_research_processed_pack/07_PROMPT_CHUYEN_THANH_DATA_SEED.txt
// and keeps non-approved material in candidate or needs_review state.
export const glossaryTerms: GlossarySeedItem[] = [
  {
    id: "gls_thien_can",
    termVi: "Thien Can",
    termEn: "Heavenly Stems",
    shortDefinition: "The ten stem symbols used in the sexagenary cycle.",
    relatedTerms: ["Dia Chi", "Can Chi", "Tu Tru"],
    sourceCandidates: ["ENG-003", "ENG-007", "RUL-004", "RUL-005"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_dia_chi",
    termVi: "Dia Chi",
    termEn: "Earthly Branches",
    shortDefinition: "The twelve branch symbols paired with Heavenly Stems in the sexagenary cycle.",
    relatedTerms: ["Thien Can", "Can Chi", "Tang Can"],
    sourceCandidates: ["ENG-003", "ENG-007", "RUL-002", "RUL-005"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_can_chi",
    termVi: "Can Chi",
    termEn: "Stem-Branch; Sexagenary Cycle",
    shortDefinition: "The paired stem-branch cycle of sixty combinations used for year, month, day, and time notation.",
    relatedTerms: ["Thien Can", "Dia Chi", "Luc thap hoa giap"],
    sourceCandidates: ["ENG-003", "ENG-007", "RUL-004"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_tiet_khi",
    termVi: "Tiet khi",
    termEn: "Solar Terms",
    shortDefinition: "The twenty-four annual solar markers used in Chinese calendrical segmentation.",
    relatedTerms: ["Lich phap", "Tru thang", "Lap Xuan"],
    sourceCandidates: ["ENG-001", "ENG-002", "ENG-008"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_tu_tru",
    termVi: "Tu Tru",
    termEn: "Four Pillars",
    shortDefinition: "A chart model using year, month, day, and hour pillars, each expressed as a stem-branch pair.",
    relatedTerms: ["Bat tu", "Tru nam", "Tru thang", "Tru ngay", "Tru gio"],
    sourceCandidates: ["ENG-021", "BOOK-001", "BOOK-002", "CASE-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_bat_tu",
    termVi: "Bat tu",
    termEn: "Eight Characters; BaZi",
    shortDefinition: "The eight characters formed by the four pillars in a stem-branch chart.",
    relatedTerms: ["Tu Tru", "Can Chi"],
    sourceCandidates: ["CASE-003", "CASE-004", "BOOK-001"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_ngu_hanh",
    termVi: "Ngu hanh",
    termEn: "Five Phases",
    shortDefinition: "The five-phase framework commonly rendered in English as Wood, Fire, Earth, Metal, and Water.",
    relatedTerms: ["Am duong", "Vuong suy", "Thap than"],
    sourceCandidates: ["BOOK-001", "BOOK-003", "BOOK-012"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_am_duong",
    termVi: "Am duong",
    termEn: "Yin-Yang",
    shortDefinition: "The binary polarity framework used across stems, branches, and five-phase relationships.",
    relatedTerms: ["Ngu hanh", "Thien Can", "Dia Chi"],
    sourceCandidates: ["BOOK-003", "RUL-005"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "gls_nhat_chu",
    termVi: "Nhat chu",
    termEn: "Day Master",
    shortDefinition: "A label used in many Bazi schools for the day stem as the chart reference stem.",
    relatedTerms: ["Tru ngay", "Thap than"],
    sourceCandidates: ["RUL-010", "CASE-004", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_thap_than",
    termVi: "Thap than",
    termEn: "Ten Gods",
    shortDefinition: "A relationship classification system derived from the interaction between the reference day stem and other stems.",
    relatedTerms: ["Nhat chu", "Ngu hanh", "Tang Can"],
    sourceCandidates: ["RUL-007", "RUL-009", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_tang_can",
    termVi: "Tang can",
    termEn: "Hidden Stems",
    shortDefinition: "Stems traditionally assigned within each Earthly Branch in many Bazi lineages.",
    relatedTerms: ["Dia Chi", "Thap than"],
    sourceCandidates: ["RUL-006", "RUL-008", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_hop",
    termVi: "Hop",
    termEn: "Combination",
    shortDefinition: "A relationship label used for certain stem or branch pairings in classical rule systems.",
    relatedTerms: ["Xung", "Hinh", "Hai", "Pha"],
    sourceCandidates: ["BOOK-001", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_xung",
    termVi: "Xung",
    termEn: "Clash",
    shortDefinition: "A relationship label used for opposing stem or branch interactions in classical rule systems.",
    relatedTerms: ["Hop", "Hinh", "Hai", "Pha"],
    sourceCandidates: ["BOOK-001", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_hinh",
    termVi: "Hinh",
    termEn: "Punishment",
    shortDefinition: "A classical interaction label applied to specific branch configurations.",
    relatedTerms: ["Hop", "Xung", "Hai"],
    sourceCandidates: ["BOOK-001", "BOOK-003"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_hai",
    termVi: "Hai",
    termEn: "Harm",
    shortDefinition: "A classical interaction label for certain branch relationships.",
    relatedTerms: ["Hop", "Xung", "Hinh", "Pha"],
    sourceCandidates: ["BOOK-001"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_pha",
    termVi: "Pha",
    termEn: "Break; Destruction",
    shortDefinition: "A relationship label used in some branch interaction schemes.",
    relatedTerms: ["Hop", "Xung", "Hai"],
    sourceCandidates: ["BOOK-003", "RUL-007"],
    confidence: "low",
    status: "candidate"
  },
  {
    id: "gls_truong_sinh",
    termVi: "Truong sinh muoi hai cung",
    termEn: "Twelve Stages of Growth",
    shortDefinition: "A twelve-stage vitality sequence used in some classical and later Bazi analyses.",
    relatedTerms: ["Vuong suy", "Ngu hanh"],
    sourceCandidates: ["BOOK-001", "BOOK-004"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_vuong_suy",
    termVi: "Vuong suy",
    termEn: "Prosperity and decline; strength state",
    shortDefinition: "A chart-strength vocabulary for judging relative seasonal or structural support.",
    relatedTerms: ["Ngu hanh", "Truong sinh muoi hai cung"],
    sourceCandidates: ["BOOK-001", "BOOK-003", "BOOK-004"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_dai_van",
    termVi: "Dai van",
    termEn: "Major Luck Cycle; Ten-Year Luck Pillar",
    shortDefinition: "A long-cycle pillar sequence used in many Bazi systems for temporal layering.",
    relatedTerms: ["Luu nien", "Tu Tru"],
    sourceCandidates: ["BOOK-001", "ENG-003", "ENG-020"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_luu_nien",
    termVi: "Luu nien",
    termEn: "Annual Influence; Annual Cycle",
    shortDefinition: "The year-by-year temporal layer commonly compared against a natal chart.",
    relatedTerms: ["Dai van", "Can Chi nam"],
    sourceCandidates: ["BOOK-001", "ENG-003", "ENG-020"],
    confidence: "medium",
    status: "candidate"
  },
  {
    id: "gls_dung_than",
    termVi: "Dung than",
    termEn: "Useful God; Functional Reference",
    shortDefinition: "A school-dependent selecting concept used to identify a chart key balancing or functional factor.",
    relatedTerms: ["Hy than", "Ky than", "Vuong suy"],
    sourceCandidates: ["BOOK-003", "RUL-008"],
    confidence: "low",
    status: "candidate"
  }
];

export const rulesCandidate: RuleSeedItem[] = [
  {
    id: "rule_calendar_new_moon_month_start",
    topic: "Lich phap",
    ruleName: "Chinese lunar month starts on the day containing the astronomical conjunction",
    condition: "When computing month boundaries in the modern Chinese calendar",
    meaningShort: "Use new moon or conjunction as month start",
    sourceCandidates: ["ENG-006", "ENG-015"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_calendar_month11_winter_solstice",
    topic: "Lich phap",
    ruleName: "Month 11 contains winter solstice",
    condition: "When numbering months within a sui",
    meaningShort: "Winter-solstice month is month 11",
    sourceCandidates: ["ENG-006", "ENG-015"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_calendar_leap_month_no_major_term",
    topic: "Lich phap",
    ruleName: "Leap month is the first month without a major solar term",
    condition: "If a sui contains 13 lunar months",
    meaningShort: "First month lacking a major term becomes leap month",
    sourceCandidates: ["ENG-006", "ENG-015"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_calendar_new_year_second_regular_month",
    topic: "Lich phap",
    ruleName: "Chinese New Year is the first day of the second regular month after month 11",
    condition: "Modern Chinese calendar year computation",
    meaningShort: "Year starts at the second regular month after month 11",
    sourceCandidates: ["ENG-006", "ENG-015"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_ganzhi_parity_pairing",
    topic: "Can Chi",
    ruleName: "Valid stem-branch pairings preserve parity",
    condition: "When constructing 60 combinations",
    meaningShort: "Only same-parity stem and branch pairings occur",
    sourceCandidates: ["ENG-003", "ENG-007", "ENG-022"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_hour_branch_double_hour",
    topic: "Tu Tru",
    ruleName: "Hour branch follows the twelve double-hour system",
    condition: "When assigning hour branch from local birth time",
    meaningShort: "Map civil or solar time into 12 branch-based two-hour blocks",
    sourceCandidates: ["ENG-003"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_hour_stem_from_day_stem",
    topic: "Tu Tru",
    ruleName: "Hour stem derives from day stem plus hour branch table",
    condition: "After day stem and hour branch are known",
    meaningShort: "Use a canonical lookup table to derive the hour stem",
    sourceCandidates: ["ENG-003"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_day_pillar_from_continuous_day_cycle",
    topic: "Tu Tru",
    ruleName: "Day pillar follows the continuous sexagenary day cycle",
    condition: "Given a fixed day-count system and timezone convention",
    meaningShort: "Compute day pillar from continuous day indexing",
    sourceCandidates: ["ENG-007", "ENG-009"],
    confidence: "high",
    status: "candidate"
  },
  {
    id: "rule_year_pillar_boundary_lichun",
    topic: "Tu Tru",
    ruleName: "Many Bazi engines use Lap Xuan rather than lunar new year for year pillar boundary",
    condition: "When assigning the natal year pillar in Bazi-specific logic",
    meaningShort: "Year-pillar boundary may be solar-term-based, not festival-based",
    sourceCandidates: ["ENG-001", "ENG-021", "CASE-003"],
    confidence: "low",
    status: "needs_review"
  },
  {
    id: "rule_month_pillar_by_solar_terms",
    topic: "Tu Tru",
    ruleName: "Month pillar in many Bazi systems follows solar-term segmentation",
    condition: "When assigning natal month pillar",
    meaningShort: "Month pillar may follow solar-term boundaries rather than lunar month names",
    sourceCandidates: ["ENG-001", "ENG-021", "CASE-004"],
    confidence: "medium",
    status: "needs_review"
  },
  {
    id: "rule_hidden_stems_branch_table",
    topic: "Tang can",
    ruleName: "Each Earthly Branch carries a conventional hidden-stem table",
    condition: "When expanding branch content in a chart",
    meaningShort: "Assign embedded stems per branch using a canonical table",
    sourceCandidates: ["BOOK-003", "RUL-006", "RUL-008"],
    confidence: "medium",
    status: "needs_review"
  },
  {
    id: "rule_ten_gods_from_day_master_relation",
    topic: "Thap than",
    ruleName: "Ten Gods classification is based on relation to the day stem",
    condition: "After day stem and comparison stem are known",
    meaningShort: "Classify by five-phase relation plus polarity",
    sourceCandidates: ["BOOK-003", "RUL-007", "RUL-009"],
    confidence: "medium",
    status: "needs_review"
  },
  {
    id: "rule_branch_interaction_sets",
    topic: "Hop xung hinh hai pha",
    ruleName: "Branch interaction labels exist as combination, clash, punishment, harm, and break sets",
    condition: "When scanning chart relationships",
    meaningShort: "Interaction tables exist, but activation logic varies by lineage",
    sourceCandidates: ["BOOK-001", "BOOK-003"],
    confidence: "medium",
    status: "needs_review"
  },
  {
    id: "rule_twelve_growth_stages",
    topic: "Vuong suy",
    ruleName: "Twelve growth stages are used as a vitality sequence in some lineages",
    condition: "When evaluating support or decline states",
    meaningShort: "Use the twelve-stage sequence only after lineage review",
    sourceCandidates: ["BOOK-001", "BOOK-004"],
    confidence: "medium",
    status: "needs_review"
  },
  {
    id: "rule_dayun_direction_school_variation",
    topic: "Dai van",
    ruleName: "Direction of major luck cycles varies by school formula",
    condition: "When determining forward or backward cycle flow",
    meaningShort: "Do not hard-code direction until the target lineage is fixed",
    sourceCandidates: ["BOOK-001", "CASE-001", "CASE-003"],
    confidence: "low",
    status: "needs_review"
  },
  {
    id: "rule_dayun_start_age_interval_method",
    topic: "Dai van",
    ruleName: "Start age of major luck cycles may be computed from interval to nearby solar-term boundary",
    condition: "When deriving the first cycle start age",
    meaningShort: "Method appears in practice but still needs lineage-specific adjudication",
    sourceCandidates: ["BOOK-001", "CASE-001", "ENG-001"],
    confidence: "low",
    status: "needs_review"
  },
  {
    id: "rule_yongshen_school_specific",
    topic: "Dung than",
    ruleName: "Useful-god selection is school-specific and should not be auto-promoted to core",
    condition: "Whenever source material presents a preferred useful element or factor",
    meaningShort: "Keep as comparative doctrine until conflict review is complete",
    sourceCandidates: ["BOOK-003", "RUL-008"],
    confidence: "low",
    status: "needs_review"
  }
];

export const topicMap: TopicMapSeedItem[] = [
  {
    id: "topic_lich_phap",
    label: "Lich phap",
    relatedSourceIds: ["ENG-001", "ENG-002", "ENG-004", "ENG-005", "ENG-006", "ENG-008", "ENG-012", "ENG-013", "ENG-014", "ENG-015", "ENG-018", "ENG-019", "ENG-020", "ENG-022"],
    strongSourceIds: ["ENG-002", "ENG-004", "ENG-006", "ENG-012", "ENG-013", "ENG-015"],
    weakSourceIds: ["ENG-018", "ENG-019", "ENG-020", "ENG-022"],
    needsVerificationSourceIds: ["ENG-016", "ENG-021"],
    status: "candidate"
  },
  {
    id: "topic_can_chi",
    label: "Can Chi",
    relatedSourceIds: ["ENG-003", "ENG-007", "ENG-009", "RUL-001", "RUL-002", "RUL-004", "RUL-005", "ENG-022"],
    strongSourceIds: ["ENG-003", "ENG-007", "RUL-005"],
    weakSourceIds: ["RUL-004", "RUL-002", "ENG-022"],
    needsVerificationSourceIds: ["RUL-001"],
    status: "candidate"
  },
  {
    id: "topic_tu_tru",
    label: "Tu Tru",
    relatedSourceIds: ["ENG-003", "ENG-017", "ENG-020", "ENG-021", "BOOK-001", "BOOK-002", "BOOK-003", "BOOK-004", "CASE-001", "CASE-003", "CASE-004"],
    strongSourceIds: ["BOOK-001", "BOOK-002", "BOOK-003", "BOOK-004"],
    weakSourceIds: ["ENG-020", "ENG-021", "CASE-003", "CASE-004"],
    needsVerificationSourceIds: ["ENG-017"],
    status: "candidate"
  },
  {
    id: "topic_ngu_hanh",
    label: "Ngu hanh",
    relatedSourceIds: ["BOOK-001", "BOOK-003", "BOOK-004", "RUL-007", "RUL-009", "BOOK-012"],
    strongSourceIds: ["BOOK-001", "BOOK-003", "BOOK-004"],
    weakSourceIds: ["RUL-007", "RUL-009"],
    needsVerificationSourceIds: ["BOOK-012"],
    status: "candidate"
  },
  {
    id: "topic_thap_than",
    label: "Thap than",
    relatedSourceIds: ["BOOK-002", "BOOK-003", "ENG-020", "RUL-007", "RUL-009", "CASE-003"],
    strongSourceIds: ["BOOK-003"],
    weakSourceIds: ["RUL-007", "RUL-009", "CASE-003"],
    needsVerificationSourceIds: ["ENG-020"],
    status: "candidate"
  },
  {
    id: "topic_tang_can",
    label: "Tang can",
    relatedSourceIds: ["BOOK-003", "RUL-006", "RUL-008", "ENG-003"],
    strongSourceIds: ["BOOK-003", "ENG-003"],
    weakSourceIds: ["RUL-006", "RUL-008"],
    needsVerificationSourceIds: ["ENG-020", "ENG-021"],
    status: "candidate"
  },
  {
    id: "topic_branch_interactions",
    label: "Hop xung hinh hai pha",
    relatedSourceIds: ["BOOK-001", "BOOK-003", "ENG-003", "RUL-007"],
    strongSourceIds: ["BOOK-001", "BOOK-003", "ENG-003"],
    weakSourceIds: ["RUL-007"],
    needsVerificationSourceIds: ["ENG-020"],
    status: "candidate"
  },
  {
    id: "topic_vuong_suy",
    label: "Vuong suy",
    relatedSourceIds: ["BOOK-001", "BOOK-003", "BOOK-004", "RUL-008"],
    strongSourceIds: ["BOOK-001", "BOOK-003", "BOOK-004"],
    weakSourceIds: ["RUL-008"],
    needsVerificationSourceIds: ["CASE-003"],
    status: "candidate"
  },
  {
    id: "topic_dai_van",
    label: "Dai van",
    relatedSourceIds: ["BOOK-001", "ENG-003", "ENG-020", "ENG-021", "CASE-001"],
    strongSourceIds: ["BOOK-001"],
    weakSourceIds: ["ENG-020", "ENG-021"],
    needsVerificationSourceIds: ["CASE-001"],
    status: "candidate"
  },
  {
    id: "topic_luu_nien",
    label: "Luu nien",
    relatedSourceIds: ["BOOK-001", "ENG-003", "ENG-020", "RUL-007", "CASE-001"],
    strongSourceIds: ["BOOK-001", "ENG-003"],
    weakSourceIds: ["ENG-020", "RUL-007"],
    needsVerificationSourceIds: ["CASE-001"],
    status: "candidate"
  },
  {
    id: "topic_sources_books",
    label: "Dan nguon sach",
    relatedSourceIds: ["BOOK-001", "BOOK-002", "BOOK-003", "BOOK-004", "BOOK-005", "BOOK-006", "BOOK-007", "BOOK-008", "BOOK-009", "BOOK-010", "BOOK-011", "BOOK-012", "BOOK-013", "BOOK-014"],
    strongSourceIds: ["BOOK-001", "BOOK-002", "BOOK-003", "BOOK-004", "BOOK-005", "BOOK-007"],
    weakSourceIds: ["BOOK-009", "BOOK-010", "BOOK-011", "BOOK-012", "BOOK-013", "BOOK-014"],
    needsVerificationSourceIds: ["BOOK-006", "BOOK-008"],
    status: "candidate"
  }
];

export const licenseReviewBuckets: LicenseBucketSeedItem[] = [
  {
    id: "lic_direct_use_after_review",
    label: "Can be used more directly after attribution and legal review",
    policySummary: "Keep in a separate legal bucket until downstream architecture and provenance are reviewed.",
    sourceIds: ["ENG-012", "ENG-013", "ENG-014", "RUL-005", "ENG-017", "ENG-018", "ENG-019", "ENG-020", "ENG-021"],
    status: "needs_review"
  },
  {
    id: "lic_internal_reference_only",
    label: "Internal reference only",
    policySummary: "Use for comparison and research notes only. Do not publish long excerpts or embed raw text in the app.",
    sourceIds: ["ENG-001", "ENG-002", "ENG-003", "ENG-004", "RUL-001", "ENG-005", "ENG-006", "ENG-007", "ENG-008", "ENG-009", "ENG-010", "ENG-011", "BOOK-001", "BOOK-002", "BOOK-003", "BOOK-004", "BOOK-009", "BOOK-010", "BOOK-011", "BOOK-012", "BOOK-013", "BOOK-014", "CASE-001", "CASE-002", "CASE-003", "CASE-004"],
    status: "restricted"
  },
  {
    id: "lic_short_quote_only",
    label: "Short quotation only when rights and provenance are clear",
    policySummary: "Short excerpts may be considered only after confirming the edition, rights, and provenance.",
    sourceIds: ["BOOK-005", "BOOK-006", "BOOK-007", "BOOK-008"],
    status: "needs_review"
  },
  {
    id: "lic_needs_permission",
    label: "Needs permission or explicit legal review before substantial reuse",
    policySummary: "Do not reuse substantial content until permission or explicit legal review is completed.",
    sourceIds: ["ENG-015", "BOOK-009", "BOOK-010", "BOOK-011", "BOOK-012", "BOOK-013", "BOOK-014", "CASE-001", "CASE-003", "CASE-004"],
    status: "needs_review"
  },
  {
    id: "lic_rejected",
    label: "Should be removed from the pipeline",
    policySummary: "Reject provenance-unclear mirrors, marketing calculators, and unclear uploads.",
    sourceIds: ["REJ-001", "REJ-002", "REJ-003", "REJ-004", "REJ-005"],
    status: "rejected"
  }
];

export const licenseGuardrails: LicenseGuardrailSeedItem[] = [
  {
    id: "lic_guardrail_open_share_alike",
    trigger: "Source is open but share-alike",
    action: "Keep it in a separate legal bucket until downstream obligations are reviewed.",
    status: "candidate"
  },
  {
    id: "lic_guardrail_public_restricted",
    trigger: "Source is public but site-rights-restricted",
    action: "Use as internal reference only.",
    status: "candidate"
  },
  {
    id: "lic_guardrail_copyrighted_book",
    trigger: "Source is a copyrighted book or translated edition",
    action: "Catalog metadata only; do not ingest substantial text.",
    status: "candidate"
  },
  {
    id: "lic_guardrail_unclear_upload",
    trigger: "Source is an unclear upload or mirror",
    action: "Reject it from the pipeline.",
    status: "candidate"
  }
];

export const tuTruKnowledgeSeed = {
  meta: {
    sourcePackPath: "research/tu-tru_data_research_processed_pack",
    derivedFrom: [
      "02_topic_map.md",
      "03_license_review.md",
      "05_glossary_seed.json",
      "06_rules_candidate.json",
      "07_PROMPT_CHUYEN_THANH_DATA_SEED.txt"
    ],
    uiIntegrated: false,
    approvedCorePromoted: false
  },
  glossaryTerms,
  rulesCandidate,
  topicMap,
  licenseReviewBuckets,
  licenseGuardrails
} as const;

