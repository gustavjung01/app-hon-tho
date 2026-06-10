import type { Question } from './types';

// Data package for /nguthuat/y/yhoc
// Nội dung tham khảo, không dùng để chẩn đoán, kê đơn hoặc tự điều trị.

export const QUESTIONS: Question[] = [
  {
    "id": "q_age_range",
    "group": "general",
    "label": "Bạn thuộc nhóm tuổi nào?",
    "type": "single",
    "options": [
      {
        "id": "under_16",
        "label": "Dưới 16",
        "value": "under_16"
      },
      {
        "id": "16_24",
        "label": "16-24",
        "value": "16_24"
      },
      {
        "id": "25_44",
        "label": "25-44",
        "value": "25_44"
      },
      {
        "id": "45_64",
        "label": "45-64",
        "value": "45_64"
      },
      {
        "id": "65_plus",
        "label": "65+",
        "value": "65_plus"
      },
      {
        "id": "skip",
        "label": "Không muốn trả lời",
        "value": "skip"
      }
    ],
    "mapping": [],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_gender",
    "group": "general",
    "label": "Giới tính sinh học hoặc bối cảnh cơ thể bạn muốn app lưu ý?",
    "type": "single",
    "options": [
      {
        "id": "female",
        "label": "Nữ",
        "value": "female"
      },
      {
        "id": "male",
        "label": "Nam",
        "value": "male"
      },
      {
        "id": "other",
        "label": "Khác / không muốn nói",
        "value": "other"
      }
    ],
    "mapping": [],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_pregnancy_context",
    "group": "general",
    "label": "Bạn có đang mang thai hoặc nghi ngờ mang thai không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "safety_context"
    ],
    "reliability": "medium",
    "safetySensitive": true,
    "allowSkip": true
  },
  {
    "id": "q_known_condition",
    "group": "general",
    "label": "Bạn có bệnh nền hoặc đang dùng thuốc điều trị không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "safety_context"
    ],
    "reliability": "medium",
    "safetySensitive": true,
    "allowSkip": true
  },
  {
    "id": "q_sleep_quality",
    "group": "sleep",
    "label": "Giấc ngủ gần đây thế nào?",
    "type": "single",
    "options": [
      {
        "id": "good",
        "label": "Ngủ ổn",
        "value": "good"
      },
      {
        "id": "light",
        "label": "Ngủ nông, dễ tỉnh",
        "value": "light",
        "scoreHints": [
          "yin_deficiency",
          "blood_deficiency",
          "liver_qi_stagnation"
        ]
      },
      {
        "id": "hard_sleep",
        "label": "Khó vào giấc",
        "value": "hard_sleep",
        "scoreHints": [
          "liver_qi_stagnation",
          "yin_deficiency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency",
      "blood_deficiency",
      "liver_qi_stagnation"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_sleep_duration",
    "group": "sleep",
    "label": "Trung bình bạn ngủ khoảng mấy giờ mỗi đêm?",
    "type": "scale",
    "min": 0,
    "max": 12,
    "step": 0.5,
    "mapping": [
      "qi_deficiency",
      "yin_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_night_sweat",
    "group": "sleep",
    "label": "Bạn có hay ra mồ hôi ban đêm khi ngủ không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_energy_level",
    "group": "energy",
    "label": "Mức năng lượng ban ngày của bạn?",
    "type": "scale",
    "min": 0,
    "max": 10,
    "step": 1,
    "mapping": [
      "qi_deficiency",
      "yang_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_fatigue_after_activity",
    "group": "energy",
    "label": "Bạn có dễ mệt sau vận động nhẹ như đi bộ, leo cầu thang không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_deficiency",
      "yang_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_short_breath_exertion",
    "group": "energy",
    "label": "Khi vận động nhẹ, bạn có hụt hơi hoặc thở ngắn hơn thường lệ không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_deficiency",
      "lung_qi_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_voice_strength",
    "group": "energy",
    "label": "Giọng nói gần đây của bạn thế nào?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Bình thường",
        "value": "normal"
      },
      {
        "id": "weak",
        "label": "Nhỏ/yếu/ngại nói",
        "value": "weak",
        "scoreHints": [
          "qi_deficiency",
          "lung_qi_deficiency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_deficiency",
      "lung_qi_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_spontaneous_sweat",
    "group": "energy",
    "label": "Bạn có dễ ra mồ hôi dù không vận động nhiều không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_deficiency",
      "lung_qi_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_cold_sensation",
    "group": "hot_cold",
    "label": "Bạn có thường thấy dễ lạnh hơn người xung quanh không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yang_deficiency",
      "cold_tendency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_limb_cold",
    "group": "hot_cold",
    "label": "Tay chân có hay lạnh không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yang_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_prefer_warmth",
    "group": "hot_cold",
    "label": "Bạn có thích đồ ấm, nơi ấm, hoặc thấy dễ chịu hơn khi giữ ấm không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yang_deficiency",
      "cold_tendency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_heat_sensation",
    "group": "hot_cold",
    "label": "Bạn có cảm giác nóng trong, bứt rứt, nóng về chiều/tối không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency",
      "damp_heat"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_dry_mouth",
    "group": "thirst",
    "label": "Miệng/họng có hay khô không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency",
      "dryness_tendency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_thirst_preference",
    "group": "thirst",
    "label": "Khi khát, bạn thường thích uống gì?",
    "type": "single",
    "options": [
      {
        "id": "warm",
        "label": "Ấm/nóng",
        "value": "warm",
        "scoreHints": [
          "yang_deficiency",
          "cold_tendency"
        ]
      },
      {
        "id": "cool",
        "label": "Mát/lạnh",
        "value": "cool",
        "scoreHints": [
          "heat_tendency",
          "yin_deficiency"
        ]
      },
      {
        "id": "little",
        "label": "Ít khát",
        "value": "little"
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency",
      "yang_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_bitter_mouth",
    "group": "thirst",
    "label": "Bạn có hay thấy miệng đắng hoặc khó chịu vùng miệng không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "damp_heat",
      "liver_qi_stagnation"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_appetite",
    "group": "digestion",
    "label": "Ăn uống gần đây thế nào?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Bình thường",
        "value": "normal"
      },
      {
        "id": "poor",
        "label": "Ăn kém, mau no",
        "value": "poor",
        "scoreHints": [
          "spleen_stomach_deficiency",
          "qi_deficiency"
        ]
      },
      {
        "id": "craving",
        "label": "Thèm ăn nhiều hơn thường lệ",
        "value": "craving"
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "spleen_stomach_deficiency",
      "qi_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_bloating_after_meal",
    "group": "digestion",
    "label": "Sau ăn bạn có dễ đầy bụng/chậm tiêu không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "spleen_stomach_deficiency",
      "qi_stagnation"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_stool_form",
    "group": "digestion",
    "label": "Đại tiện thường gần với kiểu nào?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Tương đối bình thường",
        "value": "normal"
      },
      {
        "id": "loose",
        "label": "Lỏng/nát",
        "value": "loose",
        "scoreHints": [
          "spleen_stomach_deficiency",
          "yang_deficiency"
        ]
      },
      {
        "id": "dry",
        "label": "Khô/táo",
        "value": "dry",
        "scoreHints": [
          "yin_deficiency",
          "dryness_tendency"
        ]
      },
      {
        "id": "sticky",
        "label": "Dính, khó sạch, nặng bụng",
        "value": "sticky",
        "scoreHints": [
          "phlegm_dampness",
          "damp_heat"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "spleen_stomach_deficiency",
      "yang_deficiency",
      "yin_deficiency",
      "phlegm_dampness",
      "damp_heat"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_urine_color",
    "group": "urination",
    "label": "Nước tiểu thường thế nào?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Bình thường",
        "value": "normal"
      },
      {
        "id": "clear_frequent",
        "label": "Trong và đi nhiều",
        "value": "clear_frequent",
        "scoreHints": [
          "yang_deficiency",
          "kidney_qi_deficiency"
        ]
      },
      {
        "id": "dark_short",
        "label": "Vàng sẫm/ít",
        "value": "dark_short",
        "scoreHints": [
          "damp_heat",
          "heat_tendency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yang_deficiency",
      "kidney_qi_deficiency",
      "damp_heat"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_night_urination",
    "group": "urination",
    "label": "Bạn có hay đi tiểu đêm nhiều lần không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "kidney_qi_deficiency",
      "yang_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_body_heaviness",
    "group": "body_feeling",
    "label": "Cơ thể có cảm giác nặng nề, ì, đầu nặng không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "phlegm_dampness",
      "damp_heat",
      "spleen_stomach_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_mucus_phlegm",
    "group": "body_feeling",
    "label": "Bạn có cảm giác nhiều đờm/dịch nhầy hoặc hay nặng vùng ngực không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "phlegm_dampness",
      "lung_qi_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_dizziness",
    "group": "body_feeling",
    "label": "Bạn có hay hoa mắt/chóng mặt nhẹ hoặc mắt mỏi không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "blood_deficiency",
      "qi_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_low_back_knee_soreness",
    "group": "body_feeling",
    "label": "Bạn có hay mỏi lưng/gối hoặc cảm giác hụt sức vùng lưng gối không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "kidney_qi_deficiency",
      "yang_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_emotion_state",
    "group": "emotion",
    "label": "Tâm trạng gần đây thường nghiêng về?",
    "type": "multiple",
    "options": [
      {
        "id": "calm",
        "label": "Tương đối ổn",
        "value": "calm"
      },
      {
        "id": "stress",
        "label": "Căng thẳng",
        "value": "stress",
        "scoreHints": [
          "qi_stagnation",
          "liver_qi_stagnation"
        ]
      },
      {
        "id": "irritable",
        "label": "Dễ cáu/gắt",
        "value": "irritable",
        "scoreHints": [
          "liver_qi_stagnation",
          "damp_heat"
        ]
      },
      {
        "id": "worry",
        "label": "Lo nghĩ nhiều",
        "value": "worry",
        "scoreHints": [
          "spleen_stomach_deficiency",
          "blood_deficiency"
        ]
      },
      {
        "id": "sad",
        "label": "Buồn/nặng lòng",
        "value": "sad"
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_stagnation",
      "liver_qi_stagnation",
      "spleen_stomach_deficiency",
      "blood_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_stress_chest_flank",
    "group": "emotion",
    "label": "Khi căng thẳng, bạn có đầy tức ngực/hông sườn/bụng không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_stagnation",
      "liver_qi_stagnation"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_worry_overthinking",
    "group": "emotion",
    "label": "Bạn có hay suy nghĩ quá nhiều khiến ăn ngủ bị ảnh hưởng không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "spleen_stomach_deficiency",
      "blood_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_pain_quality",
    "group": "pain",
    "label": "Nếu có đau/căng tức, cảm giác gần với kiểu nào?",
    "type": "single",
    "options": [
      {
        "id": "none",
        "label": "Không đáng kể",
        "value": "none"
      },
      {
        "id": "distending_moving",
        "label": "Căng tức, lúc chỗ này lúc chỗ khác",
        "value": "distending_moving",
        "scoreHints": [
          "qi_stagnation",
          "liver_qi_stagnation"
        ]
      },
      {
        "id": "fixed_stabbing",
        "label": "Đau cố định/nhói",
        "value": "fixed_stabbing",
        "scoreHints": [
          "blood_stasis"
        ]
      },
      {
        "id": "heavy_ache",
        "label": "Nặng mỏi, trì trệ",
        "value": "heavy_ache",
        "scoreHints": [
          "phlegm_dampness"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_stagnation",
      "blood_stasis",
      "phlegm_dampness"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_fixed_pain_bruise",
    "group": "pain",
    "label": "Bạn có vùng đau cố định, dễ bầm tím hoặc sắc da tím sậm không?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Có",
        "value": "yes"
      },
      {
        "id": "no",
        "label": "Không",
        "value": "no"
      },
      {
        "id": "not_sure",
        "label": "Không chắc / bỏ qua",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "blood_stasis"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_movement_amount",
    "group": "lifestyle",
    "label": "Mức vận động thường ngày?",
    "type": "single",
    "options": [
      {
        "id": "low",
        "label": "Ít vận động/ngồi nhiều",
        "value": "low",
        "scoreHints": [
          "qi_stagnation",
          "phlegm_dampness"
        ]
      },
      {
        "id": "moderate",
        "label": "Vừa phải",
        "value": "moderate"
      },
      {
        "id": "high",
        "label": "Nhiều hoặc lao lực",
        "value": "high",
        "scoreHints": [
          "qi_deficiency",
          "yin_deficiency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_stagnation",
      "phlegm_dampness",
      "qi_deficiency"
    ],
    "reliability": "medium",
    "allowSkip": true
  },
  {
    "id": "q_tongue_color",
    "group": "tongue",
    "label": "Nếu tự quan sát lưỡi dưới ánh sáng tự nhiên, màu gần với?",
    "helperText": "Không quan sát sau ăn/uống màu đậm. Có thể chọn Không chắc.",
    "type": "single",
    "options": [
      {
        "id": "normal_pink",
        "label": "Hồng nhạt tương đối bình thường",
        "value": "normal_pink"
      },
      {
        "id": "pale",
        "label": "Nhạt",
        "value": "pale",
        "scoreHints": [
          "qi_deficiency",
          "blood_deficiency",
          "yang_deficiency"
        ]
      },
      {
        "id": "red",
        "label": "Đỏ hơn thường lệ",
        "value": "red",
        "scoreHints": [
          "yin_deficiency",
          "heat_tendency"
        ]
      },
      {
        "id": "purple",
        "label": "Tím/sậm",
        "value": "purple",
        "scoreHints": [
          "blood_stasis",
          "qi_stagnation"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "qi_deficiency",
      "blood_deficiency",
      "yin_deficiency",
      "blood_stasis"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_tongue_coating",
    "group": "tongue",
    "label": "Rêu lưỡi gần với?",
    "helperText": "Rêu lưỡi rất dễ sai do vệ sinh miệng, ăn uống, thuốc và ánh sáng.",
    "type": "single",
    "options": [
      {
        "id": "thin_white",
        "label": "Trắng mỏng",
        "value": "thin_white"
      },
      {
        "id": "thick_white",
        "label": "Trắng dày/nhớt",
        "value": "thick_white",
        "scoreHints": [
          "phlegm_dampness",
          "cold_damp"
        ]
      },
      {
        "id": "yellow",
        "label": "Vàng",
        "value": "yellow",
        "scoreHints": [
          "damp_heat",
          "heat_tendency"
        ]
      },
      {
        "id": "thick_yellow",
        "label": "Vàng dày/nhớt",
        "value": "thick_yellow",
        "scoreHints": [
          "damp_heat"
        ]
      },
      {
        "id": "none_or_little",
        "label": "Ít rêu/không rõ rêu",
        "value": "none_or_little",
        "scoreHints": [
          "yin_deficiency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "phlegm_dampness",
      "damp_heat",
      "yin_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_tongue_moisture",
    "group": "tongue",
    "label": "Lưỡi nhìn có khô hoặc quá ướt không?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Bình thường",
        "value": "normal"
      },
      {
        "id": "dry",
        "label": "Khô",
        "value": "dry",
        "scoreHints": [
          "yin_deficiency",
          "dryness_tendency"
        ]
      },
      {
        "id": "wet",
        "label": "Ướt/bóng nước",
        "value": "wet",
        "scoreHints": [
          "yang_deficiency",
          "phlegm_dampness"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "yin_deficiency",
      "yang_deficiency",
      "phlegm_dampness"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_tongue_shape",
    "group": "tongue",
    "label": "Hình thái lưỡi gần với?",
    "type": "single",
    "options": [
      {
        "id": "normal",
        "label": "Bình thường",
        "value": "normal"
      },
      {
        "id": "teeth_marks",
        "label": "Có dấu răng hai bên",
        "value": "teeth_marks",
        "scoreHints": [
          "spleen_stomach_deficiency",
          "phlegm_dampness"
        ]
      },
      {
        "id": "swollen",
        "label": "Bệu/phồng",
        "value": "swollen",
        "scoreHints": [
          "phlegm_dampness",
          "yang_deficiency"
        ]
      },
      {
        "id": "thin",
        "label": "Gầy/mỏng",
        "value": "thin",
        "scoreHints": [
          "yin_deficiency",
          "blood_deficiency"
        ]
      },
      {
        "id": "cracked",
        "label": "Có vết nứt rõ",
        "value": "cracked",
        "scoreHints": [
          "yin_deficiency",
          "dryness_tendency"
        ]
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "spleen_stomach_deficiency",
      "phlegm_dampness",
      "yin_deficiency"
    ],
    "reliability": "low",
    "allowSkip": true
  },
  {
    "id": "q_red_flags",
    "group": "red_flags",
    "label": "Bạn có đang gặp dấu hiệu nào dưới đây không?",
    "helperText": "Nếu có, app sẽ ưu tiên khuyến nghị đi khám/cấp cứu và không luận giải thể trạng.",
    "type": "multiple",
    "options": [
      {
        "id": "none",
        "label": "Không có dấu hiệu nào",
        "value": "none"
      },
      {
        "id": "rf_chest_pain",
        "label": "Đau ngực",
        "value": "rf_chest_pain",
        "redFlagId": "rf_chest_pain"
      },
      {
        "id": "rf_breathing",
        "label": "Khó thở",
        "value": "rf_breathing",
        "redFlagId": "rf_breathing"
      },
      {
        "id": "rf_stroke_signs",
        "label": "Liệt mặt/tay/chân hoặc nói khó",
        "value": "rf_stroke_signs",
        "redFlagId": "rf_stroke_signs"
      },
      {
        "id": "rf_fainting",
        "label": "Ngất",
        "value": "rf_fainting",
        "redFlagId": "rf_fainting"
      },
      {
        "id": "rf_seizure",
        "label": "Co giật",
        "value": "rf_seizure",
        "redFlagId": "rf_seizure"
      },
      {
        "id": "rf_high_fever",
        "label": "Sốt cao kéo dài",
        "value": "rf_high_fever",
        "redFlagId": "rf_high_fever"
      },
      {
        "id": "rf_severe_abdominal_pain",
        "label": "Đau bụng dữ dội",
        "value": "rf_severe_abdominal_pain",
        "redFlagId": "rf_severe_abdominal_pain"
      },
      {
        "id": "rf_vomiting_blood",
        "label": "Nôn ra máu",
        "value": "rf_vomiting_blood",
        "redFlagId": "rf_vomiting_blood"
      },
      {
        "id": "rf_blood_stool",
        "label": "Đi cầu ra máu",
        "value": "rf_blood_stool",
        "redFlagId": "rf_blood_stool"
      },
      {
        "id": "rf_abnormal_bleeding",
        "label": "Chảy máu bất thường",
        "value": "rf_abnormal_bleeding",
        "redFlagId": "rf_abnormal_bleeding"
      },
      {
        "id": "rf_rapid_weight_loss",
        "label": "Sụt cân nhanh không rõ nguyên nhân",
        "value": "rf_rapid_weight_loss",
        "redFlagId": "rf_rapid_weight_loss"
      },
      {
        "id": "rf_sudden_severe_headache",
        "label": "Đau đầu dữ dội đột ngột",
        "value": "rf_sudden_severe_headache",
        "redFlagId": "rf_sudden_severe_headache"
      },
      {
        "id": "rf_self_harm",
        "label": "Ý nghĩ tự hại",
        "value": "rf_self_harm",
        "redFlagId": "rf_self_harm"
      },
      {
        "id": "rf_very_high_bp",
        "label": "Huyết áp rất cao nếu người dùng biết bệnh nền",
        "value": "rf_very_high_bp",
        "redFlagId": "rf_very_high_bp"
      },
      {
        "id": "rf_glucose_extreme",
        "label": "Đường huyết quá cao/quá thấp nếu người dùng biết bệnh nền",
        "value": "rf_glucose_extreme",
        "redFlagId": "rf_glucose_extreme"
      },
      {
        "id": "rf_pregnancy_abnormal",
        "label": "Phụ nữ mang thai có bất thường",
        "value": "rf_pregnancy_abnormal",
        "redFlagId": "rf_pregnancy_abnormal"
      },
      {
        "id": "rf_child_severe",
        "label": "Trẻ nhỏ có dấu hiệu nặng",
        "value": "rf_child_severe",
        "redFlagId": "rf_child_severe"
      },
      {
        "id": "rf_dehydration_confusion",
        "label": "Lú lẫn, mất nước nặng hoặc yếu lả",
        "value": "rf_dehydration_confusion",
        "redFlagId": "rf_dehydration_confusion"
      },
      {
        "id": "not_sure",
        "label": "Không chắc",
        "value": "not_sure"
      }
    ],
    "mapping": [
      "safety"
    ],
    "reliability": "high",
    "safetySensitive": true,
    "allowSkip": false
  }
];
