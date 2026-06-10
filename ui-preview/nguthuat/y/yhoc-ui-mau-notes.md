# UI Preview – Y học cổ học (`/nguthuat/y/yhoc`)

## Quy ước thư mục

| Thư mục | Mục đích |
|---|---|
| `ui-preview/nguthuat/y/` | Ảnh mẫu, moodboard, flow, notes – chỉ dùng tham khảo dev/design |
| `ngu-thuat/y/yhoc/src/assets/images/` | Ảnh production – source code import từ đây |
| `apps/web/public/nguthuat/y/yhoc/` | Build output tĩnh – không chỉnh tay |

## Files preview đề xuất

- `yhoc-ui-flow.png` – Sơ đồ luồng 5 màn hình
- `yhoc-hero-reference.png` – Mẫu màn hình Hero
- `yhoc-form-reference.png` – Mẫu màn hình Form (nhóm câu hỏi)
- `yhoc-result-reference.png` – Mẫu màn hình Kết quả
- `yhoc-learn-reference.png` – Mẫu màn hình Tự học / Glossary

## Luồng UI (5 màn hình)

```
Hero → Safety → Form → Result → Learn
         ↓ (có red flag)
       Result (cảnh báo khẩn)
```

## Palette màu

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--bg` | `#0c0a07` | Nền toàn app |
| `--surface` | `#161209` | Header, footer |
| `--card` | `#1e1710` | Card, panel |
| `--gold` | `#c8a84b` | Tiêu đề, CTA, accent |
| `--muted` | `#8a7a60` | Text phụ, disclaimer |
| `--warn` | `#e67e22` | Cảnh báo thường |
| `--danger` | `#c0392b` | Cờ đỏ khẩn cấp |

## Ghi chú wording

- Không dùng từ "chẩn đoán", "kê đơn", "tự điều trị"
- Mọi kết quả đều có disclaimer: "Chỉ mang tính tham khảo – không thay thế bác sĩ"
- Màn hình Safety bắt buộc trước Form
- Red flag → hiển thị cảnh báo khẩn, không dẫn vào form
