# Brief xử lý file nghiên cứu: Mai Hoa Dịch Số

## Mục tiêu sử dụng

File nghiên cứu được chuyển thành brief sản phẩm cho mini-app:

```text
/nguthuat/boc/maihoa
```

Tên app đề xuất:

```text
Bốc - Mai Hoa Dịch Số
```

Định vị:

```text
Ứng dụng tra cứu và thực hành Mai Hoa Dịch Số có kiểm soát.
Không định vị là công cụ tiên tri tuyệt đối.
Không dùng ngôn từ hù dọa.
Không thay thế tư duy độc lập, tư vấn chuyên môn, y tế, pháp lý, tài chính.
```

---

## 1. Kết luận quan trọng từ file nghiên cứu

### 1.1. Định vị học thuật

Mai Hoa Dịch Số nên được đặt trong mạch Dịch học / tượng số, dựa trên nền Yijing / Chu Dịch, nhưng không nên nói nó cùng niên đại với Chu Dịch.

Không khẳng định chắc chắn “Thiệu Ung trực tiếp viết Mai Hoa Dịch Số”. Cách viết an toàn:

```text
Mai Hoa Dịch Số thường được truyền thống gắn với Thiệu Ung và mạch Thiệu học, nhưng bản lưu hành hiện nay nên được xem là văn bản truyền thế/biên soạn muộn.
```

### 1.2. Lõi kỹ thuật

Mai Hoa có thể số hóa tốt vì lõi của nó là rule engine:

```text
chuẩn hóa đầu vào → quy số → chia dư 8 và 6 → sinh quẻ chủ / quẻ hỗ / quẻ biến / hào động → diễn giải có kiểm soát
```

Cần lưu rõ:

```text
method_type
ruleset_id
calendar_basis
raw_input
normalized_input
derivation
source_reference
```

### 1.3. Không gộp mọi nhánh thành một luật

Mai Hoa không chỉ có một cách “năm tháng ngày giờ”. Nó có nhiều kiểu khởi quẻ:

```text
thời gian
số vật
chữ / nét chữ
âm thanh
màu sắc
vật tượng
gió - chim
người / động vật / tĩnh vật
```

Giai đoạn đầu nên làm ít nhưng chắc.

---

## 2. Scope mini-app giai đoạn 1

### Nên làm trước

```text
1. Trang giới thiệu ngắn về Mai Hoa
2. Khởi quẻ theo thời gian
3. Khởi quẻ bằng 3 số nhập tay
4. Hiển thị quẻ chủ, quẻ hỗ, quẻ biến
5. Hiển thị thượng quái, hạ quái, hào động
6. Hiển thị vết tính toán từng bước
7. Diễn giải mềm theo hướng tham khảo
8. Cảnh báo sử dụng rõ ràng
```

### Chưa làm ở giai đoạn 1

```text
AI luận quẻ sâu
history/account thật
credit/payment
đồng bộ backend
âm thanh / chữ / vật tượng / màu sắc
dự báo chắc chắn
chấm điểm đúng sai
```

---

## 3. Route và UI đề xuất

Route chính:

```text
/nguthuat/boc/maihoa
```

Các khối UI:

```text
1. Hero
   - Bốc - Mai Hoa Dịch Số
   - Tra cứu tượng số, sinh quẻ từ thời gian hoặc số liệu đầu vào.

2. Khối chọn phương thức
   - Theo thời gian
   - Theo 3 số
   - Các phương thức khác: sắp ra mắt

3. Form nhập liệu
   - Câu hỏi / chủ đề tham khảo
   - Ngày giờ
   - Múi giờ
   - Lịch pháp/ruleset
   - hoặc 3 số

4. Khối kết quả
   - Quẻ chủ
   - Quẻ hỗ
   - Quẻ biến
   - Hào động
   - Thể / Dụng
   - Ngũ hành sinh khắc

5. Khối vết tính toán
   - Năm chi = ?
   - Tháng = ?
   - Ngày = ?
   - Giờ chi = ?
   - Thượng quái = mod1_8(...)
   - Hạ quái = mod1_8(...)
   - Hào động = mod1_6(...)

6. Khối diễn giải thận trọng
   - Nội dung tham khảo
   - Câu hỏi phản tư
   - Điều cần kiểm chứng thực tế
   - Không kết luận cực đoan

7. Khối nguồn và nguyên tắc
   - Ruleset đang dùng
   - Ghi chú lịch pháp
   - Cảnh báo sử dụng
```

Tone UI giữ chung với hệ app:

```text
cổ học
trầm
vàng đồng
đen nâu
giấy cổ
thủy mặc
không neon
không game phép thuật
```

---

## 4. Data model đề xuất

Tạo thư mục:

```text
apps/web/src/data/maihoa/
```

Các file:

```text
trigrams.json
hexagrams.json
rulesets.json
test_vectors.json
glossary.json
safety_copy.json
```

### trigrams.json

Mỗi quái cần có:

```json
{
  "id": 1,
  "mh_num": 1,
  "name_vi": "Càn",
  "name_han": "乾",
  "unicode": "☰",
  "bits": "111",
  "element": "Kim",
  "basic_symbol": "Trời",
  "family_role": "Cha",
  "keywords": ["kiện", "trời", "mạnh", "chủ động"]
}
```

Thứ tự số Mai Hoa:

```text
Càn 1
Đoài 2
Ly 3
Chấn 4
Tốn 5
Khảm 6
Cấn 7
Khôn 8
```

### hexagrams.json

Mỗi quẻ cần có:

```json
{
  "kw_index": 12,
  "name_vi": "Thiên Địa Bĩ",
  "name_han": "否",
  "unicode": "䷋",
  "upper_id": 1,
  "lower_id": 8,
  "bits": "111000",
  "short_meaning": "Bế tắc, chưa thông, cần thận trọng",
  "safe_interpretation": "Tình thế có dấu hiệu chưa thuận, nên kiểm tra điều kiện thực tế trước khi quyết định."
}
```

### rulesets.json

Mỗi luật cần có:

```json
{
  "ruleset_id": "mhds_time_v1",
  "method_type": "time",
  "calendar_basis": "earthly-branches+lunar-month-day",
  "description": "Khởi quẻ theo năm chi, tháng, ngày, giờ chi.",
  "status": "phase_1"
}
```

### test_vectors.json

Bắt buộc có test case từ file nghiên cứu:

```json
{
  "case_id": "mhds_time_001",
  "input": {
    "year_branch": { "label": "Tý", "value": 1 },
    "month": 5,
    "day": 27,
    "hour_branch": { "label": "Ngọ", "value": 7 }
  },
  "expected": {
    "upper": 1,
    "lower": 8,
    "moving_line": 4,
    "primary_kw": 12,
    "mutual_kw": 53,
    "changed_kw": 20
  }
}
```

---

## 5. Engine đề xuất

Tạo thư mục:

```text
apps/web/src/engine/maihoa/
```

Các file:

```text
mod.ts
types.ts
trigram.ts
hexagram.ts
timeMethod.ts
threeNumbersMethod.ts
mutualHexagram.ts
changedHexagram.ts
interpretation.ts
safety.ts
```

### Hàm nền

```ts
export function mod1(value: number, divisor: number): number {
  const remainder = value % divisor
  return remainder === 0 ? divisor : remainder
}
```

### Phương thức thời gian

```ts
upper = mod1(yearBranch + month + day, 8)
lower = mod1(yearBranch + month + day + hourBranch, 8)
movingLine = mod1(yearBranch + month + day + hourBranch, 6)
```

Output engine phải trả về:

```ts
{
  methodType,
  rulesetId,
  rawInput,
  normalizedInput,
  derivationSteps,
  upperTrigram,
  lowerTrigram,
  movingLine,
  primaryHexagram,
  mutualHexagram,
  changedHexagram,
  warnings
}
```

---

## 6. Nguyên tắc diễn giải

Không viết:

```text
chắc chắn xảy ra
đại họa
tai nạn
chết chóc
phá sản
định mệnh đã an bài
```

Nên viết:

```text
dấu hiệu cần thận trọng
nên kiểm tra thêm điều kiện thực tế
có thể xem như gợi ý phản tư
không nên dùng làm cơ sở quyết định duy nhất
```

Câu cảnh báo chuẩn:

```text
Kết quả chỉ phục vụ tham khảo và tự phản tư. Không dùng thay thế tư vấn chuyên môn, quyết định y tế, pháp lý, tài chính hoặc an toàn cá nhân.
```

---

## 7. Acceptance criteria

Một bản giai đoạn 1 được xem là đạt khi:

```text
1. /nguthuat/boc/maihoa mở được app thật, không còn placeholder.
2. Có form khởi quẻ theo thời gian.
3. Có form khởi quẻ bằng 3 số.
4. Test vector năm Tý 1, tháng 5, ngày 27, giờ Ngọ 7 ra:
   - thượng quái Càn
   - hạ quái Khôn
   - hào động 4
   - quẻ chủ Thiên Địa Bĩ
   - quẻ hỗ Phong Sơn Tiệm
   - quẻ biến Phong Địa Quán
5. Có vết tính toán rõ ràng.
6. Không có câu phán đoán cực đoan.
7. Mobile không tràn ngang.
8. npm run build pass.
```

---

## 8. Lệnh cho dev

```text
Xử lý file nghiên cứu Mai Hoa Dịch Số thành mini-app tại route:

/nguthuat/boc/maihoa

Không làm backend, không làm login, không làm credit, không làm AI luận quẻ sâu ở giai đoạn này.

Mục tiêu giai đoạn 1:
- Biến placeholder Bốc thành app Mai Hoa thật.
- Làm engine khởi quẻ theo thời gian và 3 số.
- Hiển thị quẻ chủ, quẻ hỗ, quẻ biến, hào động.
- Hiển thị vết tính toán.
- Diễn giải mềm, không phán đoán cực đoan.
- Dùng data JSON có cấu trúc.
- Build pass.

Trước khi code:
1. Đọc file nghiên cứu deep-research-report(2).md.
2. Tạo data:
   apps/web/src/data/maihoa/trigrams.json
   apps/web/src/data/maihoa/hexagrams.json
   apps/web/src/data/maihoa/rulesets.json
   apps/web/src/data/maihoa/test_vectors.json
   apps/web/src/data/maihoa/safety_copy.json

3. Tạo engine:
   apps/web/src/engine/maihoa/mod.ts
   apps/web/src/engine/maihoa/types.ts
   apps/web/src/engine/maihoa/timeMethod.ts
   apps/web/src/engine/maihoa/threeNumbersMethod.ts
   apps/web/src/engine/maihoa/hexagram.ts
   apps/web/src/engine/maihoa/mutualHexagram.ts
   apps/web/src/engine/maihoa/changedHexagram.ts
   apps/web/src/engine/maihoa/interpretation.ts

4. Tạo hoặc sửa route:
   /nguthuat/boc/maihoa

5. Test bắt buộc:
   Input:
   năm Tý = 1
   tháng = 5
   ngày = 27
   giờ Ngọ = 7

   Expected:
   upper = 1
   lower = 8
   movingLine = 4
   primary = Thiên Địa Bĩ, kw_index 12
   mutual = Phong Sơn Tiệm, kw_index 53
   changed = Phong Địa Quán, kw_index 20

6. Chạy:
   npm run build
   npm run dev

7. Chụp screenshot:
   - /nguthuat/boc/maihoa desktop
   - /nguthuat/boc/maihoa mobile
   - kết quả test vector

Không commit, không deploy cho tới khi báo cáo.
```
