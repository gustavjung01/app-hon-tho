import type { Pattern } from './types';

// Data package for /nguthuat/y/yhoc
// Nội dung tham khảo, không dùng để chẩn đoán, kê đơn hoặc tự điều trị.

export const PATTERNS: Pattern[] = [
  {
    "id": "qi_deficiency",
    "name": "Khí hư",
    "classicalCategory": "Khí/Hư",
    "overview": "Xu hướng thiếu lực vận hành theo cổ học, thường biểu hiện bằng dễ mệt, hụt hơi, nói yếu hoặc dễ ra mồ hôi.",
    "signs": [
      "Dễ mệt sau vận động nhẹ",
      "Hụt hơi/thở ngắn",
      "Giọng nhỏ/yếu",
      "Dễ ra mồ hôi",
      "Lưỡi nhạt nếu tự quan sát thấy"
    ],
    "possibleQuestions": [
      "q_energy_level",
      "q_fatigue_after_activity",
      "q_short_breath_exertion",
      "q_voice_strength",
      "q_spontaneous_sweat",
      "q_tongue_color"
    ],
    "supportiveCare": [
      "Giữ nhịp sinh hoạt đều, tránh lao lực kéo dài.",
      "Chia nhỏ việc nặng, tăng vận động nhẹ từ từ.",
      "Ăn uống đều bữa, ưu tiên thức ăn dễ tiêu, không cực đoan kiêng khem.",
      "Ngủ nghỉ đủ và theo dõi nếu mệt kéo dài."
    ],
    "cautions": [
      "Mệt nhiều, khó thở, đau ngực, ngất hoặc sụt cân nhanh cần đi khám.",
      "Không tự dùng thuốc bổ khí hoặc dược liệu."
    ],
    "forbiddenClaims": [
      "Bạn bị khí hư",
      "Bạn thiếu khí nên phải uống thuốc",
      "Có thể chữa khỏi bằng dưỡng sinh"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: khí hư"
    ]
  },
  {
    "id": "blood_deficiency",
    "name": "Huyết hư",
    "classicalCategory": "Huyết/Hư",
    "overview": "Xu hướng thiếu nuôi dưỡng theo cổ học, có thể gợi qua hoa mắt, ngủ không yên, lưỡi nhạt, mệt và cảm giác khô.",
    "signs": [
      "Hoa mắt/chóng mặt nhẹ",
      "Ngủ nông",
      "Lưỡi nhạt",
      "Mệt mỏi",
      "Mắt mỏi/khô nếu có"
    ],
    "possibleQuestions": [
      "q_dizziness",
      "q_sleep_quality",
      "q_tongue_color",
      "q_energy_level",
      "q_worry_overthinking"
    ],
    "supportiveCare": [
      "Giữ bữa ăn đều, tránh bỏ bữa.",
      "Ngủ nghỉ đúng giờ, giảm thức khuya.",
      "Theo dõi nếu chóng mặt hoặc mệt kéo dài."
    ],
    "cautions": [
      "Chóng mặt nhiều, ngất, chảy máu bất thường hoặc sụt cân nhanh cần khám.",
      "Không đồng nhất huyết hư với thiếu máu theo xét nghiệm."
    ],
    "forbiddenClaims": [
      "Bạn thiếu máu",
      "Bạn bị huyết hư chắc chắn",
      "Tự dùng thuốc bổ huyết"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: huyết hư"
    ]
  },
  {
    "id": "qi_stagnation",
    "name": "Khí trệ",
    "classicalCategory": "Khí/Trệ",
    "overview": "Xu hướng khí vận hành không thông theo cổ học, hay được gợi qua cảm giác đầy tức, căng, stress, đau tức di chuyển.",
    "signs": [
      "Căng tức ngực/hông sườn/bụng khi stress",
      "Đầy bụng",
      "Dễ cáu hoặc căng",
      "Đau/căng tức thay đổi vị trí",
      "Ít vận động/ngồi lâu"
    ],
    "possibleQuestions": [
      "q_stress_chest_flank",
      "q_bloating_after_meal",
      "q_emotion_state",
      "q_pain_quality",
      "q_movement_amount"
    ],
    "supportiveCare": [
      "Đi bộ nhẹ, giãn cơ, đổi tư thế khi ngồi lâu.",
      "Tập thở chậm, nghỉ ngắn giữa ngày.",
      "Giảm chất kích thích nếu thấy bứt rứt."
    ],
    "cautions": [
      "Đau ngực, khó thở hoặc đau bụng dữ dội phải đi khám ngay.",
      "Không tự quy mọi đau tức là khí trệ."
    ],
    "forbiddenClaims": [
      "Ứ khí là nguyên nhân bệnh của bạn",
      "Bấm huyệt/châm cứu để thông khí",
      "Dùng thuốc hành khí"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: khí trệ"
    ]
  },
  {
    "id": "blood_stasis",
    "name": "Huyết ứ",
    "classicalCategory": "Huyết/Ứ",
    "overview": "Xu hướng ứ trệ theo cổ học, thường dùng khi có đau cố định, nhói, bầm tím hoặc lưỡi tím trong tự quan sát.",
    "signs": [
      "Đau cố định/nhói",
      "Dễ bầm tím",
      "Sắc tím/sậm",
      "Lưỡi tím nếu quan sát thấy"
    ],
    "possibleQuestions": [
      "q_pain_quality",
      "q_fixed_pain_bruise",
      "q_tongue_color"
    ],
    "supportiveCare": [
      "Vận động nhẹ trong khả năng, tránh bất động kéo dài.",
      "Theo dõi vùng đau/bầm và đi khám nếu kéo dài hoặc nặng.",
      "Giữ ấm vừa phải nếu đau tăng khi lạnh."
    ],
    "cautions": [
      "Đau ngực, đau đầu dữ dội, chảy máu hoặc bầm tím bất thường cần y tế hiện đại.",
      "Không tự dùng hoạt huyết/dược liệu."
    ],
    "forbiddenClaims": [
      "Bạn bị huyết ứ",
      "Máu đang tắc",
      "Tự dùng thuốc hoạt huyết"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: huyết ứ"
    ]
  },
  {
    "id": "yin_deficiency",
    "name": "Âm hư",
    "classicalCategory": "Âm/Hư",
    "overview": "Xu hướng thiếu phần làm mát/làm ẩm theo cổ học, có thể gợi qua khô miệng, nóng về chiều, ra mồ hôi đêm, lưỡi đỏ/ít rêu.",
    "signs": [
      "Khô miệng",
      "Nóng trong/bứt rứt chiều tối",
      "Mồ hôi đêm",
      "Ngủ nông/khó ngủ",
      "Lưỡi đỏ, khô hoặc ít rêu"
    ],
    "possibleQuestions": [
      "q_dry_mouth",
      "q_heat_sensation",
      "q_night_sweat",
      "q_sleep_quality",
      "q_tongue_color",
      "q_tongue_coating",
      "q_tongue_moisture"
    ],
    "supportiveCare": [
      "Giảm thức khuya, giữ nhịp nghỉ đều.",
      "Uống nước theo nhu cầu, tránh cực đoan.",
      "Giảm vận động quá sức khi đang kiệt sức."
    ],
    "cautions": [
      "Sốt kéo dài, sụt cân nhanh, khát nhiều bất thường hoặc đường huyết bất thường cần đi khám.",
      "Không tự dùng thuốc/dược liệu dưỡng âm."
    ],
    "forbiddenClaims": [
      "Bạn âm hư chắc chắn",
      "Uống bài thuốc dưỡng âm",
      "Khô miệng là do âm hư"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: âm hư"
    ]
  },
  {
    "id": "yang_deficiency",
    "name": "Dương hư",
    "classicalCategory": "Dương/Hư",
    "overview": "Xu hướng thiếu phần làm ấm/vận động theo cổ học, thường gợi qua dễ lạnh, tay chân lạnh, thích ấm, mệt, đại tiện lỏng.",
    "signs": [
      "Dễ lạnh",
      "Tay chân lạnh",
      "Thích ấm",
      "Mệt",
      "Đại tiện lỏng",
      "Lưỡi ướt/bệu nếu tự quan sát"
    ],
    "possibleQuestions": [
      "q_cold_sensation",
      "q_limb_cold",
      "q_prefer_warmth",
      "q_energy_level",
      "q_stool_form",
      "q_tongue_moisture",
      "q_tongue_shape"
    ],
    "supportiveCare": [
      "Giữ ấm vừa phải, tránh để lạnh kéo dài.",
      "Ăn uống đều, ưu tiên món dễ tiêu, ấm vừa phải.",
      "Vận động nhẹ để cơ thể ấm dần, tránh quá sức."
    ],
    "cautions": [
      "Lạnh kèm đau ngực, khó thở, ngất, yếu lả cần đi khám.",
      "Không tự dùng thuốc bổ dương."
    ],
    "forbiddenClaims": [
      "Bạn thận dương hư",
      "Dùng thuốc bổ dương",
      "Chữa lạnh tay chân bằng phương thuốc"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: dương hư"
    ]
  },
  {
    "id": "phlegm_dampness",
    "name": "Đàm thấp",
    "classicalCategory": "Thấp/Đàm",
    "overview": "Xu hướng nặng, ẩm, trì trệ theo cổ học, gợi qua cơ thể nặng nề, đờm/dịch nhầy, rêu lưỡi dày nhớt, đại tiện dính.",
    "signs": [
      "Nặng nề/ì",
      "Nhiều đờm/dịch nhầy",
      "Rêu lưỡi trắng dày/nhớt",
      "Đại tiện dính",
      "Ít vận động"
    ],
    "possibleQuestions": [
      "q_body_heaviness",
      "q_mucus_phlegm",
      "q_tongue_coating",
      "q_stool_form",
      "q_movement_amount"
    ],
    "supportiveCare": [
      "Tăng vận động nhẹ đều đặn.",
      "Ăn chậm, giảm ăn quá no, quan sát món nào làm nặng bụng.",
      "Giữ môi trường sống thoáng, ngủ đủ."
    ],
    "cautions": [
      "Khó thở, sốt cao, đau ngực hoặc đờm máu cần đi khám.",
      "Không tự dùng hóa đàm/lợi thấp."
    ],
    "forbiddenClaims": [
      "Bạn có đàm thấp gây bệnh",
      "Tự dùng thuốc hóa đàm",
      "Bấm huyệt tiêu đàm"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: đàm thấp"
    ]
  },
  {
    "id": "damp_heat",
    "name": "Thấp nhiệt",
    "classicalCategory": "Thấp/Nhiệt",
    "overview": "Xu hướng vừa ẩm nặng vừa nóng theo cổ học, thường gợi qua nặng nề, miệng đắng, rêu vàng/dày, nước tiểu vàng sẫm hoặc đại tiện dính.",
    "signs": [
      "Nặng nề",
      "Miệng đắng",
      "Rêu lưỡi vàng/dày",
      "Nước tiểu vàng sẫm/ít",
      "Đại tiện dính",
      "Cảm giác nóng"
    ],
    "possibleQuestions": [
      "q_body_heaviness",
      "q_bitter_mouth",
      "q_tongue_coating",
      "q_urine_color",
      "q_stool_form",
      "q_heat_sensation"
    ],
    "supportiveCare": [
      "Ăn uống điều độ, tránh quá no/quá cay/nhiều dầu nếu thấy nặng bụng.",
      "Uống nước theo nhu cầu, nghỉ ngơi đủ.",
      "Theo dõi nếu kèm sốt/đau/nôn/tiểu bất thường."
    ],
    "cautions": [
      "Sốt cao kéo dài, đau bụng dữ dội, tiểu đau/buốt nặng hoặc vàng da cần đi khám.",
      "Không tự dùng thanh nhiệt/lợi thấp."
    ],
    "forbiddenClaims": [
      "Bạn bị thấp nhiệt",
      "Uống thuốc thanh nhiệt",
      "Tự giải độc"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: thấp nhiệt"
    ]
  },
  {
    "id": "liver_qi_stagnation",
    "name": "Can khí uất",
    "classicalCategory": "Can/Khí trệ",
    "overview": "Xu hướng uất/kẹt ở trục Can theo cổ học, gợi qua stress, dễ cáu, đầy tức hông sườn/ngực, đau căng thay đổi.",
    "signs": [
      "Căng thẳng",
      "Dễ cáu",
      "Đầy tức ngực/hông sườn",
      "Đau căng di chuyển",
      "Khó ngủ khi stress"
    ],
    "possibleQuestions": [
      "q_emotion_state",
      "q_stress_chest_flank",
      "q_sleep_quality",
      "q_pain_quality",
      "q_bitter_mouth"
    ],
    "supportiveCare": [
      "Đi bộ, giãn cơ vai-ngực-hông nhẹ nhàng.",
      "Viết xuống điều đang lo, chia nhỏ việc cần xử lý.",
      "Tập thở chậm 3-5 phút, không ép thiền nếu khó chịu."
    ],
    "cautions": [
      "Đau ngực, khó thở, ý nghĩ tự hại hoặc stress quá sức cần hỗ trợ y tế/người thân.",
      "Không tự dùng thuốc sơ can/lý khí."
    ],
    "forbiddenClaims": [
      "Can của bạn có bệnh",
      "Bạn can khí uất chắc chắn",
      "Uống thuốc sơ can"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: Can khí uất"
    ]
  },
  {
    "id": "spleen_stomach_deficiency",
    "name": "Tỳ vị hư",
    "classicalCategory": "Tỳ/Vị/Hư",
    "overview": "Xu hướng tiêu hóa và chuyển hóa yếu theo cổ học, gợi qua ăn kém, đầy sau ăn, đại tiện lỏng, nặng nề, dấu răng lưỡi.",
    "signs": [
      "Ăn kém/mau no",
      "Đầy sau ăn",
      "Đại tiện lỏng",
      "Cơ thể nặng",
      "Dấu răng hai bên lưỡi",
      "Mệt"
    ],
    "possibleQuestions": [
      "q_appetite",
      "q_bloating_after_meal",
      "q_stool_form",
      "q_body_heaviness",
      "q_tongue_shape",
      "q_energy_level"
    ],
    "supportiveCare": [
      "Ăn đúng bữa, giảm ăn quá no về tối.",
      "Theo dõi món làm đầy bụng, ưu tiên thức ăn dễ tiêu.",
      "Vận động nhẹ sau ăn nếu phù hợp, không nằm ngay sau ăn."
    ],
    "cautions": [
      "Đau bụng dữ dội, nôn ra máu, đi cầu ra máu, sụt cân nhanh cần đi khám.",
      "Không tự dùng kiện tỳ/bổ tỳ."
    ],
    "forbiddenClaims": [
      "Bạn bị bệnh dạ dày",
      "Tỳ vị hư cần thuốc",
      "Dùng bài thuốc kiện tỳ"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: tạng phủ/Tỳ Vị"
    ]
  },
  {
    "id": "lung_qi_deficiency",
    "name": "Phế khí hư",
    "classicalCategory": "Phế/Khí hư",
    "overview": "Xu hướng khí ở trục Phế yếu theo cổ học, gợi qua hụt hơi, giọng nhỏ, dễ ra mồ hôi, mệt khi vận động.",
    "signs": [
      "Hụt hơi khi vận động nhẹ",
      "Giọng nhỏ/yếu",
      "Dễ ra mồ hôi",
      "Mệt",
      "Có thể kèm đờm/dịch nhầy"
    ],
    "possibleQuestions": [
      "q_short_breath_exertion",
      "q_voice_strength",
      "q_spontaneous_sweat",
      "q_energy_level",
      "q_mucus_phlegm"
    ],
    "supportiveCare": [
      "Theo dõi nhịp thở, giảm quá sức.",
      "Tập thở nhẹ nếu không khó chịu.",
      "Không hút thuốc, giữ môi trường thông thoáng."
    ],
    "cautions": [
      "Khó thở thật sự, đau ngực, tím tái, sốt cao hoặc ho ra máu cần cấp cứu/khám.",
      "Không tự dùng thuốc bổ phế."
    ],
    "forbiddenClaims": [
      "Bạn bệnh phổi",
      "Phế khí hư chắc chắn",
      "Dùng thuốc bổ phế"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "deep-research-report: khí hư phế/tỳ"
    ]
  },
  {
    "id": "kidney_qi_deficiency",
    "name": "Thận khí hư",
    "classicalCategory": "Thận/Khí hư",
    "overview": "Xu hướng nền tảng/sức bền ở trục Thận yếu theo cổ học, gợi qua mỏi lưng gối, tiểu đêm, dễ mệt, lạnh nếu kèm dương hư.",
    "signs": [
      "Mỏi lưng/gối",
      "Tiểu đêm nhiều",
      "Dễ mệt",
      "Tay chân lạnh nếu kèm dương hư"
    ],
    "possibleQuestions": [
      "q_low_back_knee_soreness",
      "q_night_urination",
      "q_energy_level",
      "q_limb_cold",
      "q_urine_color"
    ],
    "supportiveCare": [
      "Ngủ nghỉ đều, tránh lao lực kéo dài.",
      "Vận động nhẹ cho lưng hông trong khả năng.",
      "Đi khám nếu tiểu đêm mới xuất hiện nhiều hoặc đau/tiểu bất thường."
    ],
    "cautions": [
      "Không đồng nhất thận khí hư với bệnh thận hiện đại.",
      "Tiểu bất thường, phù, đau lưng dữ dội, sốt hoặc mệt nhiều cần khám."
    ],
    "forbiddenClaims": [
      "Thận của bạn yếu/bệnh",
      "Dùng thuốc bổ thận",
      "Tự điều trị tiểu đêm"
    ],
    "contradictorySignals": [],
    "confidenceGuidance": {
      "low": "Ít dữ liệu, chỉ ghi nhận vài dấu hiệu rời rạc.",
      "medium": "Có nhiều dấu hiệu cùng hướng nhưng vẫn thiếu bối cảnh.",
      "fair": "Nhiều dấu hiệu tự khai đồng hướng, không có red flag, nhưng vẫn chỉ là tham khảo."
    },
    "sourceRefs": [
      "YHCT foundation: Thận khí"
    ]
  }
];
