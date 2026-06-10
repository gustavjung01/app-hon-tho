# Prompt giao dev/local agent

Mục tiêu: dựng bộ khung `app.hontho.com` chạy trên VPS.

Không đụng `www.hontho.com`.
Không move web Hồn Thơ chính.
Chỉ làm khu app trên subdomain `app.hontho.com`.

Cần kiểm tra:

1. Web app mini-app
- app home
- /nguthuat
- /nguthuat/menh/tutru
- /tam-thuc
- /account
- /credits
- /history
- /admin

2. Backend/API
- /api/health
- /api/auth/register
- /api/auth/login
- /api/account/me
- /api/credits/balance
- /api/credits/topup-request
- /api/admin/payment-requests
- /api/admin/payment-requests/:id/approve
- /api/email/test
- /api/nguthuat/tutru/calculate

3. Database
- PostgreSQL
- Schema ở infra/db/schema.sql

4. Credit/tín dụng
- Phase đầu: user tạo yêu cầu nạp
- Admin duyệt thủ công
- Chưa tự động kết nối ngân hàng

5. Media folder riêng
- Folder media/
- Caddy map /media/* vào folder này

Yêu cầu test:
- docker compose up -d --build
- API /api/health trả ok
- Web mở được app home
- /nguthuat mở được
- /nguthuat/menh/tutru mở được

Báo lại:
- cách chạy trên VPS
- DNS cần tạo record gì
- lỗi còn lại nếu có
