# Kiến trúc app.hontho.com

## Tổng quan

```text
www.hontho.com
= nội dung, SEO, thương hiệu mẹ

app.hontho.com
= app, account, credits, history, mini-app, API
```

## Thành phần trên VPS

```text
Caddy
- HTTPS tự động
- Serve web app
- Reverse proxy /api sang backend
- Serve /media từ folder riêng

Web app
- App home
- Ngũ thuật hub
- Tứ Trụ route
- Tam thức hub
- Account
- Credits
- History
- Admin

API
- Auth
- Account
- Credits
- Payment request
- Admin approve transfer
- Email stub
- Tứ Trụ calculate placeholder

PostgreSQL
- users
- credit_balances
- credit_transactions
- payment_requests
- app_usage_logs
- tu_tru_profiles
- tu_tru_results
- email_logs
- media_assets
```

## Media

Không nhét ảnh/video nặng vào repo.

```text
media/backgrounds
media/images
media/videos
media/exports
```

Caddy phục vụ qua:

```text
https://app.hontho.com/media/...
```
