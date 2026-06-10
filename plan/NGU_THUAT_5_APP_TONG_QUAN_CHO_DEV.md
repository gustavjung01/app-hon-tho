# NGŨ THUẬT - BẢN ĐỒ TỔNG 5 APP CHO DEV

## Mục đích

File này dùng để chuyển cho dev mới nắm nhanh toàn bộ nhánh **Ngũ thuật** trong hệ app Hồn Thơ.

Phạm vi hiện tại: `app.hontho.com/nguthuat` và 5 app con: **Sơn / Y / Mệnh / Bốc / Tướng**.

## Kiến trúc tổng

```text
www.hontho.com = web nội dung chính
app.hontho.com = khu app riêng
app.hontho.com/nguthuat = nhánh Ngũ thuật
```

Ngũ thuật có 5 app con:

```text
app.hontho.com/nguthuat/son/phongthu
app.hontho.com/nguthuat/y/yhoc
app.hontho.com/nguthuat/menh/tutru
app.hontho.com/nguthuat/boc/maihoa
app.hontho.com/nguthuat/tuong/xem-tuong
```

Lưu ý:

```text
Tứ Trụ chỉ là app con của nhánh Mệnh.
Tứ Trụ KHÔNG phải trang chủ app.hontho.com.
Tứ Trụ KHÔNG phải trang chủ Ngũ thuật.
```

## Repo liên quan

Repo app hub chính:

```text
https://github.com/khuongbinhinfo-a11y/app-hon-tho.git
```

Repo Tứ Trụ riêng:

```text
https://github.com/khuongbinhinfo-a11y/tu-tru.git
```

Tứ Trụ sau này gắn vào:

```text
app.hontho.com/nguthuat/menh/tutru
```

## Trạng thái tổng quan 5 app

| Nhánh | App | Route | Trạng thái hiện tại | Ghi chú |
|---|---|---|---|---|
| Sơn | Phong thủy an cư | `/nguthuat/son/phongthu` | Chưa code app thật | Phong thủy thực dụng, không mê tín |
| Y | Y học cổ học | `/nguthuat/y/yhoc` | Chưa code app thật | Cần gom data nghiên cứu chuyên sâu |
| Mệnh | Tứ Trụ | `/nguthuat/menh/tutru` | Có repo riêng | App con có tiến độ xa nhất |
| Bốc | Mai Hoa / 64 quẻ | `/nguthuat/boc/maihoa` | Chưa code app thật | Cần data Mai Hoa/Kinh Dịch |
| Tướng | Xem tướng tham khảo | `/nguthuat/tuong/xem-tuong` | Chưa code app thật | Cần wording rất thận trọng |

## Trạng thái app hub

Đã dựng:

```text
/
/nguthuat
/tam-thuc
```

Asset đặt ở:

```text
apps/web/public/images/app-home/
apps/web/public/images/nguthuat/
apps/web/public/images/tam-thuc/
```

Ảnh quan trọng cho Ngũ thuật:

```text
apps/web/public/images/nguthuat/bg-nguthuat-hero.webp
apps/web/public/images/nguthuat/icons-nguthuat-branches-sheet.webp
apps/web/public/images/nguthuat/icon-son.webp
apps/web/public/images/nguthuat/icon-y.webp
apps/web/public/images/nguthuat/icon-menh.webp
apps/web/public/images/nguthuat/icon-boc.webp
apps/web/public/images/nguthuat/icon-tuong.webp
```

Trang `/nguthuat` cần có 5 card:

```text
Sơn   → /nguthuat/son/phongthu
Y     → /nguthuat/y/yhoc
Mệnh  → /nguthuat/menh/tutru
Bốc   → /nguthuat/boc/maihoa
Tướng → /nguthuat/tuong/xem-tuong
```

## Sơn - Phong thủy an cư

Route:

```text
/nguthuat/son/phongthu
```

Định vị:

```text
Không gian - phương hướng - 8 hướng - 9 cung - bố cục - ánh sáng - khí lưu - động/tĩnh - công năng sử dụng
```

Không nên hiểu là:

```text
phán hung cát tuyệt đối
hù dọa gia chủ
bán vật phẩm phong thủy
thay thế chuyên gia khảo sát thực địa
```

Phase 1 ưu tiên:

```text
Bát trạch
Huyền không Phi tinh
```

## Y - Y học cổ học

Route:

```text
/nguthuat/y/yhoc
```

Định vị:

```text
tham khảo y học cổ học / Đông y / dưỡng sinh / tri thức cổ học liên quan thân thể
```

Không phải:

```text
chẩn đoán bệnh
kê thuốc cá nhân
thay thế bác sĩ
cam kết khỏi bệnh
```

Data cần gom:

```text
- Âm dương, ngũ hành, tạng phủ, khí huyết, kinh lạc
- Tứ chẩn: vọng, văn, vấn, thiết ở mức tham khảo học thuật
- Dưỡng sinh: ăn ngủ vận động, thời tiết, mùa, lối sống
- Huyệt vị: chỉ giải thích tham khảo
- Dược liệu: chỉ mô tả thông tin, không kê toa
```

## Mệnh - Tứ Trụ

Route:

```text
/nguthuat/menh/tutru
```

Repo riêng:

```text
https://github.com/khuongbinhinfo-a11y/tu-tru.git
```

Nguyên tắc:

```text
- App hub chỉ điều hướng tới Tứ Trụ.
- Không bê toàn bộ Tứ Trụ làm homepage.
- Chưa gắn thật nếu chưa chốt kiến trúc.
```

## Bốc - Mai Hoa / 64 quẻ

Route:

```text
/nguthuat/boc/maihoa
```

Định vị:

```text
Mai Hoa Dịch Số
64 quẻ
tham khảo tình huống
diễn giải có kiểm soát
```

Không nên viết:

```text
phán chắc tương lai
hù dọa kết quả
xúi người dùng quyết định cực đoan
```

Data cần gom:

```text
- 64 quẻ
- Thượng quái / hạ quái
- Hào động
- Quẻ chủ / quẻ hỗ / quẻ biến
- Cách lập quẻ theo thời gian/số/ngẫu nhiên
- Wording tham khảo theo tình huống
```

## Tướng - Xem tướng tham khảo

Route:

```text
/nguthuat/tuong/xem-tuong
```

Định vị:

```text
tham khảo văn hóa cổ học
giải thích biểu tượng/trường phái
không kết luận nhân phẩm, số phận, đạo đức hay giá trị con người
```

Không được viết:

```text
người mặt này chắc xấu/tốt
người này chắc phản bội
người này nghèo/giàu tuyệt đối
đánh giá đạo đức từ khuôn mặt
```

## Quy tắc wording chung

Dùng:

```text
tham khảo
có kiểm soát
gợi ý
khuynh hướng
trường hợp thường gặp
cần đối chiếu thêm
không thay thế tư duy độc lập
không thay thế chuyên gia
```

Tránh:

```text
chắc chắn
định mệnh
bắt buộc
đại hung
đại cát tuyệt đối
phải làm ngay
nếu không sẽ gặp họa
```

## Quy tắc UI chung

Tone:

```text
cổ học
trầm
vàng đồng
đen nâu
giấy cổ
thủy mặc
nhẹ, sâu, không rối
```

Tránh:

```text
neon
game phép thuật quá đà
SaaS hiện đại quá lạnh
màu tím/xanh điện
icon fantasy lòe loẹt
animation quá nhiều
```

## Ưu tiên làm tiếp

Giai đoạn 1:

```text
1. Hoàn thiện /, /nguthuat, /tam-thuc
2. Placeholder đẹp cho 5 app Ngũ thuật
3. Nút route hoạt động đúng
4. Build pass
5. Deploy static lên VPS
```

Giai đoạn 2:

```text
A. Gắn Tứ Trụ vì đã có repo sẵn
B. Làm Sơn trước vì phạm vi rõ, ít rủi ro hơn Y/Tướng
```

Giai đoạn 3:

```text
Y học cổ học
Mai Hoa / 64 quẻ
Tướng học tham khảo
```

## Checklist cho dev mới

```text
1. Đang ở đúng repo app-hon-tho chưa?
2. Đang sửa app hub hay repo Tứ Trụ?
3. Task này thuộc app nào trong 5 app Ngũ thuật?
4. Có được phép sửa app thật chưa hay chỉ placeholder?
5. Có được phép động vào backend/database chưa?
6. Có được phép gắn Tứ Trụ chưa?
7. Có dùng đúng ảnh trong apps/web/public/images chưa?
8. Có giữ tone cổ học, không neon, không game quá đà chưa?
```
