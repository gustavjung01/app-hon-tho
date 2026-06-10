// Data package for /nguthuat/y/yhoc
// Nội dung tham khảo, không dùng để chẩn đoán, kê đơn hoặc tự điều trị.

export const YHOC_FOUNDATIONS = {
  "appPositioning": {
    "route": "/nguthuat/y/yhoc",
    "name": "Y - Y học cổ học tham khảo",
    "oneLine": "Ứng dụng tự học và tự quan sát thể trạng theo hệ quy chiếu Y học cổ học phương Đông.",
    "scope": [
      "Giải thích khái niệm cổ học: âm dương, ngũ hành, tạng phủ, khí huyết, kinh lạc, tứ chẩn, bát cương, chứng hậu, dưỡng sinh.",
      "Gợi ý xu hướng thể trạng bằng ngôn từ thận trọng, dựa trên dữ liệu người dùng tự khai.",
      "Nhắc người dùng đi khám khi có dấu hiệu nguy hiểm."
    ],
    "notScope": [
      "Không chẩn đoán bệnh.",
      "Không kê đơn.",
      "Không đưa liều dược liệu/phương thuốc để tự trị.",
      "Không khuyên bỏ điều trị y tế hiện đại.",
      "Không kết luận chắc chắn về sức khỏe."
    ]
  },
  "guardrails": [
    {
      "id": "g_no_diagnosis",
      "title": "Không chẩn đoán",
      "safe": "Dùng 'có xu hướng', 'gợi ý', 'theo khung cổ học', 'dữ liệu hiện có còn hạn chế'.",
      "forbidden": [
        "Bạn bị...",
        "Đây là bệnh...",
        "Chắc chắn là...",
        "Kết luận là..."
      ]
    },
    {
      "id": "g_no_prescription",
      "title": "Không kê thuốc/phương",
      "safe": "Dược liệu và phương tễ chỉ xuất hiện ở mục tự học, không xuất trong kết quả cá nhân.",
      "forbidden": [
        "Uống vị này",
        "Dùng bài này",
        "Liều lượng",
        "Tự sắc uống"
      ]
    },
    {
      "id": "g_redflag_first",
      "title": "Red flag đi trước mọi kết quả",
      "safe": "Nếu người dùng chọn dấu hiệu nguy hiểm, engine chỉ hiện cảnh báo y tế và dừng luận giải thể trạng.",
      "forbidden": [
        "Bỏ qua red flag để tiếp tục xem kết quả",
        "Tự xử lý bằng app"
      ]
    },
    {
      "id": "g_uncertainty",
      "title": "Luôn thể hiện độ bất định",
      "safe": "Hiển thị mức confidence thấp/vừa/khá và danh sách dữ liệu còn thiếu.",
      "forbidden": [
        "Tuyệt đối hóa kết quả",
        "Ẩn mâu thuẫn dữ liệu"
      ]
    }
  ],
  "foundations": [
    {
      "id": "foundation_overview",
      "title": "Tổng quan Y học cổ học",
      "summary": "Y học cổ học phương Đông nhìn cơ thể như một hệ cân bằng giữa âm dương, khí huyết, tạng phủ, kinh lạc, thời tiết, sinh hoạt và cảm xúc. Khi đưa vào app, khung này chỉ dùng để học hiểu và tự quan sát.",
      "appUse": [
        "Làm màn nguyên tắc trước khi người dùng trả lời form.",
        "Đưa vào thư viện tự học.",
        "Gắn disclaimer trong mọi kết quả."
      ],
      "safeWording": [
        "Theo cách nhìn cổ học, dữ liệu của bạn nghiêng về...",
        "Kết quả này chỉ là gợi ý tự quan sát, không phải chẩn đoán."
      ],
      "forbidden": [
        "Chẩn đoán bệnh cụ thể.",
        "Khẳng định người dùng đang mắc bệnh.",
        "So sánh máy móc với chỉ số xét nghiệm hiện đại."
      ],
      "sourceRefs": [
        "deep-research-report: scope summary",
        "user-scope-file: app định vị"
      ]
    },
    {
      "id": "yin_yang",
      "title": "Nền tảng Âm Dương",
      "summary": "Âm và Dương là cặp khái niệm đối đãi: tĩnh/động, trong/ngoài, lạnh/nóng, vật chất/chức năng. Trong app, âm dương dùng để mô tả xu hướng cảm nhận của cơ thể, không phải nhãn bệnh.",
      "appUse": [
        "Mapping câu hỏi nóng/lạnh, khô/ẩm, nghỉ/ngủ, vận động.",
        "Giải thích kết quả thiên hàn, thiên nhiệt, âm hư, dương hư ở mức tham khảo."
      ],
      "safeWording": [
        "Một vài câu trả lời gợi ý xu hướng thiên hàn/thiên nhiệt.",
        "Cần thêm dữ liệu về ngủ, khát, đại tiện và quan sát lưỡi để đọc mềm hơn."
      ],
      "forbidden": [
        "Kết luận âm hư/dương hư như bệnh danh.",
        "Gợi ý tự dùng thuốc bổ âm/bổ dương."
      ],
      "sourceRefs": [
        "YHCT foundation: Âm/Dương"
      ]
    },
    {
      "id": "five_elements_zangfu",
      "title": "Ngũ hành và Tạng phủ",
      "summary": "Mộc, Hỏa, Thổ, Kim, Thủy là mô hình liên hệ chức năng. Năm tạng chính trong app gồm Can, Tâm, Tỳ, Phế, Thận. Các tạng ở đây là khái niệm cổ học, không đồng nhất hoàn toàn với cơ quan giải phẫu hiện đại.",
      "appUse": [
        "Tạo bản đồ tự học.",
        "Gợi ý xu hướng tạng phủ cơ bản như tỳ vị hư, phế khí hư, can khí uất, thận khí hư."
      ],
      "safeWording": [
        "Theo ngôn ngữ cổ học, nhóm dấu hiệu này thường được đặt gần trục Tỳ/Vị.",
        "Không nên hiểu 'Tỳ' hay 'Can' như kết luận về lá lách hay gan trong y học hiện đại."
      ],
      "forbidden": [
        "Nói gan/thận/phổi của người dùng có bệnh.",
        "Gợi ý xét nghiệm hoặc điều trị theo kết quả app."
      ],
      "sourceRefs": [
        "deep-research-report: Ngũ hành tạng phủ"
      ]
    },
    {
      "id": "qi_blood_essence_fluids",
      "title": "Khí, Huyết, Tinh, Tân dịch",
      "summary": "Khí, Huyết, Tinh, Tân dịch là nhóm khái niệm cổ học mô tả sức vận hành, nuôi dưỡng, nền tảng sinh lực và độ ẩm của cơ thể. App chỉ dùng để giải thích xu hướng cảm nhận.",
      "appUse": [
        "Pattern khí hư, khí trệ, huyết hư, huyết ứ, âm hư, dương hư, đàm thấp.",
        "Tạo glossary dễ hiểu."
      ],
      "safeWording": [
        "Dữ liệu hiện tại gợi ý xu hướng khí hư nhẹ.",
        "Nên xem như ngôn ngữ tự quan sát, không phải chỉ số xét nghiệm."
      ],
      "forbidden": [
        "Nói người dùng thiếu máu theo y học hiện đại.",
        "Tự dùng thuốc hoạt huyết, bổ khí, bổ huyết."
      ],
      "sourceRefs": [
        "deep-research-report: Khí Huyết Tinh Tân dịch"
      ]
    },
    {
      "id": "meridians",
      "title": "Kinh lạc cơ bản",
      "summary": "Kinh lạc là hệ quy chiếu cổ học về đường vận hành khí huyết. Trong app, kinh lạc chỉ dùng cho mục tự học và dưỡng sinh nhẹ, không hướng dẫn tự châm cứu/bấm huyệt trị bệnh.",
      "appUse": [
        "Màn tự học về 12 kinh chính.",
        "Gợi ý vận động nhẹ, thở, thư giãn, không chỉ huyệt trị bệnh."
      ],
      "safeWording": [
        "Mục này giúp hiểu khái niệm kinh lạc ở mức nhập môn.",
        "Không tự châm cứu, bấm huyệt sâu hoặc xử lý triệu chứng nặng tại nhà."
      ],
      "forbidden": [
        "Hướng dẫn tự châm cứu.",
        "Chỉ huyệt để trị đau, trị bệnh, hạ sốt."
      ],
      "sourceRefs": [
        "WHO terminology/meridian nomenclature",
        "deep-research-report: Kinh lạc"
      ]
    },
    {
      "id": "four_examinations",
      "title": "Tứ chẩn",
      "summary": "Vọng, Văn, Vấn, Thiết là bốn nhóm quan sát trong YHCT. App chỉ dùng phần tự khai và tự quan sát đơn giản, không thay thế thăm khám trực tiếp.",
      "appUse": [
        "Form hỏi về giấc ngủ, ăn uống, nóng/lạnh, đại tiện, tiểu tiện, cảm xúc, mệt mỏi.",
        "Quan sát lưỡi ở mức người dùng tự mô tả, luôn đánh độ tin cậy thấp."
      ],
      "safeWording": [
        "Quan sát lưỡi có thể sai do ánh sáng, ăn uống, thuốc, vệ sinh miệng hoặc camera.",
        "Thiếu dữ liệu mạch và thăm khám trực tiếp nên kết quả chỉ là gợi ý."
      ],
      "forbidden": [
        "Tự bắt mạch để kết luận bệnh.",
        "Dùng ảnh lưỡi để chẩn đoán chắc chắn."
      ],
      "sourceRefs": [
        "deep-research-report: Tứ chẩn"
      ]
    }
  ],
  "fiveElements": [
    {
      "element": "Mộc",
      "zang": "Can",
      "fu": "Đởm",
      "appMeaning": "sơ tiết, cảm xúc uất/kích, gân mắt ở mức cổ học",
      "safeUse": "Dùng cho pattern can khí uất, không đồng nhất với bệnh gan."
    },
    {
      "element": "Hỏa",
      "zang": "Tâm",
      "fu": "Tiểu trường",
      "appMeaning": "thần chí, giấc ngủ, cảm giác nóng bứt rứt",
      "safeUse": "Dùng để giải thích mất ngủ/bứt rứt nhẹ, không kết luận bệnh tim."
    },
    {
      "element": "Thổ",
      "zang": "Tỳ",
      "fu": "Vị",
      "appMeaning": "tiêu hóa, chuyển hóa, cảm giác nặng, ăn uống",
      "safeUse": "Dùng cho tỳ vị hư/đàm thấp, không kết luận bệnh dạ dày."
    },
    {
      "element": "Kim",
      "zang": "Phế",
      "fu": "Đại trường",
      "appMeaning": "hơi thở, tiếng nói, da, đại tiện theo cổ học",
      "safeUse": "Dùng cho phế khí hư, không kết luận bệnh phổi."
    },
    {
      "element": "Thủy",
      "zang": "Thận",
      "fu": "Bàng quang",
      "appMeaning": "nền tảng, lưng gối, tiểu tiện, sức bền",
      "safeUse": "Dùng cho thận khí hư/dương hư, không kết luận bệnh thận."
    }
  ],
  "eightPrinciples": [
    {
      "pair": "biểu / lý",
      "meaning": "Xu hướng ở ngoài/nông hoặc ở trong/sâu theo cổ học.",
      "questions": [
        "q_symptom_onset",
        "q_body_aches"
      ],
      "caution": "App không đủ dữ liệu để phân định biểu/lý chắc chắn."
    },
    {
      "pair": "hàn / nhiệt",
      "meaning": "Xu hướng lạnh/nóng trong cảm nhận cơ thể.",
      "questions": [
        "q_cold_sensation",
        "q_limb_cold",
        "q_heat_sensation",
        "q_thirst_preference"
      ],
      "caution": "Nóng/lạnh có thể do môi trường, thuốc, bệnh nền hoặc hormone."
    },
    {
      "pair": "hư / thực",
      "meaning": "Xu hướng thiếu lực/suy yếu hoặc ứ trệ/tắc nghẽn.",
      "questions": [
        "q_energy_level",
        "q_body_heaviness",
        "q_pain_quality"
      ],
      "caution": "Không dùng để nói cơ thể 'yếu bệnh' hay 'thừa độc'."
    },
    {
      "pair": "âm / dương",
      "meaning": "Khung tổng hợp hai mặt tĩnh/động, lạnh/nóng, vật chất/chức năng.",
      "questions": [
        "q_dry_mouth",
        "q_night_sweat",
        "q_cold_sensation"
      ],
      "caution": "Không kết luận âm hư/dương hư nếu dữ liệu ít hoặc mâu thuẫn."
    }
  ],
  "tongueObservation": {
    "allowed": [
      "Màu lưỡi: nhạt, đỏ, tím, hồng bình thường, không chắc.",
      "Rêu lưỡi: trắng mỏng, trắng dày, vàng, vàng dày, ít/không rêu, không chắc.",
      "Độ ẩm: khô, ướt, bình thường, không chắc.",
      "Hình thái: dấu răng, bệu, gầy, nứt, bình thường, không chắc."
    ],
    "warnings": [
      "Ánh sáng, camera, thức ăn, cà phê/trà, thuốc, vệ sinh miệng và thời điểm chụp có thể làm sai quan sát.",
      "Không dùng ảnh lưỡi để tự chẩn đoán.",
      "Không kết luận bệnh từ lưỡi nếu không có thăm khám trực tiếp."
    ]
  },
  "herbalEducationOnly": {
    "title": "Dược liệu và phương tễ chỉ ở mức tự học",
    "allowed": [
      "Giải thích quân thần tá sứ là nguyên tắc phối ngũ trong phương tễ cổ học.",
      "Giải thích tính vị quy kinh là cách cổ học mô tả tính chất dược liệu.",
      "Nêu vì sao không tự dùng: tương tác thuốc, thai kỳ, trẻ em, người cao tuổi, bệnh nền, dị ứng, độc tính."
    ],
    "forbidden": [
      "Không liệt kê công thức dùng tại nhà.",
      "Không đưa liều lượng.",
      "Không gợi ý mua/uống/sắc thuốc.",
      "Không gắn dược liệu vào kết quả cá nhân."
    ]
  },
  "uxFlow": [
    {
      "screen": "Hero",
      "content": [
        "Y - Y học cổ học tham khảo",
        "Học hiểu và tự quan sát thể trạng theo cổ học",
        "Bắt đầu tự quan sát",
        "Đọc nguyên tắc an toàn"
      ]
    },
    {
      "screen": "Nguyên tắc",
      "content": [
        "Không chẩn đoán",
        "Không kê đơn",
        "Không thay thế bác sĩ",
        "Red flags đi khám trước"
      ]
    },
    {
      "screen": "Form tự quan sát",
      "content": [
        "Từng bước",
        "Có Không chắc/Bỏ qua",
        "Không bắt buộc trả lời hết",
        "Red flag screening trước"
      ]
    },
    {
      "screen": "Kết quả",
      "content": [
        "Xu hướng thể trạng",
        "Mức độ dữ liệu",
        "Dữ liệu còn thiếu",
        "Gợi ý dưỡng sinh nhẹ",
        "Khi nào nên đi khám"
      ]
    },
    {
      "screen": "Tự học",
      "content": [
        "Glossary",
        "Bản đồ tạng phủ",
        "Bát cương",
        "Tứ chẩn",
        "Dược liệu chỉ học thuật"
      ]
    }
  ],
  "toneUI": {
    "visual": [
      "cổ học",
      "trầm",
      "vàng đồng",
      "đen nâu",
      "giấy cổ",
      "thủy mặc"
    ],
    "avoid": [
      "neon",
      "game phép thuật",
      "SaaS quá hiện đại",
      "hù dọa",
      "thần bí hóa quá mức"
    ]
  }
};
