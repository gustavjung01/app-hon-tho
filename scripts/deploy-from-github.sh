#!/bin/bash
# ============================================================
# deploy-from-github.sh
# Deploy app từ GitHub lên VPS tự động
# ============================================================

set -e
LOGFILE="/root/deploy-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOGFILE") 2>&1

echo "======================================================"
echo " DEPLOY TỪ GITHUB - $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# Thư mục app
APP_DIR="/opt/hontho-app-vps-starter"

echo ""
echo "===== [1] KIỂM TRA THƯ MỤC APP ====="
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Không tìm thấy thư mục $APP_DIR"
    echo "Tạo thư mục mới..."
    mkdir -p "$APP_DIR"
fi

cd "$APP_DIR"

# Kiểm tra git repo
if [ ! -d ".git" ]; then
    echo "❌ Không phải git repo. Clone từ GitHub..."
    git clone https://github.com/khuongbinhinfo-a11y/app-hon-tho.git .
fi

echo ""
echo "===== [2] PULL CODE MỚI ====="
git fetch origin main
git pull origin main

echo ""
echo "===== [3] KIỂM TRA COMMIT ====="
echo "Commit hiện tại:"
git log --oneline -3

# Kiểm tra có commit Mai Hoa
echo ""
echo "🔍 Kiểm tra commit Mai Hoa..."
if git log --oneline -10 | grep -E "(b530540|56c9750)" > /dev/null; then
    echo "✅ Tìm thấy commit Mai Hoa:"
    git log --oneline -10 | grep -E "(b530540|56c9750)"
else
    echo "⚠️ Cảnh báo: Chưa thấy commit Mai Hoa (b530540 hoặc 56c9750)"
    echo "Vẫn tiếp tục deploy nhưng có thể chưa có code mới nhất"
fi

echo ""
echo "===== [4] BUILD WEB APP ====="
cd apps/web

# Kiểm tra node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Cài dependencies..."
    npm install
fi

# Build
echo "🔨 Đang build..."
npm run build

echo ""
echo "===== [5] KIỂM TRA MAI HOA BUILD ====="
if [ -d "public/nguthuat/boc/maihoa" ]; then
    echo "✅ Mai Hoa build output tồn tại:"
    ls -la public/nguthuat/boc/maihoa/
else
    echo "❌ Không tìm thấy Mai Hoa build output"
    exit 1
fi

echo ""
echo "===== [6] COPY ĐẾN WEB ROOT ====="
# Tạo thư mục nếu chưa có
mkdir -p /var/www/html/nguthuat/boc/maihoa

# Copy files
cp -r public/nguthuat/boc/maihoa/* /var/www/html/nguthuat/boc/maihoa/

echo "✅ Đã copy Mai Hoa đến /var/www/html/nguthuat/boc/maihoa/"

echo ""
echo "===== [7] RESTART SERVICES ====="
# Restart Caddy nếu có
if systemctl is-active --quiet caddy; then
    echo "🔄 Restart Caddy..."
    systemctl restart caddy
    systemctl status caddy --no-pager || true
fi

# Restart PM2 nếu có
if command -v pm2 &> /dev/null; then
    echo "🔄 Restart PM2..."
    pm2 restart all || true
    pm2 status
fi

echo ""
echo "===== [8] KIỂM TRA KẾT QUẢ ====="
echo "Kiểm tra URL:"
echo "  - https://app.hontho.com/nguthuat/boc/maihoa"
echo "  - http://103.77.173.213/nguthuat/boc/maihoa"
echo ""
echo "Log file: $LOGFILE"
echo ""
echo "======================================================"
echo " ✅ DEPLOY HOÀN TẤT!"
echo "======================================================"
