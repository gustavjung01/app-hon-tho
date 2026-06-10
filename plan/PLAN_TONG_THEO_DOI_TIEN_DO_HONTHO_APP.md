# PLAN TỔNG THEO DÕI TIẾN ĐỘ - HỒN THƠ APP

## Mục đích

File này đặt trong `plan/` của repo `app-hon-tho`, để dev mới biết app tổng có những nhánh nào, route nào đã dựng, app nào mới placeholder, việc nào còn dang dở và những phần không được đụng nhầm.

## Kiến trúc tổng

```text
www.hontho.com = web nội dung / SEO / brand
app.hontho.com = khu ứng dụng riêng
```

Repo app chính:

```text
https://github.com/khuongbinhinfo-a11y/app-hon-tho.git
```

Repo local:

```text
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho
```

## Route tổng hiện tại

```text
/
/nguthuat
/nguthuat/son/phongthu
/nguthuat/y/yhoc
/nguthuat/menh/tutru
/nguthuat/boc/maihoa
/nguthuat/tuong/xem-tuong
/tam-thuc
/tam-thuc/ky-mon
/tam-thuc/thai-at
/tam-thuc/luc-nham
```

## Bảng tiến độ tổng

| Khu | Route | Trạng thái | Ghi chú |
|---|---|---|---|
| App home | `/` | Đã dựng landing | Có 2 cổng Ngũ thuật/Tam thức |
| Ngũ thuật home | `/nguthuat` | Đã dựng landing | Có 5 card Sơn/Y/Mệnh/Bốc/Tướng |
| Sơn | `/nguthuat/son/phongthu` | Placeholder | App Phong thủy an cư, xử lý riêng |
| Y | `/nguthuat/y/yhoc` | Placeholder | Cần gom data y học phương Đông |
| Mệnh | `/nguthuat/menh/tutru` | Placeholder | Có repo Tứ Trụ riêng |
| Bốc | `/nguthuat/boc/maihoa` | Placeholder | Mai Hoa/64 quẻ, cần data/engine riêng |
| Tướng | `/nguthuat/tuong/xem-tuong` | Placeholder | Cần data/wording rất thận trọng |
| Tam thức home | `/tam-thuc` | Đã dựng landing | Có 3 card Kỳ Môn/Thái Ất/Lục Nhâm |
| Kỳ Môn | `/tam-thuc/ky-mon` | Placeholder | Chưa có data/engine |
| Thái Ất | `/tam-thuc/thai-at` | Placeholder | Nhánh khó, cần nghiên cứu trước |
| Lục Nhâm | `/tam-thuc/luc-nham` | Placeholder | Chưa có data/engine |

## Trạng thái asset

```text
apps/web/public/images/app-home/
apps/web/public/images/nguthuat/
apps/web/public/images/tam-thuc/
```

File asset manifest liên quan:

```text
ASSET_MANIFEST.md
PROMPT_CHO_DEV_ASSETS.md
```

Quy tắc asset:

```text
- Không tự đổi tên ảnh.
- Không xóa ảnh nếu chưa kiểm code đang dùng.
- Nếu thay ảnh phải cập nhật manifest và báo rõ.
```

## Các file plan nên có

```text
plan/PLAN_TONG_THEO_DOI_TIEN_DO_HONTHO_APP.md
plan/NGU_THUAT_5_APP_TONG_QUAN_CHO_DEV.md
plan/TAM_THUC_3_APP_TONG_QUAN_CHO_DEV.md
```

Sau này có thể thêm:

```text
plan/SON_PHONGTHUY_PLAN.md
plan/Y_YHOC_PLAN.md
plan/MENH_TUTRU_PLAN.md
plan/BOC_MAIHOA_PLAN.md
plan/TUONG_XEMTUONG_PLAN.md
plan/KY_MON_PLAN.md
plan/THAI_AT_PLAN.md
plan/LUC_NHAM_PLAN.md
```

## Việc đã làm

```text
- Chốt app.hontho.com là khu app riêng.
- Giữ www.hontho.com làm web nội dung/SEO/brand.
- Dựng route /, /nguthuat, /tam-thuc.
- Tạo asset UI cổ học cho 3 trang chủ.
- Tạo landing Ngũ thuật với 5 card.
- Tạo landing Tam thức với 3 card.
- Tạo placeholder cho các app con.
- VPS/Caddy/HTTPS đã chạy được.
```

## Việc còn dang dở

```text
- Cần kiểm mobile kỹ hơn.
- Cần kiểm font tiếng Việt trên Chrome/Edge thật.
- Cần kiểm tất cả route placeholder.
- Chưa làm backend.
- Chưa làm login/account thật.
- Chưa làm credit thật.
- Chưa làm history thật.
- Chưa gắn Tứ Trụ thật vào app hub.
- Các app con còn là placeholder.
```

## Quy tắc không được làm nhầm

```text
- Không dùng /home/nguthuat.
- Không biến Tứ Trụ thành trang chủ app tổng.
- Không sửa www.hontho.com khi task chỉ là app.hontho.com.
- Không đụng DNS nếu task chỉ là code.
- Không đụng Caddy/VPS nếu chưa được yêu cầu deploy.
- Không cài Docker/database giai đoạn đầu.
- Không nhồi media lớn vào VPS 10GB.
- Không dùng wording mê tín/hù dọa.
```

## Quy tắc UI

Tone:

```text
cổ học
trầm
vàng đồng
đen nâu
giấy cổ
thủy mặc
đất/đá/xanh trầm
```

Tránh:

```text
neon
SaaS quá hiện đại
game fantasy
ma thuật lòe loẹt
màu tím/lam điện tử quá mạnh
```

## Quy tắc wording

Nên dùng:

```text
tham khảo
tra cứu có kiểm soát
thực hành có hệ thống
minh bạch nguồn
phụ thuộc dữ kiện đầu vào
không thay thế chuyên gia/tư duy độc lập
```

Không dùng:

```text
phán chắc chắn
định mệnh tuyệt đối
đại họa
xấu không cứu được
đúng 100%
bắt buộc phải làm
```

## Ưu tiên làm tiếp

```text
1. Kiểm lại 3 trang chủ desktop/mobile.
2. Sửa lỗi font/dấu tiếng Việt nếu có.
3. Commit/push code frontend 3 trang chủ.
4. Deploy lên VPS app.hontho.com.
5. Hoàn thiện plan riêng từng app con.
6. Gom data Y học phương Đông.
7. Gom data Mai Hoa/64 quẻ.
8. Gom data Tướng.
```
