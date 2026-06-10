# Prompt ngắn cho dev

Chỉ làm 3 trang chủ của app Hồn Thơ:

```text
/
 /nguthuat
 /tam-thuc
```

Dùng bộ ảnh trong thư mục:

```text
apps/web/public/images/
```

Map ảnh theo `ASSET_MANIFEST.md`.

Không làm lan man:
- Không đụng DNS
- Không đụng VPS/Caddy
- Không đụng IPv6
- Không cài Docker
- Không cài database
- Không gắn app Tứ Trụ thật
- Không sửa www.hontho.com

Mục tiêu:
1. `/` là sảnh chính, có 2 cửa: Ngũ thuật và Tam thức.
2. `/nguthuat` có 5 card: Sơn, Y, Mệnh, Bốc, Tướng.
3. `/tam-thuc` có 3 card: Kỳ Môn, Thái Ất, Lục Nhâm.
4. Card con có nút nhưng route con chỉ placeholder.
5. UI bám theo `ui-preview/`, nhưng dùng ảnh thật trong `public/images`.

Tone UI:
- cổ học
- trầm
- vàng đồng
- đen nâu
- giấy cổ
- thủy mặc
- không neon
- không game phép thuật
- không SaaS hiện đại quá
