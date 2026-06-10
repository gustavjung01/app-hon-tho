import type { Rule } from './types';

// Data package for /nguthuat/y/yhoc
// Nội dung tham khảo, không dùng để chẩn đoán, kê đơn hoặc tự điều trị.

export const RULES: Rule[] = [
  {
    "id": "r001",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_energy_level",
        "operator": "lte",
        "value": 3
      }
    ],
    "weight": 2,
    "explanation": "Mức năng lượng thấp gợi ý xu hướng khí hư.",
    "caution": "Nên kiểm tra ngủ nghỉ, ăn uống và red flags nếu mệt nhiều.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r002",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_fatigue_after_activity",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Dễ mệt sau vận động nhẹ làm tăng điểm khí hư.",
    "caution": "Mệt kéo dài hoặc nặng cần khám.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r003",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_short_breath_exertion",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Hụt hơi nhẹ khi vận động có thể đi cùng khí hư/phế khí hư.",
    "caution": "Nếu khó thở thật sự hoặc đau ngực, red flag đi trước.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r004",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_voice_strength",
        "operator": "equals",
        "value": "weak"
      }
    ],
    "weight": 1,
    "explanation": "Giọng nhỏ/yếu là tín hiệu tham khảo cho khí hư.",
    "caution": "Dữ liệu này dễ bị ảnh hưởng bởi viêm họng, mệt, môi trường.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r005",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_spontaneous_sweat",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 1,
    "explanation": "Dễ ra mồ hôi khi không vận động có thể gợi khí hư.",
    "caution": "Cần xem nhiệt độ, thuốc, stress và bệnh nền.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r006",
    "patternId": "qi_deficiency",
    "if": [
      {
        "questionId": "q_energy_level",
        "operator": "lte",
        "value": 4
      },
      {
        "questionId": "q_fatigue_after_activity",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_short_breath_exertion",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 4,
    "explanation": "Cụm mệt, dễ hụt hơi và năng lượng thấp làm xu hướng khí hư rõ hơn.",
    "caution": "Không dùng để kết luận bệnh hay kê thuốc.",
    "forbiddenWording": [
      "Bạn bị qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r007",
    "patternId": "lung_qi_deficiency",
    "if": [
      {
        "questionId": "q_short_breath_exertion",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_voice_strength",
        "operator": "equals",
        "value": "weak"
      }
    ],
    "weight": 3,
    "explanation": "Hụt hơi nhẹ kèm giọng yếu nghiêng về trục phế khí hư theo cổ học.",
    "caution": "Khó thở nặng phải xử lý y tế trước.",
    "forbiddenWording": [
      "Bạn bị lung qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r008",
    "patternId": "lung_qi_deficiency",
    "if": [
      {
        "questionId": "q_short_breath_exertion",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_spontaneous_sweat",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Hụt hơi nhẹ kèm dễ mồ hôi làm tăng điểm phế khí hư.",
    "caution": "Không tự dùng thuốc bổ phế.",
    "forbiddenWording": [
      "Bạn bị lung qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r009",
    "patternId": "lung_qi_deficiency",
    "if": [
      {
        "questionId": "q_mucus_phlegm",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_energy_level",
        "operator": "lte",
        "value": 5
      }
    ],
    "weight": 1,
    "explanation": "Đờm/dịch nhầy kèm mệt có thể liên quan trục phế hoặc đàm thấp.",
    "caution": "Nếu sốt, khó thở, đau ngực cần khám.",
    "forbiddenWording": [
      "Bạn bị lung qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r010",
    "patternId": "spleen_stomach_deficiency",
    "if": [
      {
        "questionId": "q_appetite",
        "operator": "equals",
        "value": "poor"
      }
    ],
    "weight": 2,
    "explanation": "Ăn kém/mau no gợi ý tỳ vị hư ở mức tham khảo.",
    "caution": "Cần theo dõi nếu sụt cân nhanh hoặc đau bụng.",
    "forbiddenWording": [
      "Bạn bị spleen stomach deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r011",
    "patternId": "spleen_stomach_deficiency",
    "if": [
      {
        "questionId": "q_bloating_after_meal",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Đầy bụng sau ăn thường được đặt gần trục Tỳ/Vị trong cổ học.",
    "caution": "Không kết luận bệnh tiêu hóa.",
    "forbiddenWording": [
      "Bạn bị spleen stomach deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r012",
    "patternId": "spleen_stomach_deficiency",
    "if": [
      {
        "questionId": "q_stool_form",
        "operator": "equals",
        "value": "loose"
      }
    ],
    "weight": 2,
    "explanation": "Đại tiện lỏng/nát làm tăng điểm tỳ vị hư hoặc dương hư.",
    "caution": "Nếu tiêu chảy nặng/kéo dài cần khám.",
    "forbiddenWording": [
      "Bạn bị spleen stomach deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r013",
    "patternId": "spleen_stomach_deficiency",
    "if": [
      {
        "questionId": "q_tongue_shape",
        "operator": "equals",
        "value": "teeth_marks"
      }
    ],
    "weight": 1,
    "explanation": "Dấu răng lưỡi là tín hiệu tham khảo cho tỳ hư/đàm thấp.",
    "caution": "Quan sát lưỡi có độ tin cậy thấp.",
    "forbiddenWording": [
      "Bạn bị spleen stomach deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r014",
    "patternId": "spleen_stomach_deficiency",
    "if": [
      {
        "questionId": "q_appetite",
        "operator": "equals",
        "value": "poor"
      },
      {
        "questionId": "q_bloating_after_meal",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_stool_form",
        "operator": "equals",
        "value": "loose"
      }
    ],
    "weight": 4,
    "explanation": "Ăn kém, đầy sau ăn và đại tiện lỏng cùng hướng tỳ vị hư.",
    "caution": "Không đưa thuốc kiện tỳ.",
    "forbiddenWording": [
      "Bạn bị spleen stomach deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r015",
    "patternId": "blood_deficiency",
    "if": [
      {
        "questionId": "q_dizziness",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Hoa mắt/chóng mặt nhẹ có thể gợi huyết hư hoặc khí hư theo cổ học.",
    "caution": "Chóng mặt nặng, ngất hoặc yếu liệt là red flag.",
    "forbiddenWording": [
      "Bạn bị blood deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r016",
    "patternId": "blood_deficiency",
    "if": [
      {
        "questionId": "q_tongue_color",
        "operator": "equals",
        "value": "pale"
      }
    ],
    "weight": 1,
    "explanation": "Lưỡi nhạt nếu quan sát đúng có thể hỗ trợ xu hướng huyết hư/khí hư.",
    "caution": "Màu lưỡi dễ sai do ánh sáng/camera.",
    "forbiddenWording": [
      "Bạn bị blood deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r017",
    "patternId": "blood_deficiency",
    "if": [
      {
        "questionId": "q_sleep_quality",
        "operator": "equals",
        "value": "light"
      },
      {
        "questionId": "q_dizziness",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Ngủ nông kèm hoa mắt làm xu hướng huyết hư rõ hơn ở mức tham khảo.",
    "caution": "Không đồng nhất với thiếu máu hiện đại.",
    "forbiddenWording": [
      "Bạn bị blood deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r018",
    "patternId": "blood_deficiency",
    "if": [
      {
        "questionId": "q_worry_overthinking",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_sleep_quality",
        "operator": "equals",
        "value": "light"
      }
    ],
    "weight": 2,
    "explanation": "Lo nghĩ nhiều kèm ngủ nông có thể đi cùng huyết hư/tỳ hư trong cổ học.",
    "caution": "Nếu lo âu nặng hoặc tự hại, ưu tiên hỗ trợ y tế.",
    "forbiddenWording": [
      "Bạn bị blood deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r019",
    "patternId": "qi_stagnation",
    "if": [
      {
        "questionId": "q_stress_chest_flank",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Đầy tức ngực/hông sườn khi stress là tín hiệu mạnh cho khí trệ/can khí uất.",
    "caution": "Đau ngực thật sự là red flag.",
    "forbiddenWording": [
      "Bạn bị qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r020",
    "patternId": "qi_stagnation",
    "if": [
      {
        "questionId": "q_pain_quality",
        "operator": "equals",
        "value": "distending_moving"
      }
    ],
    "weight": 2,
    "explanation": "Căng tức thay đổi vị trí thường được đọc là khí trệ ở mức cổ học.",
    "caution": "Không tự xử lý đau nặng.",
    "forbiddenWording": [
      "Bạn bị qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r021",
    "patternId": "qi_stagnation",
    "if": [
      {
        "questionId": "q_bloating_after_meal",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_emotion_state",
        "operator": "includes",
        "value": "stress"
      }
    ],
    "weight": 2,
    "explanation": "Đầy bụng kèm stress làm tăng điểm khí trệ.",
    "caution": "Cần phân biệt với vấn đề tiêu hóa cần khám nếu kéo dài.",
    "forbiddenWording": [
      "Bạn bị qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r022",
    "patternId": "qi_stagnation",
    "if": [
      {
        "questionId": "q_movement_amount",
        "operator": "equals",
        "value": "low"
      },
      {
        "questionId": "q_stress_chest_flank",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Ít vận động kèm đầy tức khi stress gợi ý khí cơ kém thông theo cổ học.",
    "caution": "Chỉ nên gợi ý vận động nhẹ, không trị liệu.",
    "forbiddenWording": [
      "Bạn bị qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r023",
    "patternId": "liver_qi_stagnation",
    "if": [
      {
        "questionId": "q_emotion_state",
        "operator": "includes",
        "value": "stress"
      },
      {
        "questionId": "q_emotion_state",
        "operator": "includes",
        "value": "irritable"
      }
    ],
    "weight": 3,
    "explanation": "Căng thẳng kèm dễ cáu nghiêng về can khí uất theo cổ học.",
    "caution": "Không nói gan có bệnh.",
    "forbiddenWording": [
      "Bạn bị liver qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r024",
    "patternId": "liver_qi_stagnation",
    "if": [
      {
        "questionId": "q_stress_chest_flank",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_pain_quality",
        "operator": "equals",
        "value": "distending_moving"
      }
    ],
    "weight": 3,
    "explanation": "Đầy tức hông sườn/ngực kèm đau căng di chuyển làm tăng điểm can khí uất.",
    "caution": "Đau ngực hoặc đau bụng dữ dội phải đi khám.",
    "forbiddenWording": [
      "Bạn bị liver qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r025",
    "patternId": "liver_qi_stagnation",
    "if": [
      {
        "questionId": "q_sleep_quality",
        "operator": "equals",
        "value": "hard_sleep"
      },
      {
        "questionId": "q_emotion_state",
        "operator": "includes",
        "value": "stress"
      }
    ],
    "weight": 2,
    "explanation": "Khó ngủ khi stress hỗ trợ xu hướng can khí uất/yin hư.",
    "caution": "Không tự dùng thuốc an thần hay sơ can.",
    "forbiddenWording": [
      "Bạn bị liver qi stagnation",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r026",
    "patternId": "blood_stasis",
    "if": [
      {
        "questionId": "q_pain_quality",
        "operator": "equals",
        "value": "fixed_stabbing"
      }
    ],
    "weight": 3,
    "explanation": "Đau cố định/nhói là tín hiệu cổ học cho huyết ứ.",
    "caution": "Đau dữ dội/đột ngột cần y tế hiện đại.",
    "forbiddenWording": [
      "Bạn bị blood stasis",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r027",
    "patternId": "blood_stasis",
    "if": [
      {
        "questionId": "q_fixed_pain_bruise",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Dễ bầm hoặc vùng đau cố định làm tăng điểm huyết ứ.",
    "caution": "Bầm/chảy máu bất thường cần khám.",
    "forbiddenWording": [
      "Bạn bị blood stasis",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r028",
    "patternId": "blood_stasis",
    "if": [
      {
        "questionId": "q_tongue_color",
        "operator": "equals",
        "value": "purple"
      }
    ],
    "weight": 2,
    "explanation": "Lưỡi tím/sậm nếu quan sát đúng hỗ trợ xu hướng huyết ứ/khí trệ.",
    "caution": "Độ tin cậy quan sát lưỡi thấp.",
    "forbiddenWording": [
      "Bạn bị blood stasis",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r029",
    "patternId": "blood_stasis",
    "if": [
      {
        "questionId": "q_pain_quality",
        "operator": "equals",
        "value": "fixed_stabbing"
      },
      {
        "questionId": "q_tongue_color",
        "operator": "equals",
        "value": "purple"
      }
    ],
    "weight": 4,
    "explanation": "Đau nhói cố định kèm lưỡi tím làm xu hướng huyết ứ rõ hơn.",
    "caution": "Không tự dùng thuốc hoạt huyết.",
    "forbiddenWording": [
      "Bạn bị blood stasis",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r030",
    "patternId": "yin_deficiency",
    "if": [
      {
        "questionId": "q_night_sweat",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Mồ hôi đêm có thể gợi xu hướng âm hư trong cổ học.",
    "caution": "Nếu sốt, sụt cân, ho kéo dài cần khám.",
    "forbiddenWording": [
      "Bạn bị yin deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r031",
    "patternId": "yin_deficiency",
    "if": [
      {
        "questionId": "q_dry_mouth",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Khô miệng/họng làm tăng điểm âm hư/táo.",
    "caution": "Khô miệng có thể do thuốc, thiếu nước, đường huyết hoặc môi trường.",
    "forbiddenWording": [
      "Bạn bị yin deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r032",
    "patternId": "yin_deficiency",
    "if": [
      {
        "questionId": "q_heat_sensation",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Nóng trong/bứt rứt về chiều tối hỗ trợ xu hướng âm hư/nhiệt.",
    "caution": "Sốt cao kéo dài là red flag.",
    "forbiddenWording": [
      "Bạn bị yin deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r033",
    "patternId": "yin_deficiency",
    "if": [
      {
        "questionId": "q_tongue_color",
        "operator": "equals",
        "value": "red"
      },
      {
        "questionId": "q_tongue_coating",
        "operator": "equals",
        "value": "none_or_little"
      }
    ],
    "weight": 3,
    "explanation": "Lưỡi đỏ kèm ít rêu là tín hiệu tham khảo cho âm hư.",
    "caution": "Không chẩn đoán qua lưỡi.",
    "forbiddenWording": [
      "Bạn bị yin deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r034",
    "patternId": "yin_deficiency",
    "if": [
      {
        "questionId": "q_dry_mouth",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_night_sweat",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_sleep_quality",
        "operator": "equals",
        "value": "light"
      }
    ],
    "weight": 4,
    "explanation": "Khô miệng, mồ hôi đêm và ngủ nông cùng hướng âm hư.",
    "caution": "Không gợi ý dược liệu dưỡng âm.",
    "forbiddenWording": [
      "Bạn bị yin deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r035",
    "patternId": "yang_deficiency",
    "if": [
      {
        "questionId": "q_cold_sensation",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Dễ lạnh gợi xu hướng dương hư/thiên hàn.",
    "caution": "Cần xem thời tiết, môi trường, thiếu ngủ.",
    "forbiddenWording": [
      "Bạn bị yang deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r036",
    "patternId": "yang_deficiency",
    "if": [
      {
        "questionId": "q_limb_cold",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Tay chân lạnh hỗ trợ xu hướng dương hư.",
    "caution": "Nếu lạnh kèm đau ngực/khó thở/ngất cần y tế.",
    "forbiddenWording": [
      "Bạn bị yang deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r037",
    "patternId": "yang_deficiency",
    "if": [
      {
        "questionId": "q_prefer_warmth",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 1,
    "explanation": "Thích ấm là tín hiệu nhẹ cho thiên hàn/dương hư.",
    "caution": "Không đủ để kết luận.",
    "forbiddenWording": [
      "Bạn bị yang deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "low"
  },
  {
    "id": "r038",
    "patternId": "yang_deficiency",
    "if": [
      {
        "questionId": "q_stool_form",
        "operator": "equals",
        "value": "loose"
      },
      {
        "questionId": "q_limb_cold",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Đại tiện lỏng kèm tay chân lạnh làm tăng điểm dương hư/tỳ dương hư.",
    "caution": "Không tự dùng thuốc ôn dương.",
    "forbiddenWording": [
      "Bạn bị yang deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r039",
    "patternId": "yang_deficiency",
    "if": [
      {
        "questionId": "q_energy_level",
        "operator": "lte",
        "value": 4
      },
      {
        "questionId": "q_cold_sensation",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_prefer_warmth",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 4,
    "explanation": "Năng lượng thấp, dễ lạnh và thích ấm cùng hướng dương hư.",
    "caution": "Vẫn chỉ là xu hướng tham khảo.",
    "forbiddenWording": [
      "Bạn bị yang deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r040",
    "patternId": "phlegm_dampness",
    "if": [
      {
        "questionId": "q_body_heaviness",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Cảm giác nặng nề/ì là tín hiệu cho đàm thấp/thấp.",
    "caution": "Dễ nhầm với thiếu ngủ, ít vận động.",
    "forbiddenWording": [
      "Bạn bị phlegm dampness",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r041",
    "patternId": "phlegm_dampness",
    "if": [
      {
        "questionId": "q_mucus_phlegm",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 2,
    "explanation": "Nhiều đờm/dịch nhầy hỗ trợ xu hướng đàm thấp hoặc phế khí.",
    "caution": "Khó thở/sốt cần khám.",
    "forbiddenWording": [
      "Bạn bị phlegm dampness",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r042",
    "patternId": "phlegm_dampness",
    "if": [
      {
        "questionId": "q_tongue_coating",
        "operator": "equals",
        "value": "thick_white"
      }
    ],
    "weight": 2,
    "explanation": "Rêu lưỡi trắng dày/nhớt hỗ trợ xu hướng đàm thấp.",
    "caution": "Quan sát lưỡi tin cậy thấp.",
    "forbiddenWording": [
      "Bạn bị phlegm dampness",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r043",
    "patternId": "phlegm_dampness",
    "if": [
      {
        "questionId": "q_stool_form",
        "operator": "equals",
        "value": "sticky"
      },
      {
        "questionId": "q_body_heaviness",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Đại tiện dính kèm nặng nề làm xu hướng đàm thấp rõ hơn.",
    "caution": "Không tự dùng hóa đàm/lợi thấp.",
    "forbiddenWording": [
      "Bạn bị phlegm dampness",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r044",
    "patternId": "damp_heat",
    "if": [
      {
        "questionId": "q_tongue_coating",
        "operator": "equals",
        "value": "yellow"
      }
    ],
    "weight": 2,
    "explanation": "Rêu vàng là tín hiệu tham khảo cho nhiệt/thấp nhiệt.",
    "caution": "Có thể do ăn uống, vệ sinh miệng, thuốc.",
    "forbiddenWording": [
      "Bạn bị damp heat",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r045",
    "patternId": "damp_heat",
    "if": [
      {
        "questionId": "q_tongue_coating",
        "operator": "equals",
        "value": "thick_yellow"
      }
    ],
    "weight": 3,
    "explanation": "Rêu vàng dày/nhớt làm tăng điểm thấp nhiệt.",
    "caution": "Không kết luận bệnh viêm/nhiễm.",
    "forbiddenWording": [
      "Bạn bị damp heat",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r046",
    "patternId": "damp_heat",
    "if": [
      {
        "questionId": "q_urine_color",
        "operator": "equals",
        "value": "dark_short"
      },
      {
        "questionId": "q_body_heaviness",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Nước tiểu sẫm/ít kèm nặng nề hỗ trợ xu hướng thấp nhiệt.",
    "caution": "Tiểu đau/sốt/đau bụng cần khám.",
    "forbiddenWording": [
      "Bạn bị damp heat",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r047",
    "patternId": "damp_heat",
    "if": [
      {
        "questionId": "q_stool_form",
        "operator": "equals",
        "value": "sticky"
      },
      {
        "questionId": "q_heat_sensation",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Đại tiện dính kèm cảm giác nóng hỗ trợ thấp nhiệt.",
    "caution": "Không gợi ý thanh nhiệt/lợi thấp.",
    "forbiddenWording": [
      "Bạn bị damp heat",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r048",
    "patternId": "damp_heat",
    "if": [
      {
        "questionId": "q_bitter_mouth",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_tongue_coating",
        "operator": "includes",
        "value": "yellow"
      }
    ],
    "weight": 2,
    "explanation": "Miệng đắng kèm rêu vàng hỗ trợ xu hướng thấp nhiệt/can uất hóa nhiệt.",
    "caution": "Rêu lưỡi dễ sai, cần thận trọng.",
    "forbiddenWording": [
      "Bạn bị damp heat",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r049",
    "patternId": "kidney_qi_deficiency",
    "if": [
      {
        "questionId": "q_low_back_knee_soreness",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_night_urination",
        "operator": "equals",
        "value": "yes"
      }
    ],
    "weight": 3,
    "explanation": "Mỏi lưng gối kèm tiểu đêm nghiêng về thận khí hư theo cổ học.",
    "caution": "Không đồng nhất với bệnh thận.",
    "forbiddenWording": [
      "Bạn bị kidney qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  },
  {
    "id": "r050",
    "patternId": "kidney_qi_deficiency",
    "if": [
      {
        "questionId": "q_low_back_knee_soreness",
        "operator": "equals",
        "value": "yes"
      },
      {
        "questionId": "q_energy_level",
        "operator": "lte",
        "value": 4
      }
    ],
    "weight": 2,
    "explanation": "Mỏi lưng gối kèm năng lượng thấp hỗ trợ xu hướng thận khí hư/khí hư.",
    "caution": "Đau lưng dữ dội, sốt, tiểu bất thường cần khám.",
    "forbiddenWording": [
      "Bạn bị kidney qi deficiency",
      "Chắc chắn",
      "Uống thuốc",
      "Kê đơn",
      "Điều trị"
    ],
    "reliability": "medium"
  }
];
