# Hồn Thơ App - Bộ ảnh cho 3 trang chủ

## Cách đặt vào repo

Copy nguyên thư mục `apps/web/public/images/` trong ZIP này vào repo:

```text
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\images\
```

Khi code React/Vite gọi ảnh, dùng đường dẫn public dạng:

```text
/images/app-home/bg-app-home-hero.webp
/images/nguthuat/bg-nguthuat-hero.webp
/images/tam-thuc/bg-tamthuc-hero.webp
```

## 1. Trang app.hontho.com/

```text
apps/web/public/images/app-home/bg-app-home-hero.webp
apps/web/public/images/app-home/portal-nguthuat.webp
apps/web/public/images/app-home/portal-tamthuc.webp
apps/web/public/images/app-home/card-account.webp
apps/web/public/images/app-home/card-history.webp
apps/web/public/images/app-home/card-credits.webp
```

Gợi ý map:
- `bg-app-home-hero.webp`: nền chính trang `/`
- `portal-nguthuat.webp`: ảnh card/cửa vào Ngũ thuật
- `portal-tamthuc.webp`: ảnh card/cửa vào Tam thức
- `card-account.webp`: card Tài khoản
- `card-history.webp`: card Lịch sử tra cứu
- `card-credits.webp`: card Tín dụng

## 2. Trang app.hontho.com/nguthuat

```text
apps/web/public/images/nguthuat/bg-nguthuat-hero.webp
apps/web/public/images/nguthuat/icons-nguthuat-branches-sheet.webp
apps/web/public/images/nguthuat/icon-son.webp
apps/web/public/images/nguthuat/icon-y.webp
apps/web/public/images/nguthuat/icon-menh.webp
apps/web/public/images/nguthuat/icon-boc.webp
apps/web/public/images/nguthuat/icon-tuong.webp
```

Gợi ý map:
- `bg-nguthuat-hero.webp`: nền đầu trang `/nguthuat`
- `icon-son.webp`: card Sơn
- `icon-y.webp`: card Y
- `icon-menh.webp`: card Mệnh
- `icon-boc.webp`: card Bốc
- `icon-tuong.webp`: card Tướng
- `icons-nguthuat-branches-sheet.webp`: sheet tham khảo tổng thể, không bắt buộc dùng trực tiếp

## 3. Trang app.hontho.com/tam-thuc

```text
apps/web/public/images/tam-thuc/bg-tamthuc-hero.webp
apps/web/public/images/tam-thuc/icon-ky-mon.webp
apps/web/public/images/tam-thuc/icon-thai-at.webp
apps/web/public/images/tam-thuc/icon-luc-nham.webp
```

Gợi ý map:
- `bg-tamthuc-hero.webp`: nền đầu trang `/tam-thuc`
- `icon-ky-mon.webp`: card Kỳ Môn
- `icon-thai-at.webp`: card Thái Ất
- `icon-luc-nham.webp`: card Lục Nhâm

## 4. Ảnh preview UI

```text
ui-preview/preview-01-app-home.png
ui-preview/preview-02-nguthuat-home.png
ui-preview/preview-03-tamthuc-home.png
```

Chỉ dùng để đối chiếu giao diện, không cần đưa vào production.

## Ghi chú cho dev

- Không để ảnh vào `src/assets` nếu đang dùng đường dẫn public.
- Không đổi tên file nếu đã map vào component.
- Dùng ảnh nền với overlay tối nhẹ để chữ dễ đọc.
- Các ảnh đã chừa khoảng trống để đặt title, subtitle và nút.
- Nút, route, hover, responsive là phần dev code tiếp.
