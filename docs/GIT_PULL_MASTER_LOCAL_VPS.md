# Git pull 2 noi - app.hontho

Muc tieu: luon giu local va VPS khop nhau tren `master`.

## Current truth

- Local repo: `D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho`
- VPS host: `root@134.209.99.218`
- VPS repo: `/opt/repos/app-hontho`
- Branch dung: `master`
- Live web root: `/var/www/app-hontho`
- API service: `hontho-api`
- SSH key dang dung: `F:\1_A_Disk_D\khuong-binh\TK\DIGI-OCEAN\do_1_2_50-134.209.99.218`

## Nguyen tac

1. GitHub la nguon chuan.
2. Local pull tu GitHub.
3. Local push len GitHub.
4. VPS pull tu GitHub.
5. VPS khong dung de pull nguoc ve local.

## 1) Local pull

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"
git status --short
git pull origin master
```

Neu `git status --short` co file dang sua, thi commit hoac stash truoc khi pull.

## 2) Neu local co sua app con

Neu sua app con static, lam theo thu tu:

1. Build app con.
2. Copy `dist` vao `apps/web/public/nguthuat/...`.
3. Build lai `apps/web`.
4. Commit va push len GitHub.

Vi du cho app Y:

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\y\yhoc"
npm install
npm run build

Remove-Item "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\y\yhoc\*" -Recurse -Force
Copy-Item ".\dist\*" "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\y\yhoc\" -Recurse -Force

cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web"
npm run build

cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"
git add -A
git commit -m "sync updates"
git push origin master
```

## 3) VPS pull

```bash
ssh -i "F:\1_A_Disk_D\khuong-binh\TK\DIGI-OCEAN\do_1_2_50-134.209.99.218" root@134.209.99.218

cd /opt/repos/app-hontho
git status --short
git pull origin master
```

## 4) VPS deploy sau pull

### Neu doi API

```bash
cd /opt/repos/app-hontho/apps/api
npm run build
systemctl restart hontho-api
```

### Neu doi web shell / asset / app con

```bash
cd /opt/repos/app-hontho/apps/web
npm run build
rsync -a --delete dist/ /var/www/app-hontho/
systemctl reload nginx
```

## 4b) Neu Tu Tru bi load ban cu

Thuong do Tứ Trụ con chua dong bo giua 3 noi:

1. `ngu-thuat/menh/tutru/dist`
2. `apps/web/public/nguthuat/menh/tutru`
3. `/var/www/app-hontho/nguthuat/menh/tutru`

### Sua tren local

```powershell
cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\menh\tutru"
npm install
npm run build

Remove-Item "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\menh\tutru\*" -Recurse -Force
Copy-Item ".\dist\*" "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web\public\nguthuat\menh\tutru\" -Recurse -Force

cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\apps\web"
npm run build

cd "D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho"
git add -A
git commit -m "sync tu tru static build"
git push origin master
```

### Sua tren VPS

```bash
cd /opt/repos/app-hontho
git pull origin master

rsync -a --delete /opt/repos/app-hontho/apps/web/public/nguthuat/menh/tutru/ /var/www/app-hontho/nguthuat/menh/tutru/
systemctl reload nginx
```

### Neu van thay ban cu

- Hard refresh `Ctrl+Shift+R`
- Ho mo incognito
- Kiem tra file live:

```bash
sed -n '1,40p' /var/www/app-hontho/nguthuat/menh/tutru/index.html
```

Neu `index.html` van tro toi bundle cu, tuc la ban copy chua dung thu muc.

### Neu doi ca API va web

Chay ca hai block ben tren theo thu tu:

1. API build + restart
2. Web build + rsync + reload nginx

## 5) Kiem tra nhanh

```bash
git log -1 --oneline
```

Mo lai:

- `https://app.hontho.com/`
- `https://app.hontho.com/nguthuat`
- `https://app.hontho.com/account`
- `https://app.hontho.com/api/health`

## 6) Loi paste hay gap

Neu thay ky tu la nhu `[200~` truoc lenh, xoa no di.

Lenh dung phai la:

```bash
cd /opt/repos/app-hontho
```
