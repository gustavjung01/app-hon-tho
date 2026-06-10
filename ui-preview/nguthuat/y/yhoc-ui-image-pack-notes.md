# YHOC UI Image Pack

Gói này bổ sung ảnh để dev map UI app Y.

## 1. Ảnh preview / moodboard
Copy các file trong:

```text
ui-preview/nguthuat/y/
```

vào repo tại:

```text
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ui-preview\nguthuat\y
```

Các file:

- `yhoc-hero-reference.png`
- `yhoc-safety-reference.png`
- `yhoc-form-reference.png`
- `yhoc-result-reference.png`
- `yhoc-learn-reference.png`
- `yhoc-ui-flow.png`

Những ảnh này chỉ dùng để tham khảo bố cục, tone, flow. Không import trực tiếp vào app.

## 2. Ảnh production candidate
Copy các file trong:

```text
ngu-thuat/y/yhoc/src/assets/images/
```

vào source app Y tại:

```text
D:\Wep_Yhocnhanai\Web_Goc_Binh_Yen\app-hontho\ngu-thuat\y\yhoc\src\assets\images
```

Các file:

- `yhoc-hero-bg.png`
- `yhoc-card-amduong.png`
- `yhoc-card-tangphu.png`
- `yhoc-card-khihuyet.png`
- `yhoc-card-duongsinh.png`

Dev có thể import thật trong `src/App.tsx` nếu cần.

## 3. Quy tắc

- `ui-preview/nguthuat/y/`: ảnh mẫu, note, flow, moodboard.
- `ngu-thuat/y/yhoc/src/assets/images/`: ảnh thật dùng trong code.
- `apps/web/public/nguthuat/y/yhoc/`: chỉ chứa build output sau khi `npm run build`.

Không copy ảnh preview vào `apps/web/public` bằng tay. Sau khi build, Vite tự xuất asset production vào public output.
