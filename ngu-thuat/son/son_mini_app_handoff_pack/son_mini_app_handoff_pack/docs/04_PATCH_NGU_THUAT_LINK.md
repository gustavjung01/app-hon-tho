# 04 - Link từ Ngũ thuật sang Sơn

Có 2 phương án.

## Phương án A: có landing trung gian

Giữ nguyên card Sơn ở:

```txt
src/app/huyen-mon-tham-khao/ngu-thuat/page.tsx
```

href vẫn là:

```ts
href: "/huyen-mon-tham-khao/ngu-thuat/son"
```

Trang này sẽ giới thiệu Sơn rồi có nút mở app:

```txt
/mini-apps/son
```

Phù hợp nếu muốn giữ chất Cổ học / Ngũ thuật trước khi vào app.

## Phương án B: đi thẳng vào mini app

Sửa href Sơn thành:

```ts
href: "/mini-apps/son"
```

Phù hợp nếu muốn người dùng vào app nhanh.

## Khuyến nghị

Dùng Phương án A trong giai đoạn đầu, vì Sơn cần nói rõ ranh giới:

- chỉ tham khảo
- không phán tuyệt đối
- không thay khảo sát thực địa
- dữ liệu/rule cần kiểm duyệt
