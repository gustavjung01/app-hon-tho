# TAM THỨC - 3 APP TỔNG QUAN CHO DEV

## Mục đích

File này đặt trong `plan/` của repo `app-hon-tho`, giúp dev mới nắm nhanh nhánh **Tam thức**.

Nhánh Tam thức hiện là khu app tham khảo, tra cứu và thực hành có kiểm soát, chưa phải nơi đưa ra phán đoán tuyệt đối.

## Vị trí trong kiến trúc

```text
www.hontho.com = web nội dung chính
app.hontho.com = khu app riêng
app.hontho.com/tam-thuc = nhánh Tam thức
```

Ba app con dự kiến:

```text
app.hontho.com/tam-thuc/ky-mon
app.hontho.com/tam-thuc/thai-at
app.hontho.com/tam-thuc/luc-nham
```

## Route cần giữ ổn định

| Nhánh | Route | Trạng thái hiện tại | Ghi chú |
|---|---|---|---|
| Tam thức home | `/tam-thuc` | Đã dựng trang chủ/landing | Có 3 card Kỳ Môn, Thái Ất, Lục Nhâm |
| Kỳ Môn | `/tam-thuc/ky-mon` | Placeholder | Chưa làm app thật |
| Thái Ất | `/tam-thuc/thai-at` | Placeholder | Chưa làm app thật |
| Lục Nhâm | `/tam-thuc/luc-nham` | Placeholder | Chưa làm app thật |

Không đổi route nếu chưa có xác nhận của chủ dự án.

## Kỳ Môn

Route:

```text
/tam-thuc/ky-mon
```

Mục tiêu:

```text
App tra cứu/tham khảo Kỳ Môn theo dữ liệu và quy tắc rõ ràng.
```

Trạng thái:

```text
Chưa làm app thật, chỉ placeholder.
```

Còn dang dở:

```text
- Chưa có data nền
- Chưa có engine lập cục
- Chưa có UI nhập dữ liệu
- Chưa có trang kết quả
- Chưa có glossary
- Chưa có nguồn tham khảo
```

Nguyên tắc:

```text
- Không phán đoán tuyệt đối
- Không dùng lời hù dọa
- Ưu tiên giải thích cấu trúc, lớp nghĩa, dữ kiện đầu vào
- Nếu thiếu dữ liệu thì báo thiếu, không bịa
```

## Thái Ất

Route:

```text
/tam-thuc/thai-at
```

Mục tiêu:

```text
App tham khảo Thái Ất, thiên thời, vận động hệ thống theo nguồn có kiểm soát.
```

Trạng thái:

```text
Chưa làm app thật, chỉ placeholder.
```

Còn dang dở:

```text
- Chưa có bộ dữ liệu nền
- Chưa có quy tắc tính/lập mô hình
- Chưa có UI nhập dữ liệu
- Chưa có tầng diễn giải mềm
- Chưa có ghi chú nguồn
```

Nguyên tắc:

```text
- Thái Ất là nhánh khó, không làm nhanh kiểu đoán mò
- Cần gom data/nguồn trước khi code engine
- Ưu tiên hiển thị cấu trúc và tham khảo, không kết luận cứng
```

## Lục Nhâm

Route:

```text
/tam-thuc/luc-nham
```

Mục tiêu:

```text
App tham khảo Lục Nhâm theo tình huống, thời điểm, dữ kiện đầu vào.
```

Trạng thái:

```text
Chưa làm app thật, chỉ placeholder.
```

Còn dang dở:

```text
- Chưa có data nền
- Chưa có engine lập khóa/cục
- Chưa có UI nhập câu hỏi/tình huống
- Chưa có tầng diễn giải kết quả
- Chưa có cảnh báo giới hạn sử dụng
```

Nguyên tắc:

```text
- Không biến thành công cụ quyết định thay người dùng
- Không dùng ngôn từ định mệnh tuyệt đối
- Luôn ghi rõ đây là tham khảo cổ học
```

## Asset hiện có cho Tam thức

```text
apps/web/public/images/tam-thuc/bg-tamthuc-hero.webp
apps/web/public/images/tam-thuc/icon-ky-mon.webp
apps/web/public/images/tam-thuc/icon-thai-at.webp
apps/web/public/images/tam-thuc/icon-luc-nham.webp
```

Quy tắc:

```text
- Không tự đổi tên ảnh nếu không cập nhật code map ảnh.
- Không tự thêm ảnh ngoài.
- Không dùng style neon/game/phép thuật quá đà.
- Giữ tone cổ học, trầm, giấy cổ, vàng đồng, thủy mặc.
```

## UI/UX hướng Tam thức

Trang `/tam-thuc` cần giữ vai trò là sảnh nhánh Tam thức, không phải app con.

Tinh thần UI:

```text
- Nghiêm cẩn
- Trầm
- Ít phô trương
- Có cảm giác thư phòng cổ học
- Có biểu đồ, vòng thiên văn, lịch pháp, nhưng tiết chế
```

Không dùng:

```text
- Neon
- Ảnh ma thuật fantasy
- Hiệu ứng game
- Từ ngữ mê tín/hù dọa
- Kết luận kiểu chắc chắn tuyệt đối
```

## Wording nên dùng

```text
tham khảo
tra cứu có kiểm soát
thực hành có hệ thống
giải thích theo lớp nghĩa
phụ thuộc dữ kiện đầu vào
không thay thế tư duy độc lập
```

Tránh:

```text
chắc chắn
định mệnh
phán đúng 100%
hung/cát tuyệt đối
xấu không cứu được
đại họa
```

## Thứ tự làm đề xuất

Giai đoạn 1:

```text
- Hoàn thiện landing /tam-thuc
- Giữ 3 route con placeholder đẹp
- Kiểm tra responsive desktop/mobile
- Kiểm tra tiếng Việt/font
```

Giai đoạn 2:

```text
- Gom data nghiên cứu từng nhánh
- Làm glossary
- Làm schema dữ liệu
- Làm prototype UI nhập liệu
```

Giai đoạn 3:

```text
- Code engine nhỏ từng app
- Tách tầng tính toán và tầng diễn giải
- Thêm nguồn tham khảo
- Thêm cảnh báo giới hạn
```

Giai đoạn 4:

```text
- Gắn account/history/credit nếu hệ thống tổng đã sẵn sàng
- Không làm sớm nếu backend chưa có
```

## Checklist cho dev mới

Trước khi sửa:

```text
- Đọc README_FOR_KHUONG.md nếu có
- Đọc plan tổng
- Đọc file này
- Kiểm tra route hiện tại
- Kiểm tra asset hiện tại
```

Khi sửa:

```text
- Không đổi route tùy ý
- Không xóa asset đang dùng
- Không gắn app thật nếu chưa được yêu cầu
- Không sửa www.hontho.com
- Không đụng VPS/DNS/Caddy nếu task chỉ là frontend
```

Sau khi sửa:

```text
npm run build
npm run dev
```

Kiểm tra:

```text
/
/tam-thuc
/tam-thuc/ky-mon
/tam-thuc/thai-at
/tam-thuc/luc-nham
```

Báo cáo:

```text
- File đã sửa
- Route đã kiểm tra
- Build pass/lỗi
- Ảnh screenshot nếu có UI
- Việc nào còn dang dở
```

## Trạng thái hiện tại tóm tắt

```text
Tam thức home: Đã có landing cơ bản
Kỳ Môn: Placeholder
Thái Ất: Placeholder
Lục Nhâm: Placeholder
Data/engine/backend: Chưa làm
```

## Ghi nhớ quan trọng

```text
Tam thức là một sảnh nhánh trong app.hontho.com, không phải app con đơn lẻ.
Không biến Kỳ Môn/Thái Ất/Lục Nhâm thành công cụ phán chắc tuyệt đối.
Không dùng lời hù dọa hoặc định mệnh hóa.
Không làm engine nếu chưa có data và nguồn đủ chắc.
```
