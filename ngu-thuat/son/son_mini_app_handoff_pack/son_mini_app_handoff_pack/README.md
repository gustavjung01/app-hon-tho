# SON MINI APP HANDOFF PACK

Gói này dùng để chuẩn bị mini app **Sơn – Phong thủy an cư** trước khi giao dev.

## Mục tiêu

- Sơn là mini web app riêng, không phải bài viết tĩnh.
- Web chính chỉ móc link vào app.
- App thật nằm ở route: `/mini-apps/son`.
- Route cũ của Ngũ thuật `/huyen-mon-tham-khao/ngu-thuat/son` chỉ là landing/cổng giới thiệu.

## Nội dung gói

```txt
goc-binh-yen-patch/
└── src/
    ├── app/
    │   ├── mini-apps/son/page.tsx
    │   └── huyen-mon-tham-khao/ngu-thuat/son/page.tsx
    └── features/son/
        ├── components/
        ├── data/
        ├── engine/
        └── types.ts

docs/
├── 01_INSTALL_GUIDE.md
├── 02_UI_DIRECTION_SON.md
├── 03_PROMPT_GIAO_DEV.txt
└── 04_PATCH_NGU_THUAT_LINK.md

schemas/
└── son-engine-schema.json
```

## Trạng thái

- UI: đã dựng khung phase 1.
- Nút chính: đã có tương tác.
- Form: đã có dữ liệu mẫu.
- Sơ đồ 8 hướng / 9 cung: đã có placeholder.
- Engine Bát trạch / Phi tinh: chỉ là preview/demo, chưa phải rule chính thức.
- Nguồn và license: chỉ để chỗ, cần nghiên cứu và kiểm duyệt sau.

## Cảnh báo

Không dùng dữ liệu preview để public như kết quả phong thủy thật. Dev phải thay bằng rule engine đã kiểm duyệt trước khi mở tính năng tính toán chính thức.
