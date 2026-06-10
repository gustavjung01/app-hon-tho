# Kế hoạch triển khai nhánh **Ngũ thuật → Mệnh → Tứ trụ** cho Hồn Thơ / Cổ học

> Tài liệu này dùng để giao tiếp tục cho AI-dev / Codex / dev triển khai.
> Mục tiêu là làm **đúng hướng, tách lớp rõ ràng, không phá web hiện tại**, và đủ nền để sau này mở rộng sang các nhánh Ngũ thuật khác.

---

## 1) Mục tiêu sản phẩm

Nhánh **Ngũ thuật → Mệnh → Tứ trụ** không làm theo kiểu chatbot luận số chung chung.
Phải đi theo hướng:

- có **công cụ tính Tứ trụ**
- có **kho tri thức cổ học**
- có **luận giải có cấu trúc**
- có **dẫn nguồn / đối chiếu**
- có khả năng mở rộng thành **thư viện nghiên cứu** cho Cổ học

Mục tiêu phase đầu:

- tính được Tứ trụ từ ngày giờ sinh
- xuất kết quả ổn định, nhất quán
- hiển thị kết quả trên UI riêng
- chuẩn bị nền dữ liệu để sau này tích hợp sâu thêm sách và luận giải

---

## 2) Nguyên tắc kiến trúc đã chốt

### Không làm sai hướng
Không nhét toàn bộ logic Tứ trụ vào web ngay từ đầu.

### Phải tách thành 4 lớp

1. **Core engine**
   - lịch pháp
   - can chi
   - tứ trụ
   - ngũ hành
   - thập thần
   - đại vận / lưu niên cơ bản

2. **Knowledge / Data**
   - bảng quy tắc cứng
   - dữ liệu sách
   - snippet luận giải
   - case mẫu

3. **API adapter**
   - nhận input
   - validate
   - trả output JSON chuẩn
   - version hóa engine và data

4. **UI / Web integration**
   - form nhập liệu
   - màn hình kết quả
   - tab tổng quan / chi tiết / dẫn nguồn / nghiên cứu

### Kết luận kiến trúc
Làm **công cụ Tứ trụ độc lập trước**, test ổn, rồi mới tích hợp vào web.
Cách này giảm rủi ro sửa lan, giúp dễ bảo trì, dễ mở rộng sang các nhánh khác.

---

## 3) Tại sao phải làm công cụ trước

Nếu nhét thẳng Tứ trụ vào web từ đầu thì dễ gặp:

- logic tính đụng trực tiếp UI
- khó debug
- khó thay đổi quy tắc
- sau này tích hợp sách bị rối
- khó tái sử dụng cho desktop / mobile / API riêng

Nếu làm công cụ trước:

- web chỉ là lớp hiển thị
- có thể test logic độc lập
- dễ thay engine
- dễ mở rộng sang Thái Ất / Kỳ Môn / Lục Nhâm / Tử vi về sau

---

## 4) Phạm vi phase 1

### Mục tiêu phase 1
Làm **engine Tứ trụ chuẩn cơ bản** + **UI nhập/xem kết quả**.

### Phase 1 bao gồm

- nhập ngày tháng năm giờ sinh
- chọn âm lịch / dương lịch
- múi giờ / nơi sinh nếu cần
- giới tính
- đổi sang can chi năm tháng ngày giờ
- lập Tứ trụ
- tính:
  - ngũ hành
  - thập thần
  - vượng suy cơ bản
  - đại vận
  - lưu niên cơ bản
- xuất JSON kết quả
- dựng UI xem nhanh

### Phase 1 chưa làm

- luận giải quá sâu theo nhiều trường phái
- AI tự luận tự do
- so sánh nhiều hệ sách cùng lúc
- đa tài khoản / lưu hồ sơ người dùng phức tạp
- dashboard phân tích cao cấp

---

## 5) Phạm vi phase 2

### Mục tiêu phase 2
Bổ sung **kho tri thức cổ học có nguồn**.

### Bao gồm

- dữ liệu sách đã chuẩn hóa
- quy tắc hợp / xung / hình / hại / phá
- tàng can
- trường sinh 12 cung
- cách cục / thân nhược thân vượng
- dụng thần / hỷ thần / kỵ thần
- đoạn trích / snippet luận giải
- ví dụ lá số mẫu
- liên kết chéo giữa các chủ đề

### Phase 2 chưa làm
- AI tự sáng tác luận đoán ngoài data
- khẳng định định mệnh kiểu mê tín
- kết luận mạnh tay nếu không đủ rule / nguồn

---

## 6) Phạm vi phase 3

### Mục tiêu phase 3
Tích hợp sâu vào web Cổ học.

### Bao gồm

- route chính trong web:
  - `Cổ học`
  - `Ngũ thuật`
  - `Mệnh`
  - `Tứ trụ`
- tab:
  - Tổng quan
  - Chi tiết
  - Vận hạn
  - Dẫn nguồn
  - Nghiên cứu sâu
- lưu lịch sử tra cứu
- case study / bài viết liên quan
- mở nền cho các nhánh khác cùng hệ

---

## 7) Dữ liệu nguồn mở và dữ liệu sách

### Đã chốt
Có thể dùng **nguồn mở cho phần engine tính**.
Nhưng **không có sẵn kho dữ liệu sách luận mệnh lớn, sạch, hợp pháp** để tải về dùng ngay.

### Kết luận
Phải tách 2 phần:

#### A. Dùng nguồn mở cho engine
Ví dụ:
- chuyển đổi lịch
- tiết khí
- can chi
- four pillars / BaZi

#### B. Tự xây knowledge base cho sách
Pipeline nên là:

- scan / ảnh sách
- OCR
- làm sạch
- chia đoạn
- gắn tag
- gắn nguồn
- kiểm duyệt thủ công
- đưa vào DB

---

## 8) Cảnh báo quan trọng

### Không làm chatbot xem số trước
Nếu chưa có:

- engine chuẩn
- rule chuẩn
- data chuẩn hóa
- dẫn nguồn rõ

mà để AI luận ngay thì sẽ dễ:

- nói hay nhưng sai
- lẫn hệ
- mâu thuẫn
- mất uy tín nhánh cổ học

### Nguyên tắc bắt buộc
AI chỉ được **diễn giải trên nền data đã kiểm duyệt** hoặc trên kết quả engine.

---

## 9) Input cần chốt

Ít nhất form phải có:

- ngày sinh
- tháng sinh
- năm sinh
- giờ sinh
- phút sinh
- chọn lịch:
  - dương lịch
  - âm lịch
- giới tính
- múi giờ
- nơi sinh (nếu cần cho các bản sau)

### Gợi ý input schema

```json
{
  "birthDate": "1990-10-12",
  "birthTime": "14:30",
  "calendarType": "solar",
  "gender": "male",
  "timezone": "Asia/Ho_Chi_Minh",
  "birthPlace": "Tien Giang, Vietnam"
}
```

---

## 10) Output cần chốt

Output không được mơ hồ.
Phải trả JSON có cấu trúc ổn định.

### Gợi ý output schema

```json
{
  "engine_version": "1.0.0",
  "rule_set_version": "core-v1",
  "book_data_version": "kb-v1",
  "input": {
    "birthDate": "1990-10-12",
    "birthTime": "14:30",
    "calendarType": "solar",
    "gender": "male",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "pillars": {
    "year": {
      "stem": "Canh",
      "branch": "Ngọ"
    },
    "month": {
      "stem": "Bính",
      "branch": "Tuất"
    },
    "day": {
      "stem": "Tân",
      "branch": "Mão"
    },
    "hour": {
      "stem": "Ất",
      "branch": "Mùi"
    }
  },
  "analysis": {
    "ngu_hanh": {},
    "thap_than": {},
    "vuong_suy": {},
    "dai_van": [],
    "luu_nien": []
  },
  "explanations": {
    "summary": [],
    "details": [],
    "source_refs": []
  }
}
```

---

## 11) Cấu trúc dữ liệu knowledge base

Ít nhất cần các bảng / collection sau:

- `books`
- `chapters`
- `rules_core`
- `glossary_terms`
- `chart_patterns`
- `interpretation_snippets`
- `case_studies`
- `cross_references`

Nếu có lưu lịch sử người dùng:

- `user_charts`
- `chart_results_cache`
- `explanation_logs`

### Gợi ý cấu trúc một snippet

```json
{
  "id": "menh-tt-00125",
  "topic": "thien-can-hop",
  "keywords": ["giap", "ky", "hop-hoa-tho"],
  "condition": {
    "can1": "Giáp",
    "can2": "Kỷ"
  },
  "meaning_short": "Giáp Kỷ hợp, cần xét mùa sinh và toàn cục để định hóa hay không.",
  "meaning_long": "Khi Giáp gặp Kỷ cần xét lệnh tháng, thông căn, trợ hóa, khắc trở...",
  "source_book": "Tên sách",
  "source_chapter": "Quyển 2 - Thiên can hợp hóa",
  "confidence": "core"
}
```

---

## 12) Rule phân tầng dữ liệu

Nên phân 3 tầng ngay từ đầu:

### Core
- quy tắc nền
- dùng trực tiếp cho engine
- mức tin cậy cao

### Reference
- sách tham khảo
- mở rộng góc nhìn
- không ép thành kết luận cứng

### Quote
- trích đoạn để đọc sâu
- dùng cho tab dẫn nguồn / nghiên cứu

Việc phân tầng này giúp dev không trộn lung tung.

---

## 13) Đề xuất stack kỹ thuật

Có thể dùng một trong các hướng:

### Hướng A: Node.js / TypeScript
Hợp nếu web hiện tại là Next.js.

Ưu điểm:
- đồng bộ stack
- dễ bọc API
- dễ tích hợp vào web

### Hướng B: Python engine + web gọi API
Hợp nếu muốn engine nghiên cứu / tính toán riêng.

Ưu điểm:
- dễ xử lý data / OCR / script nhập sách
- phù hợp build knowledge pipeline

### Hướng C: Monorepo
Ví dụ:

- `apps/web`
- `packages/tu-tru-engine`
- `packages/knowledge-core`

### Khuyến nghị
Nếu Hồn Thơ / Cổ học hiện đang dùng web Next.js, nên đi:

- **web: Next.js**
- **engine: package TypeScript riêng** hoặc **service riêng**
- **knowledge: SQLite/Postgres**
- **script nhập dữ liệu sách: Python hoặc Node script**

---

## 14) Kiến trúc thư mục gợi ý

```text
apps/
  web/
    src/app/co-hoc/ngu-thuat/menh/tu-tru/
    src/components/tu-tru/
    src/lib/api/

packages/
  tu-tru-engine/
    src/calendar/
    src/canchi/
    src/pillars/
    src/analysis/
    src/index.ts

  knowledge-core/
    data/
    src/rules/
    src/snippets/
    src/index.ts

scripts/
  import-books/
  normalize-kb/
  validate-rules/
```

---

## 15) API endpoint gợi ý

### Public / internal API

- `POST /api/co-hoc/tu-tru/calculate`
- `POST /api/co-hoc/tu-tru/explain`
- `GET /api/co-hoc/tu-tru/rules`
- `GET /api/co-hoc/tu-tru/case-studies`

### Ý nghĩa

#### `/calculate`
- nhận input ngày giờ sinh
- trả chart + kết quả tính

#### `/explain`
- nhận chart hoặc result
- trả lời giải có cấu trúc dựa trên knowledge base

---

## 16) UI web phase đầu

### Route
`/co-hoc/ngu-thuat/menh/tu-tru`

### Khối giao diện nên có

#### A. Hero
- tiêu đề: Tứ trụ
- mô tả ngắn
- lưu ý: đây là công cụ tham khảo cổ học

#### B. Form nhập liệu
- ngày sinh
- giờ sinh
- âm / dương lịch
- giới tính
- nút xem lá số

#### C. Kết quả tổng quan
- 4 trụ
- can chi
- ngũ hành
- thập thần nổi bật
- đại vận hiện tại

#### D. Tab chi tiết
- từng trụ
- tàng can
- hợp xung
- vượng suy

#### E. Tab dẫn nguồn
- quy tắc nào áp dụng
- sách nào liên quan
- đoạn trích ngắn

#### F. Tab nghiên cứu sâu
- giải thích dài hơn
- cross references
- case tương tự

---

## 17) Wording / giọng điệu

Vì đây nằm trong nhánh Cổ học của Hồn Thơ, nên wording phải:

- trang nhã
- điềm tĩnh
- nghiên cứu
- không giật gân
- không mê tín hóa

### Không dùng
- “xem số chuẩn 100%”
- “định mệnh đời bạn”
- “biết trước tất cả”
- “luận cực chuẩn”
- các câu khẳng định mạnh tay kiểu bói toán đại trà

### Nên dùng
- “công cụ tham khảo”
- “gợi mở theo cổ học”
- “đối chiếu theo quy tắc”
- “dẫn nguồn / cách hiểu”
- “nghiên cứu / học thuật”

---

## 18) Rủi ro cần tránh

### Rủi ro 1
Không chốt chuẩn input/output từ đầu
→ sau này engine và web lệch format

### Rủi ro 2
Không version hóa
→ kết quả cũ mới khác nhau không truy vết được

### Rủi ro 3
Dữ liệu sách chưa kiểm duyệt mà đã cho AI dùng
→ luận sai / lẫn hệ

### Rủi ro 4
Nhét logic vào web component
→ sửa UI là đụng engine

### Rủi ro 5
Không tách core và reference
→ kết luận lẫn giữa rule cứng và sách tham khảo

---

## 19) Checklist phase 1 cho dev

### A. Core engine
- [ ] nhận input ngày giờ sinh
- [ ] đổi lịch nếu cần
- [ ] tính can chi năm tháng ngày giờ
- [ ] dựng 4 trụ
- [ ] tính ngũ hành
- [ ] tính thập thần
- [ ] tính đại vận cơ bản
- [ ] xuất JSON chuẩn

### B. API
- [ ] tạo `/api/co-hoc/tu-tru/calculate`
- [ ] validate input
- [ ] trả output đúng schema
- [ ] có `engine_version`

### C. UI
- [ ] trang `/co-hoc/ngu-thuat/menh/tu-tru`
- [ ] form nhập liệu
- [ ] khối tổng quan
- [ ] tab chi tiết

### D. Data
- [ ] tạo seed dữ liệu core cơ bản
- [ ] chuẩn bị table / json cho rules
- [ ] chưa đưa AI tự luận ngoài data

---

## 20) Checklist phase 2 cho dev

- [ ] thêm `books`
- [ ] thêm `chapters`
- [ ] thêm `interpretation_snippets`
- [ ] thêm `case_studies`
- [ ] script import sách
- [ ] chuẩn hóa tagging
- [ ] link quy tắc với kết quả engine
- [ ] tab dẫn nguồn hoạt động

---

## 21) Những gì chưa làm ở giai đoạn này

- không đa người dùng phức tạp
- không dashboard admin lớn
- không mở hết các môn khác cùng lúc
- không chatbot luận tự do
- không đẩy production khi chưa test logic
- không commit/push/build nếu chưa được yêu cầu

---

## 22) Prompt tổng giao cho AI-dev / Codex

```text
Triển khai module Ngũ thuật → Mệnh → Tứ trụ theo kiến trúc tách lớp.

Mục tiêu phase 1:
- làm engine Tứ trụ độc lập
- không nhét logic trực tiếp vào web component
- có API calculate
- có UI nhập ngày giờ sinh và xem kết quả cơ bản

Yêu cầu:
1. Tạo core engine tách riêng:
   - calendar
   - canchi
   - pillars
   - analysis
2. Tạo output JSON có schema ổn định.
3. Tạo route:
   POST /api/co-hoc/tu-tru/calculate
4. Tạo page:
   /co-hoc/ngu-thuat/menh/tu-tru
5. UI gồm:
   - hero
   - form nhập liệu
   - tổng quan kết quả
   - tab chi tiết
6. Chuẩn bị nền data core cho:
   - ngũ hành
   - thập thần
   - tàng can
   - hợp xung cơ bản
7. Không làm chatbot luận số tự do.
8. Không dùng wording mê tín giật gân.
9. Không sửa lan các nhánh khác của web.
10. Không build/dev/commit/push nếu chưa yêu cầu.

Sau khi làm xong chỉ báo:
- file tạo
- file sửa
- cấu trúc thư mục
- schema input/output
- phần nào còn TODO cho phase 2
```

---

## 23) Kết luận chốt

Nhánh **Ngũ thuật → Mệnh → Tứ trụ** phải đi theo hướng:

- **công cụ trước**
- **dữ liệu sách sau**
- **web chỉ là lớp tích hợp hiển thị**

Đây là cách bền nhất để:
- không phá web
- giữ độ nghiêm túc cho Cổ học
- mở rộng được sang các nhánh Ngũ thuật khác
- tránh AI luận bừa
