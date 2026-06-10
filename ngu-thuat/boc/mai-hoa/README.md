# Mai Hoa Dịch Số

Ứng dụng tra cứu tượng số Mai Hoa Dịch Số (梅花易數) - phương pháp khởi quẻ trong Dịch học.

**Source:** `ngu-thuat/boc/mai-hoa`

## Giới thiệu

Mai Hoa Dịch Số là một phương pháp khởi quẻ trong Dịch học, thường được truyền thống gắn với Thiệu Ung và mạch Thiệu học. Phương pháp này dùng các con số từ thời gian hoặc sự việc để sinh ra quẻ Dịch, từ đó tham khảo tượng số và diễn giải tình thế.

## Route

- Production: `/nguthuat/boc/maihoa`
- Dev: `http://localhost:4174`

## Cách chạy dev

```bash
npm install
npm run dev
```

App sẽ chạy tại: http://localhost:4174

## Cách build

```bash
npm run build
```

Build output sẽ được tạo tại thư mục `dist/`.

## Copy đến public folder

```bash
# Copy build output đến apps/web/public/nguthuat/boc/maihoa/
copy dist/* ../../../apps/web/public/nguthuat/boc/maihoa/
```

## Test Vector (Đã pass)

**Input:** Năm Tý=1, Tháng 5, Ngày 27, Giờ Ngọ=7

**Expected Output:**
- Upper (Thượng quái): 1
- Lower (Hạ quái): 8
- Moving Line (Hào động): 4
- Primary Hexagram (Quẻ chủ): Thiên Địa Bĩ (䷋)

**Actual Output:** ✅ Pass - Kết quả khớp hoàn toàn

## Cảnh báo Safety

⚠️ **Kết quả chỉ phục vụ tham khảo và tự phản tư.**

- Không dùng thay thế tư vấn chuyên môn
- Không dùng cho quyết định y tế, pháp lý, tài chính
- Không dùng cho an toàn cá nhân
- Luôn kiểm chứng với điều kiện thực tế trước khi quyết định

Ngôn ngữ diễn giải đã được kiểm soát để tránh cực đoan và đảm bảo tính tham khảo.

## Folder Public Output

Sau khi build và copy:
```
apps/web/public/nguthuat/boc/maihoa/
├── index.html
└── assets/
    ├── index-*.js
    ├── index-*.css
```

## Tech Stack

- React 18 + TypeScript
- Vite 5.x
- CSS vanilla (không dùng framework CSS)

## Data

- 8 quái (trigrams)
- 64 quẻ (hexagrams)
- 12 địa chi (earthly branches)
- Safety copy cho diễn giải
