// demo.html 동작 검증: 탭/행/칩 클릭으로 상태 변화 + 콘솔 에러 확인, 상태별 캡처.
import { chromium } from 'playwright-chromium';
import { mkdirSync } from 'node:fs';

const file = 'file://' + new URL('../public/demo.html', import.meta.url).pathname;
const out = new URL('../.omx/demo/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));

await page.goto(file, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// 초기 상태: SWE-bench, Claude 막대 폭이 가장 넓어야
const sweClaudeW = await page.$eval('.row.claude .fill', el => el.style.width);
await page.screenshot({ path: out + 'demo-1-swe.png' });

// 탭 전환: 성숙도 → 값이 "개월"로 바뀌고 Claude=16개월
await page.click('.tab[data-k="mature"]');
await page.waitForTimeout(1100);
const matureClaude = await page.$eval('.row.claude .val', el => el.textContent);
await page.screenshot({ path: out + 'demo-2-mature.png' });

// 탭 전환: Terminal-Bench → Codex가 가장 높아야(77.3%)
await page.click('.tab[data-k="terminal"]');
await page.waitForTimeout(1100);
const termCodex = await page.$eval('.row.codex .val', el => el.textContent);
// 행 클릭으로 Codex 강조 → 다른 행에 dim 클래스
await page.click('.row.codex');
await page.waitForTimeout(700);
const claudeDimmed = await page.$eval('.row.claude', el => el.classList.contains('dim'));
await page.screenshot({ path: out + 'demo-3-highlight.png' });

// 추천 칩: 클라우드 위임 → reco에 codex 클래스
await page.click('.row.codex'); // un-highlight
await page.click('.chip[data-u="cloud"]');
await page.waitForTimeout(400);
const recoClass = await page.$eval('#reco', el => el.className);
await page.screenshot({ path: out + 'demo-4-reco.png' });

await browser.close();

const sweClaudeWide = parseFloat(sweClaudeW) > 78;
console.log('SWE Claude fill width:', sweClaudeW, sweClaudeWide ? '✓' : '✗');
console.log('성숙도 Claude 값:', matureClaude, matureClaude === '16개월' ? '✓' : '✗');
console.log('Terminal Codex 값:', termCodex, termCodex === '77.3%' ? '✓' : '✗');
console.log('행 클릭 강조(Claude dim):', claudeDimmed ? '✓' : '✗');
console.log('추천 칩(클라우드→codex):', recoClass, recoClass.includes('codex') ? '✓' : '✗');
console.log('콘솔 에러:', errors.length);
errors.forEach(e => console.log('  ' + e));
console.log('캡처:', out);
