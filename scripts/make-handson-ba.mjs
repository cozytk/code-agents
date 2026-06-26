// 핸즈온 before/after 카드를 "전 → 후" 가로 비교 한 장으로 합성.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const img = (p) => path.join(here, '..', 'images', p);

const W = 1200, H = 470, cardH = 410, top = 44;
const cardBuf = async (f) => sharp(img(f)).resize({ height: cardH }).toBuffer();
const before = await cardBuf('handson-before.png');
const after = await cardBuf('handson-after.png');
const meta = await sharp(before).metadata();
const cardW = meta.width;            // 두 카드 동일 비율

const x1 = 96;                       // 왼(전)
const x2 = W - 96 - cardW;           // 오른(후)
const cx1 = x1 + cardW / 2, cx2 = x2 + cardW / 2;

const overlay = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <style>
       text{font-family:'JetBrains Mono',monospace;font-weight:700}
     </style>
     <text x="${cx1}" y="30" text-anchor="middle" font-size="20" fill="#F0625D">전 · 버그</text>
     <text x="${cx2}" y="30" text-anchor="middle" font-size="20" fill="#4FCDC2">후 · 정상</text>
     <text x="${W/2}" y="${top + cardH/2 + 14}" text-anchor="middle" font-size="58" fill="#4FCDC2">→</text>
   </svg>`
);

await sharp({ create: { width: W, height: H, channels: 4, background: { r: 15, g: 18, b: 23, alpha: 1 } } })
  .composite([
    { input: before, left: x1, top },
    { input: after, left: x2, top },
    { input: overlay, left: 0, top: 0 },
  ])
  .png()
  .toFile(img('handson-ba.png'));

console.log('wrote handson-ba.png', `${W}x${H}`, 'cardW', cardW);
