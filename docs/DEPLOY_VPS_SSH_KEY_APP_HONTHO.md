# Quy trình deploy VPS bằng SSH key cho app-hontho

Tài liệu này dùng chung cho mọi người trong dự án **app-hontho** để tránh nhầm giữa deploy VPS bằng SSH key và auto deploy kiểu Vercel.

## 0. Nguyên tắc chung

Dự án này **không deploy tự động kiểu Vercel**.

Luồng chuẩn là:

```text
Local/dev push code lên GitHub
↓
Dev dùng SSH key vào VPS
↓
VPS pull code từ GitHub
↓
Build/copy/restart theo cấu hình server
↓
Kiểm tra domain live
```
SSH-KEY: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBbeWVg6iZzOMmqJKZ0CYB1p2I4CA5CDB/MIpDLHAQfG app-hontho-vps
SSH-KEY-private : Get-Content "C:\Users\PC\.ssh\app_hontho_vps_new.pub
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBvfmhEf6POlD6tMOpqTO5gxvyfaI45W4+B0ZmmvXxA2QAAAJiGMKCUhjCg
lAAAAAtzc2gtZWQyNTUxOQAAACBvfmhEf6POlD6tMOpqTO5gxvyfaI45W4+B0ZmmvXxA2Q
AAAEBqebvg1xvDyCYnOpeBWmzOZNKfuST2i+gBvkkUCdtO5W9+aER/o86UPq0w6mpM7mDG
/J9ojjlbj4HRmaa9fEDZAAAADmFwcC1ob250aG8tdnBzAQIDBAUGBw==
-----END OPENSSH PRIVATE KEY-----
GitHub chỉ là nơi chứa code. VPS mới là nơi chạy app.

---

## 1. Thư mục quan trọng

### Repo local

```powershell
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho
```

### Web shell

```powershell
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web
```

### Source app con Ngũ thuật

```powershell
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\<nhanh>\<app>
```

Ví dụ:

```powershell
ngu-thuat\y\yhoc
ngu-thuat\boc\mai-hoa
ngu-thuat\menh\tutru
ngu-thuat\son\phong-thuy
ngu-thuat\tuong\xem-tuong
```

### Public output app con trong web shell

```powershell
apps\web\public\nguthuat\<nhanh>\<app>\
```

Ví dụ:

```powershell
apps\web\public\nguthuat\y\yhoc\
apps\web\public\nguthuat\boc\maihoa\
apps\web\public\nguthuat\menh\tutru\
```

Không dùng đường cũ:

```powershell
apps\web\public\apps\<app>\
```

### Repo trên VPS

Đường dẫn thực tế cần kiểm tra trên VPS. Hiện dự án thường dùng:

```bash
/opt/hontho-app-vps-starter
```

Nếu server đang dùng đường khác, ví dụ:

```bash
/var/www/app-hontho
```

thì phải thống nhất lại trong script deploy và tài liệu này.

---

## 2. Local: kiểm tra trước khi làm

Đứng ở repo gốc:

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"

git status --short
git pull origin main
```

Nếu `git status --short` có file lạ không thuộc app đang làm, không add bừa.

Không commit:

```text
node_modules/
*.log
ảnh tạm trong C:\Users\PC\.codeium\
file zip/app khác không liên quan
```

---

## 3. Local: build app con nếu app con là static sub-app

Chỉ làm bước này nếu app con có source riêng và cần xuất `dist`.

### Ví dụ app Y

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\y\yhoc"
npm install
npm run build
```

Copy output vào public web shell:

```powershell
Remove-Item "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\y\yhoc\*" -Recurse -Force

Copy-Item ".\dist\*" "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\y\yhoc\" -Recurse -Force
```

### Ví dụ app Mai Hoa

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\boc\mai-hoa"
npm install
npm run build
```

Copy output vào public web shell:

```powershell
Remove-Item "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\boc\maihoa\*" -Recurse -Force

Copy-Item ".\dist\*" "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\boc\maihoa\" -Recurse -Force
```

Nguyên tắc:

```text
Local build app con
↓
Copy dist vào apps/web/public/nguthuat/<nhanh>/<app>
↓
Commit public output
↓
VPS chỉ pull main và build web shell
```

---

## 4. Local: build web shell

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web"
npm install
npm run build
```

Nếu build lỗi thì không commit/push.

---

## 5. Local: commit và push

Quay về repo gốc:

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"

git status --short
```

Chỉ add các file liên quan đến app đang deploy.

Ví dụ deploy Mai Hoa:

```powershell
git add "apps/web/src/main.tsx"
git add "apps/web/public/nguthuat/boc/maihoa/"
git add "ngu-thuat/boc/mai-hoa/"
git add "docs/screenshots/nguthuat/boc/maihoa/"
git add "ui-preview/nguthuat/boc/mai_hoa_ui_preview_nguthuat.jsx"
```

Commit:

```powershell
git commit -m "feat(nguthuat): add Mai Hoa Dich So app MVP"
git push origin main
```

Nếu không có thay đổi:

```text
Không cần commit.
Không tạo commit rỗng.
```

---

## 6. SSH vào VPS bằng key

Từ máy local:

```powershell
ssh -i "C:\Users\PC\.ssh\<ten-key>" <user>@<ip-vps>
```

Ví dụ:

```powershell
ssh -i "C:\Users\PC\.ssh\app_hontho_key" root@103.77.173.213
```

Nếu key tên mặc định `id_ed25519` hoặc `id_rsa` và đã cấu hình SSH, có thể dùng:

```powershell
ssh root@103.77.173.213
```

Kiểm tra vào được VPS:

```bash
hostname
pwd
whoami
```

---

## 7. VPS: kiểm tra repo và pull code mới

Vào repo deploy:

```bash
cd /opt/hontho-app-vps-starter
```

Nếu repo thực tế nằm chỗ khác, dùng đúng đường dẫn server đang chạy.

Kiểm tra:

```bash
git status --short
git branch --show-current
git remote -v
git log --oneline --decorate -5
```

Pull main:

```bash
git pull origin main
```

Sau pull, kiểm tra commit mới đã có:

```bash
git log --oneline --decorate -5
```

---

## 8. VPS: remote GitHub nên dùng SSH

Kiểm tra remote:

```bash
git remote -v
```

Nên thấy dạng:

```bash
git@github.com:khuongbinhinfo-a11y/app-hon-tho.git
```

Nếu đang là HTTPS và cần đổi sang SSH:

```bash
git remote set-url origin git@github.com:khuongbinhinfo-a11y/app-hon-tho.git
```

Test SSH GitHub:

```bash
ssh -T git@github.com
```

Kỳ vọng thấy thông báo dạng:

```text
Hi khuongbinhinfo-a11y! You've successfully authenticated...
```

---

## 9. VPS: build web shell

Quy trình chính của dự án:

```text
App con đã build ở local và public output đã commit.
VPS chỉ cần pull main và build apps/web.
```

Chạy:

```bash
cd /opt/hontho-app-vps-starter/apps/web
npm install
npm run build
```

Nếu VPS cần build lại app con từ source thì chỉ làm khi thật sự cần. Ví dụ Mai Hoa:

```bash
cd /opt/hontho-app-vps-starter/ngu-thuat/boc/mai-hoa
npm install
npm run build

rm -rf /opt/hontho-app-vps-starter/apps/web/public/nguthuat/boc/maihoa/*
cp -r dist/* /opt/hontho-app-vps-starter/apps/web/public/nguthuat/boc/maihoa/

cd /opt/hontho-app-vps-starter/apps/web
npm run build
```

---

## 10. VPS: copy static output nếu server serve từ /var/www/html

Có một số VPS serve static trực tiếp từ:

```bash
/var/www/html
```

Kiểm tra Caddy/Nginx đang serve thư mục nào:

```bash
cat /etc/caddy/Caddyfile
```

Hoặc nếu dùng Nginx:

```bash
cat /etc/nginx/sites-enabled/*
```

Nếu server cần copy static app con sang `/var/www/html`, ví dụ Mai Hoa:

```bash
mkdir -p /var/www/html/nguthuat/boc/maihoa
cp -r /opt/hontho-app-vps-starter/apps/web/public/nguthuat/boc/maihoa/* /var/www/html/nguthuat/boc/maihoa/
```

Nếu server serve từ `apps/web/dist` hoặc qua Node/PM2 thì không tự copy bừa. Phải theo cấu hình server thực tế.

---

## 11. VPS: restart/reload dịch vụ

Nếu dùng PM2:

```bash
pm2 list
pm2 restart all
```

Hoặc đúng app:

```bash
pm2 restart app-hontho
```

Nếu dùng Caddy:

```bash
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
```

Nếu dùng Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Nếu dùng systemd app riêng:

```bash
sudo systemctl restart app-hontho
sudo systemctl status app-hontho --no-pager
```

Không restart mù nếu không biết server dùng gì. Kiểm tra trước:

```bash
pm2 status
systemctl status caddy --no-pager
systemctl status nginx --no-pager
```

---

## 12. Test live sau deploy

Mở các URL chính:

```text
https://app.hontho.com/
https://app.hontho.com/nguthuat
```

Kiểm app con theo route.

### App Y

```text
https://app.hontho.com/nguthuat/y
https://app.hontho.com/nguthuat/y/yhoc/index.html
```

Checklist app Y:

```text
- ảnh có hiện không
- layout không nát
- score là %
- không chớp
- red flag không hiện mẹo tự chăm sóc
- không có chữ chữa bệnh/kê đơn/liều lượng
```

### App Mai Hoa

```text
https://app.hontho.com/nguthuat/boc/maihoa
https://app.hontho.com/nguthuat/boc/maihoa/
```

Checklist app Mai Hoa:

```text
- không 404
- không trắng trang
- không còn placeholder "Ứng dụng đang được chuẩn bị"
- CSS/JS load đủ
- form lập quẻ theo thời gian hiện đúng
- form lập quẻ bằng 3 số hiện đúng
- khởi quẻ ra kết quả
- có quẻ chủ, quẻ hỗ, quẻ biến, động hào
- có cảnh báo an toàn
- hard refresh tại route không lỗi
```

---

## 13. Script deploy bán tự động

Dự án có thể dùng script deploy bán tự động:

```text
scripts/deploy-from-github.sh
```

Cách chạy từ local:

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"

scp "scripts\deploy-from-github.sh" root@103.77.173.213:/root/deploy-from-github.sh

ssh root@103.77.173.213 "chmod +x /root/deploy-from-github.sh && /root/deploy-from-github.sh"
```

Script được phép làm:

```text
- cd đúng repo VPS
- git pull origin main
- kiểm tra commit mong muốn
- build apps/web
- kiểm tra public output app con
- copy static nếu server cần
- restart/reload service
- in log rõ ràng
```

Script không được có:

```text
rm -rf /var/www/html
rm -rf /opt
git reset --hard
git clean -fdx
xóa toàn bộ repo
xóa toàn bộ public
```

---

## 14. Bản siêu ngắn

```bash
# Local
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"
git status --short
git pull origin main

# Build app con nếu cần
cd ngu-thuat/<nhanh>/<app>
npm install
npm run build

# Copy dist vào apps/web/public/nguthuat/<nhanh>/<app>
# Build web shell
cd apps/web
npm install
npm run build

# Commit/push
cd ../..
git status --short
git add <file-lien-quan>
git commit -m "deploy: update app hon tho"
git push origin main

# VPS qua SSH key
ssh root@103.77.173.213
cd /opt/hontho-app-vps-starter
git pull origin main
cd apps/web
npm install
npm run build
pm2 restart all
sudo systemctl reload caddy
```

---

## 15. Chốt quy trình

```text
SSH key dùng để vào VPS.
GitHub dùng để chứa code.
VPS pull main từ GitHub.
App con static output nên được build local và commit vào apps/web/public/nguthuat/<nhanh>/<app>.
VPS build web shell và restart/reload service.
Không phải auto deploy kiểu Vercel.
```
