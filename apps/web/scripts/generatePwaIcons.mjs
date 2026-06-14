import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuffer.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return out;
}

function writePng(fileName, size, maskable = false) {
  const data = Buffer.alloc((size * 3 + 1) * size);
  const bg = [248, 232, 198];
  const border = [76, 36, 15];
  const seal = [176, 102, 31];
  const ivory = [255, 240, 210];
  const safePad = Math.round(size * (maskable ? 0.2 : 0.1));
  const borderWidth = Math.max(3, Math.round(size * 0.035));
  const radius = Math.round(size * 0.18);
  const cx = Math.round(size / 2);
  const cy = Math.round(size / 2);
  const circleR = Math.round(size * (maskable ? 0.14 : 0.18));

  function setPixel(x, y, rgb) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = y * (size * 3 + 1) + 1 + x * 3;
    data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2];
  }
  function fillRect(x0, y0, w, h, rgb) {
    for (let y = y0; y < y0 + h; y += 1) for (let x = x0; x < x0 + w; x += 1) setPixel(x, y, rgb);
  }
  function drawRoundBorder() {
    const x0 = safePad, y0 = safePad, x1 = size - safePad - 1, y1 = size - safePad - 1;
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        const dx = x < x0 + radius ? x0 + radius - x : x > x1 - radius ? x - (x1 - radius) : 0;
        const dy = y < y0 + radius ? y0 + radius - y : y > y1 - radius ? y - (y1 - radius) : 0;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const insideOuter = dist <= radius;
        const innerPad = borderWidth;
        const ix0 = x0 + innerPad, iy0 = y0 + innerPad, ix1 = x1 - innerPad, iy1 = y1 - innerPad;
        const idx = x < ix0 + radius - innerPad ? ix0 + radius - innerPad - x : x > ix1 - radius + innerPad ? x - (ix1 - radius + innerPad) : 0;
        const idy = y < iy0 + radius - innerPad ? iy0 + radius - innerPad - y : y > iy1 - radius + innerPad ? y - (iy1 - radius + innerPad) : 0;
        const insideInner = Math.sqrt(idx * idx + idy * idy) <= radius - innerPad && x >= ix0 && x <= ix1 && y >= iy0 && y <= iy1;
        if (insideOuter && !insideInner) setPixel(x, y, border);
      }
    }
  }
  function fillCircle() {
    for (let y = cy - circleR; y <= cy + circleR; y += 1) {
      for (let x = cx - circleR; x <= cx + circleR; x += 1) {
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= circleR * circleR) setPixel(x, y, seal);
      }
    }
  }
  function drawMonogram() {
    const unit = Math.max(3, Math.round(size * 0.018));
    const left = cx - Math.round(circleR * 0.58);
    const top = cy - Math.round(circleR * 0.34);
    const h = Math.round(circleR * 0.72);
    const w = Math.round(circleR * 0.42);
    fillRect(left, top + unit, unit, h - unit * 2, ivory);
    fillRect(left, top, w, unit, ivory);
    fillRect(left, top + h - unit, w, unit, ivory);
    const hx = cx + Math.round(circleR * 0.08);
    fillRect(hx, top, unit, h, ivory);
    fillRect(hx + w, top, unit, h, ivory);
    fillRect(hx, top + Math.round(h / 2) - Math.round(unit / 2), w + unit, unit, ivory);
  }

  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 3 + 1);
    data[row] = 0;
    for (let x = 0; x < size; x += 1) setPixel(x, y, bg);
  }
  drawRoundBorder();
  fillCircle();
  drawMonogram();

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(data, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
  const outPath = path.join(publicDir, fileName);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  try {
    if (fs.lstatSync(outPath).isSymbolicLink()) fs.unlinkSync(outPath);
  } catch {
    // Missing path is fine. Any other stale path will be replaced by writeFileSync below.
  }
  fs.writeFileSync(outPath, png);
}

writePng("apple-touch-icon.png", 180);
writePng("icon-192.png", 192);
writePng("icon-512.png", 512);
writePng("maskable-512.png", 512, true);
writePng("icons/app-icon-192.png", 192);
writePng("icons/app-icon-512.png", 512);
console.log("Generated opaque iOS-safe PWA icons");
