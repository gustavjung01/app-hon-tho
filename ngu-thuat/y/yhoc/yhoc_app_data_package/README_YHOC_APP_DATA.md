# Y - Y học cổ học tham khảo: data package

Route dự kiến: `/nguthuat/y/yhoc`

Gói này đã chuyển file nghiên cứu thành cấu trúc data/engine dùng cho mini-app Y trong hệ Ngũ thuật.

## Nội dung đã xuất

```txt
src/data/yhoc/types.ts
src/data/yhoc/foundations.ts
src/data/yhoc/questions.ts
src/data/yhoc/patterns.ts
src/data/yhoc/rules.ts
src/data/yhoc/glossary.ts
src/data/yhoc/safety.ts
src/data/yhoc/resultTemplates.ts
src/data/yhoc/index.ts
src/engine/yhocEngine.ts
```

## Quy tắc an toàn đã khóa

- Chỉ học hiểu và tự quan sát thể trạng theo cổ học.
- Không chẩn đoán bệnh.
- Không kê đơn.
- Không đưa liều dược liệu/phương thuốc.
- Không khuyên bỏ điều trị y tế hiện đại.
- Red flags được kiểm trước rule engine.
- Nếu có red flag, engine dừng luận giải và trả cảnh báo đi khám/cấp cứu.

## Data chính

- `QUESTIONS`: 39 câu hỏi form theo nhóm giấc ngủ, tiêu hóa, nóng/lạnh, mệt mỏi, cảm xúc, lưỡi, red flags.
- `PATTERNS`: 12 nhóm thể trạng tham khảo.
- `RULES`: 50 rule demo có weight, caution, forbidden wording.
- `SAFETY_WARNINGS`: 18 red flags.
- `GLOSSARY`: 22 thuật ngữ nền.
- `RESULT_TEMPLATES`: 20 đoạn kết quả mẫu.
- `interpretYhocAnswers()`: engine tính xu hướng an toàn.

## Cách dùng nhanh

```ts
import { interpretYhocAnswers } from './src/engine/yhocEngine';

const result = interpretYhocAnswers({
  q_red_flags: ['none'],
  q_energy_level: 3,
  q_fatigue_after_activity: 'yes',
  q_short_breath_exertion: 'yes',
  q_voice_strength: 'weak',
});

console.log(result.topPatterns);
```

## Lưu ý dev

- Có thể import thẳng `QUESTIONS` để render form.
- Người dùng nên được phép chọn `Không chắc / bỏ qua`.
- Khi `emergencyFirst === true`, UI chỉ hiển thị `safetyWarnings`, không hiển thị pattern.
- Không đưa phần dược liệu/phương tễ vào kết quả cá nhân.
- Không dùng các từ: “bị”, “chữa”, “khỏi”, “đơn thuốc”, “liều”, “điều trị” trong output cá nhân.
