// QA 캡처들을 콘택트시트(몽타주) 한 장으로 합성 — 데모 슬라이드의 "검증 루프 증거"로 사용.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const qa = path.join(here, '..', '.omx', 'qa');
const out = path.join(here, '..', 'images', 'qa-montage.png');

// 시각적으로 다양한 대표 슬라이드(다크 캡처)
const picks = [1, 4, 6, 8, 12, 15, 19, 23, 25, 29, 31, 32];

const cols = 6, rows = 2;
const tw = 208, th = 117, gap = 10, margin = 16;
const W = margin * 2 + cols * tw + (cols - 1) * gap;
const H = margin * 2 + rows * th + (rows - 1) * gap;

const base = sharp({
  create: { width: W, height: H, channels: 4, background: { r: 15, g: 18, b: 23, alpha: 1 } },
});

const composites = [];
for (let i = 0; i < picks.length; i++) {
  const n = String(picks[i]).padStart(2, '0');
  const src = path.join(qa, `dark-${n}.png`);
  const buf = await sharp(src)
    .resize(tw, th, { fit: 'cover', position: 'top' })
    .composite([{ // 얇은 테두리
      input: Buffer.from(
        `<svg width="${tw}" height="${th}"><rect x="0.5" y="0.5" width="${tw - 1}" height="${th - 1}" rx="5" fill="none" stroke="#262D38" stroke-width="1"/></svg>`
      ),
      top: 0, left: 0,
    }])
    .png()
    .toBuffer();
  const r = Math.floor(i / cols), c = i % cols;
  composites.push({
    input: buf,
    top: margin + r * (th + gap),
    left: margin + c * (tw + gap),
  });
}

await base.composite(composites).png().toFile(out);
console.log('wrote', out, `${W}x${H}`);
