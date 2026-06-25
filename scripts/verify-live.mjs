// 라이브 GitHub Pages 배포 검증: 대표 슬라이드 캡처 + 404 수집 + 화살표 내비 URL 확인.
import { chromium } from 'playwright-chromium';

const BASE = 'https://cozytk.github.io/code-agents/';
const outDir = new URL('../.omx/live/', import.meta.url).pathname;
import { mkdirSync } from 'node:fs';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const bad = [];
page.on('response', (r) => {
  const s = r.status();
  if (s >= 400) bad.push(`${s} ${r.url()}`);
});

// 1) 첫 슬라이드
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: outDir + 'live-01.png' });
const url1 = page.url();

// 2) 화살표로 다음 슬라이드 (hash 라우터: #/2 로 변해야)
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(900);
const url2 = page.url();
await page.screenshot({ path: outDir + 'live-02.png' });

// 3) 딥링크(중간 슬라이드)
await page.goto(BASE + '#/6', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: outDir + 'live-06.png' });
const url6 = page.url();

await browser.close();

console.log('url1:', url1);
console.log('url2 (ArrowRight):', url2, url2 !== url1 ? '✓ 변경됨' : '✗ 안 변함');
console.log('url6 (deeplink):', url6);
console.log('asset 4xx/5xx 응답:', bad.length);
for (const b of bad) console.log('  ' + b);
console.log('캡처:', outDir);
