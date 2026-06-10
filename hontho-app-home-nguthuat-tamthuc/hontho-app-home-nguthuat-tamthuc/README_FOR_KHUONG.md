# Bộ 3 trang chủ app.hontho.com

Bộ này tạo 3 trang chính:

```text
app.hontho.com/
app.hontho.com/nguthuat
app.hontho.com/tam-thuc
```

## Mục tiêu

- `/` là trang chủ khu ứng dụng Hồn Thơ.
- `/nguthuat` là trang chủ Ngũ thuật, bẻ ra Sơn · Y · Mệnh · Bốc · Tướng.
- `/tam-thuc` là trang chủ Tam thức, bẻ ra Kỳ Môn · Thái Ất · Lục Nhâm.

## Cách dùng

Nếu đang dùng bộ `hontho-app-vps-starter`, copy thư mục:

```text
apps/web/
```

trong gói này đè vào:

```text
hontho-app/apps/web/
```

Sau đó chạy:

```bash
cd hontho-app/apps/web
npm install
npm run build
npm run dev
```

Mở thử:

```text
http://localhost:5173/
http://localhost:5173/nguthuat
http://localhost:5173/tam-thuc
```

## Ghi chú

- Chưa gắn app Tứ Trụ thật.
- Chưa làm login/credit thật.
- Chưa nối API.
- Đây là khung trang chủ và cổng nhánh.
