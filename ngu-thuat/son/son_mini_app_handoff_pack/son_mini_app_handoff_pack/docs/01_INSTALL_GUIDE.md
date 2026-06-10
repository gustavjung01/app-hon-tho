# 01 - Hướng dẫn gắn vào Goc_Binh_Yen

## 1. Copy file

Copy toàn bộ thư mục trong:

```txt
goc-binh-yen-patch/src/
```

vào thư mục `src/` của repo Goc_Binh_Yen.

## 2. Route sau khi copy

Mini app chính:

```txt
/mini-apps/son
```

Landing/cổng giới thiệu trong Ngũ thuật:

```txt
/huyen-mon-tham-khao/ngu-thuat/son
```

## 3. Chạy kiểm tra

```bash
npm run build
```

## 4. Kiểm tra bằng mắt

- Desktop: hero không vỡ, 2 card Bát trạch/Phi tinh rõ.
- Mobile: các nút xếp gọn, không tràn ngang.
- Bấm Bát trạch/Phi tinh: nội dung đổi đúng.
- Bấm Nhập thông tin / Sơ đồ / Phân tích / Gợi ý / Quy tắc: tab đổi đúng.
- Form nhập được.
- Sơ đồ 8 hướng và 9 cung hiển thị được.

## 5. Việc chưa làm trong gói này

- Chưa cắm engine Bát trạch thật.
- Chưa cắm engine Phi tinh thật.
- Chưa có dữ liệu nguồn/license thật.
- Chưa sửa card Sơn ở trang Ngũ thuật nếu anh muốn đi thẳng tới `/mini-apps/son`.

## 6. Nếu muốn card Sơn đi thẳng vào app

Sửa file:

```txt
src/app/huyen-mon-tham-khao/ngu-thuat/page.tsx
```

Đổi href Sơn từ:

```ts
href: "/huyen-mon-tham-khao/ngu-thuat/son"
```

sang:

```ts
href: "/mini-apps/son"
```

Nếu muốn có landing trung gian, giữ nguyên href cũ.
