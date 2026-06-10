# Hồn Thơ App VPS Starter

Bộ khung này dùng để đưa khu mini-app lên VPS theo hướng:

- `www.hontho.com`: web nội dung chính, không đưa lên VPS nếu đang chạy ổn.
- `app.hontho.com`: khu ứng dụng chạy trên VPS.

## Có sẵn trong bộ khung

1. Web app mini-app
2. Backend/API
3. Database PostgreSQL
4. Credit/tín dụng
5. Login/account
6. Media folder riêng
7. Admin duyệt chuyển khoản
8. Email tự động sau này, hiện để stub để nối provider sau

## Route web app

```text
/
 /nguthuat
 /nguthuat/menh/tutru
 /nguthuat/son/phongthu
 /nguthuat/y/yhoc
 /nguthuat/boc/maihoa
 /nguthuat/tuong/xem-tuong
 /tam-thuc
 /account
 /credits
 /history
 /admin
```

## DNS cần tạo

Trong DNS của `hontho.com`, tạo:

```text
Type: A
Name: app
Value: IP_VPS
TTL: Auto
```

## Chạy nhanh trên VPS

```bash
cd /opt
unzip hontho-app-vps-starter.zip
cd hontho-app-vps-starter
cp .env.example .env
# sửa .env trước
docker compose up -d --build
docker compose exec postgres psql -U hontho -d hontho_app -f /schema/schema.sql
```

Mở:

```text
https://app.hontho.com
https://app.hontho.com/nguthuat
https://app.hontho.com/nguthuat/menh/tutru
```
