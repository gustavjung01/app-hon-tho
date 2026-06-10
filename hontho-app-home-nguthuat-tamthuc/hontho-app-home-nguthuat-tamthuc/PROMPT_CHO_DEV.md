# Lệnh cho dev/local agent

Dùng gói này để thay phần web app trong `app.hontho.com`.

Không đụng `www.hontho.com`.
Không đụng backend/API.
Không đụng database.
Không làm login/credit thật trong vòng này.
Không gắn Tứ Trụ thật trong vòng này.

Việc cần làm:

1. Copy thư mục `apps/web` từ gói này vào project `hontho-app`.

2. Kiểm tra 3 route:
- `/`
- `/nguthuat`
- `/tam-thuc`

3. Trang `/` phải là trang chủ khu ứng dụng:
- Có 2 cửa chính: Ngũ thuật và Tam thức.
- Có nhắc khu tài khoản, tín dụng, lịch sử tra cứu nhưng chưa cần làm thật.

4. Trang `/nguthuat` phải có 5 nhánh:
- Sơn / Phong thủy an cư
- Y / Y học cổ học
- Mệnh / Tứ Trụ
- Bốc / Mai Hoa Dịch Số
- Tướng / Xem tướng

5. Trang `/tam-thuc` phải có 3 nhánh:
- Kỳ Môn
- Thái Ất
- Lục Nhâm

6. Các route con cần giữ chỗ:
- `/nguthuat/menh/tutru`
- `/nguthuat/son/phongthu`
- `/nguthuat/y/yhoc`
- `/nguthuat/boc/maihoa`
- `/nguthuat/tuong/xem-tuong`
- `/tam-thuc/ky-mon`
- `/tam-thuc/thai-at`
- `/tam-thuc/luc-nham`

7. Chạy:
```bash
npm install
npm run build
```

8. Báo lại:
- build có pass không
- 3 trang chính mở được không
- route con nào đã có placeholder
- có file nào ngoài `apps/web` bị sửa không
